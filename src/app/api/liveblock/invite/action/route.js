import { auth } from "@clerk/nextjs";
import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

export async function POST(request) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new Response(JSON.stringify({ message: "Unauthorized", status: 401 }), { status: 401 });
    }

    const body = await request.json();
    const client = await clientPromise;
    const db = client.db("calis-docs");

    const { subjectId, action } = body; // Thêm trường action để xác định accept hay reject

    if (!subjectId || !action) {
      return new Response(JSON.stringify({ message: "Missing required information", status: 400 }), { status: 400 });
    }

    // Kiểm tra giá trị của action
    if (action !== "accept" && action !== "decline") {
      return new Response(JSON.stringify({ message: "Invalid action", status: 400 }), { status: 400 });
    }

    // Tìm lời mời theo subjectId
    const invite = await db.collection("invites").findOne({ subjectId: subjectId });

    if (!invite) {
      return new Response(JSON.stringify({ message: "Invite not found", status: 404 }), { status: 404 });
    }

    // Kiểm tra xem người dùng có phải là người được mời không
    if (invite.inviteeId !== userId) {
      return new Response(JSON.stringify({ message: "User does not have permission to perform this action", status: 403 }), { status: 403 });
    }

    if (action === "accept") {
      // Thêm userId vào document
      const updateResult = await db.collection("documents").updateOne(
        { _id: new ObjectId(invite.roomId) },
        { $addToSet: { userIds: userId } } // Sử dụng $addToSet để tránh trùng lặp
      );

      if (updateResult.matchedCount === 0) {
        return new Response(JSON.stringify({ 
          message: "Document not found", 
          status: 404 
        }), { status: 404 });
      }

      const userUpdate = await db.collection("users").updateOne(
        { userId: userId },
        { $addToSet: { documentIds: invite.roomId } },
        { upsert: true } // Tạo mới nếu chưa tồn tại
      );
    }

    // Cập nhật trạng thái của lời mời dựa trên action
    const newStatus = action === "accept" ? "ACCEPT" : "REJECT";
    
    await db.collection("invites").updateOne(
      { subjectId: subjectId },
      { $set: { status: newStatus } }
    );

    // Trả về thành công
    return new Response(JSON.stringify({ message: `Successfully ${newStatus.toLowerCase()} invite`, status: 200 }), { status: 200 });
  } catch (error) {
    console.error("Error in POST request:", error);
    return new Response(JSON.stringify({ message: "An error occurred", status: 500 }), { status: 500 });
  }
}
