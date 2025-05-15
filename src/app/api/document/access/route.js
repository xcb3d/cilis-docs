import { NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import { auth } from '@clerk/nextjs'
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

    const { documentId } = await req.json()
    
    if (!documentId) {
      return NextResponse.json(
        { error: "Document ID is required" },
        { status: 400 }
      )
    }

    const client = await clientPromise
    const db = client.db("calis-docs")
    
    // Kiểm tra xem người dùng có quyền truy cập tài liệu không
    const document = await db.collection("documents").findOne({
      _id: new ObjectId(documentId),
      userIds: userId
    })

    if (!document) {
      return NextResponse.json(
        { error: "Document not found or access denied" },
        { status: 404 }
      )
    }

    // Xóa lịch sử truy cập cũ của người dùng này (nếu có)
    await db.collection("documents").updateOne(
      { _id: new ObjectId(documentId) },
      { 
        $pull: { 
          "accessHistory": { userId: userId } 
        }
      }
    )
    
    // Thêm lịch sử truy cập mới
    await db.collection("documents").updateOne(
      { _id: new ObjectId(documentId) },
      { 
        $push: { 
          "accessHistory": {
            userId: userId,
            timestamp: new Date()
          }
        }
      }
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Error" },
      { status: 500 }
    )
  }
}
