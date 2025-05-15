import { Liveblocks } from "@liveblocks/node";
import { auth, currentUser } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

const liveblocks = new Liveblocks({
  secret: process.env.LIVEBLOCKS_SECRET_KEY,
});

// Hàm kiểm tra ObjectId hợp lệ
function isValidObjectId(id) {
  try {
    new ObjectId(id);
    return true;
  } catch (error) {
    return false;
  }
}

export async function POST(req) {
  try {
    const { userId } = auth();
    const user = await currentUser();
    if (!userId) {
      return NextResponse.json(
        {   
          status: "unauthorized",
          message: "Unauthorized"
        }, 
        { status: 401 }
      );
    }
    
    const { room: roomId, type } = await req.json();

    // Nếu type là getNoti thì không cần kiểm tra quyền
    if (type === 'getNoti' && (roomId === undefined || roomId === 'abcd')) {
      const session = liveblocks.prepareSession(userId, {
        userInfo: {
          name: user?.username || "Khách",
          email: user?.emailAddresses[0]?.emailAddress,
          avatar: user?.imageUrl,
        },
      });
      session.allow(roomId || 'abc', session.FULL_ACCESS);
      const { body } = await session.authorize();
      return NextResponse.json({
        status: "success",
        message: "Đã cấp quyền truy cập đầy đủ",
        token: JSON.parse(body).token
      }); 
    }
    
    if (type === 'getToken') {
      const session = liveblocks.prepareSession(userId, {
        userInfo: {},
      });
      session.allow(roomId, session.FULL_ACCESS);
      const { body } = await session.authorize();
      const token = JSON.parse(body).token; 
      return NextResponse.json({ token });
    }
    
    // Kiểm tra xem roomId có phải là ObjectId hợp lệ không
    if (!isValidObjectId(roomId)) {
      return NextResponse.json(
        {
          status: "not_found",
          message: "Phòng không tồn tại"
        },
        { status: 404 }
      );
    }
    
    // Kiểm tra quyền truy cập từ database
    const client = await clientPromise;
    const db = client.db('calis-docs');
    const usersCollection = db.collection('users');

    const userDoc = await usersCollection.findOne(
      { userId: userId },
      { projection: { documentIds: 1, _id: 0 } }
    );

    // Kiểm tra xem user có quyền truy cập document này không
    if (!userDoc?.documentIds?.includes(roomId)) {
      return NextResponse.json(
        {
          status: "forbidden",
          message: "Không có quyền truy cập document này"
        },
        { status: 403 }
      );
    }

    // Nếu có quyền, tạo session với full access
    const session = liveblocks.prepareSession(userId, {
      userInfo: {
        name: user?.username || "Khách",
        email: user?.emailAddresses[0]?.emailAddress,
        avatar: user?.imageUrl,
      },
    });
    session.allow(roomId, session.FULL_ACCESS);
    const { body } = await session.authorize();
    return NextResponse.json({
      status: "success",
      message: "Đã cấp quyền truy cập đầy đủ",
      token: JSON.parse(body).token
    });

  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { 
        status: "error",
        message: "Internal server error"
      }, 
      { status: 500 }
    );
  }
}
