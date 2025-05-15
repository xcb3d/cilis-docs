// app/api/documents/[id]/route.js
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import clientPromise from "@/lib/mongodb";

export async function GET(req, { params }) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { error: 'ID is required' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("calis-docs");

    const document = await db.collection('documents').findOne({
      _id: new ObjectId(id),
      // userIds: userId
    });

    if (!document) {
      return NextResponse.json(
        { error: 'Document not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ title: document.title, template: document.template });

  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function DELETE(req, { params }) {
  try {
    // Xác thực người dùng
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = params;
    if (!id) {
      return NextResponse.json(
        { error: 'ID is required' },
        { status: 400 }
      );
    }

    // Kết nối database
    const client = await clientPromise;
    const db = client.db("calis-docs");

    // Kiểm tra document tồn tại và người dùng có quyền xóa
    const document = await db.collection('documents').findOne({
      _id: new ObjectId(id)
    });

    if (!document) {
      return NextResponse.json(
        { error: 'Document not found' },
        { status: 404 }
      );
    }

    // Kiểm tra xem người dùng hiện tại có phải là người tạo document không
    if (document.creatorId !== userId) {
      return NextResponse.json(
        { error: 'Permission denied. Only the creator can delete this document' },
        { status: 403 }
      );
    }

    // Thực hiện xóa document
    const result = await db.collection('documents').deleteOne({
      _id: new ObjectId(id)
    });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: 'Failed to delete document' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: 'Document deleted successfully' },
      { status: 200 }
    );

  } catch (error) {
    console.error("[DOCUMENT_DELETE]", error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}


export async function PATCH(req, { params }) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;
    const body = await req.json();
    const { userIds, title } = body;

    const client = await clientPromise;
    const db = client.db("calis-docs");

    const updateData = {
      $set: {
        updatedAt: new Date()
      }
    };

    // Thêm userIds vào update operation nếu có
    if (userIds) {
      updateData.$addToSet = {
        userIds: { $each: userIds }
      };
    }

    // Thêm content vào update operation nếu có
    if (title !== undefined) {
      updateData.$set.title = title;
    }

    const updatedDoc = await db.collection("documents").findOneAndUpdate(
      { _id: new ObjectId(id) },
      updateData,
      { returnDocument: 'after' }
    );

    if (!updatedDoc) {
      return NextResponse.json(
        { error: "Document not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedDoc);
  } catch (error) {
    console.error("[DOCUMENT_UPDATE]", error);
    return NextResponse.json(
      { error: "Internal Error" },
      { status: 500 }
    );
  }
}
