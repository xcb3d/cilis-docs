import { NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import { currentUser, auth } from '@clerk/nextjs'
import { ObjectId } from 'mongodb'

export async function POST(req) {
  try {
    const { userId } = auth()
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const body = await req.json()
    const client = await clientPromise
    const db = client.db("calis-docs")
    
    // Lưu thêm creatorId khi tạo tài liệu
    const doc = await db.collection("documents").insertOne({
      ...body,
      userIds: [userId],
      creatorId: userId, // Thêm creatorId
      createdAt: new Date(),
      accessHistory: [{
        userId: userId,
        timestamp: new Date()
      }]
    })

    return NextResponse.json(doc)
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Error" },
      { status: 500 }
    )
  }
}

export async function GET(req) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    const client = await clientPromise;
    const db = client.db("calis-docs");
    
    // Tìm documents có chứa userId hiện tại trong mảng userIds
    const query = { userIds: userId };
    
    // Sử dụng aggregation pipeline để sắp xếp theo thời gian truy cập gần nhất
    const pipeline = [
      { $match: query },
      // Tìm lịch sử truy cập của user hiện tại
      {
        $addFields: {
          userAccess: {
            $filter: {
              input: "$accessHistory",
              as: "history",
              cond: { $eq: ["$$history.userId", userId] }
            }
          }
        }
      },
      // Thêm trường lastAccessed để sắp xếp
      {
        $addFields: {
          lastAccessed: {
            $cond: {
              if: { $gt: [{ $size: "$userAccess" }, 0] },
              then: { $max: "$userAccess.timestamp" },
              else: "$createdAt"
            }
          }
        }
      },
      // Sắp xếp theo thời gian truy cập gần đây nhất
      { $sort: { lastAccessed: -1 } },
      // Áp dụng pagination
      { $skip: skip },
      { $limit: limit },
      // Chỉ lấy các trường cần thiết
      {
        $project: {
          _id: 1,
          title: 1,
          description: 1,
          createdAt: 1,
          creatorId: 1,
          lastAccessed: 1
        }
      }
    ];

    // Thực hiện song song cả hai truy vấn
    const [total, paginatedDocs] = await Promise.all([
      db.collection("documents").countDocuments(query),
      db.collection("documents").aggregate(pipeline).toArray()
    ]);
    
    // Lấy danh sách creatorId duy nhất
    const creatorIds = [...new Set(paginatedDocs.map(doc => doc.creatorId))];
    
    // Lấy thông tin người dùng
    const users = creatorIds.length > 0 
      ? await db.collection("users").find({ userId: { $in: creatorIds } }).toArray()
      : [];
    
    // Tạo map từ userId sang thông tin người dùng
    const userMap = {};
    users.forEach(user => {
      userMap[user.userId] = {
        name: user.name || user.email?.split('@')[0] || 'Unknown',
        imageUrl: user.imageUrl
      };
    });
    
    // Thêm thông tin người tạo vào documents
    const processedDocs = paginatedDocs.map(doc => {
      const creator = userMap[doc.creatorId] || { name: 'Unknown User' };
      
      return {
        ...doc,
        creator
      };
    });

    return NextResponse.json({
      documents: processedDocs,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasMore: page * limit < total
      }
    });

  } catch (error) {
    console.error("Error fetching documents:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}



