// app/api/document/info/route.ts

import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs"
import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export async function POST(req) {
  try {
    const { userId } = auth()
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { roomIds } = await req.json()
    
    if (!Array.isArray(roomIds)) {
      return NextResponse.json(
        { error: "Invalid roomIds format" },
        { status: 400 }
      )
    }

    // Chuyển đổi mảng string ids thành mảng ObjectId
    const objectIds = roomIds.map(id => new ObjectId(id))

    const client = await clientPromise
    const db = client.db("calis-docs")

    const documents = await db
      .collection("documents")
      .find({
        _id: { $in: objectIds },
        userIds: userId
      })
      .project({ title: 1 })
      .toArray()

    const formattedDocs = documents.map(doc => ({
      name: doc.title,
    })) 


    return NextResponse.json(formattedDocs)

  } catch (error) {
    console.error("[DOCUMENT_INFO]", error)
    return NextResponse.json(
      { error: "Internal Error" },
      { status: 500 }
    )
  }
}
