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
      return new Response(JSON.stringify({ message: "Thiếu thông tin bắt buộc", status: 400 }), { status: 400 });
    }

    // Kiểm tra giá trị của action
    if (action !== "accept" && action !== "decline") {
      return new Response(JSON.stringify({ message: "Hành động không hợp lệ", status: 400 }), { status: 400 });
    }

    // Tìm lời mời theo subjectId
    const invite = await db.collection("invites").findOne({ subjectId: subjectId });

    if (!invite) {
      return new Response(JSON.stringify({ message: "Lời mời không tồn tại", status: 404 }), { status: 404 });
    }

    // Kiểm tra xem người dùng có phải là người được mời không
    if (invite.inviteeId !== userId) {
      return new Response(JSON.stringify({ message: "Người dùng không có quyền thực hiện hành động này", status: 403 }), { status: 403 });
    }

    if (action === "accept") {
      // Thêm userId vào document
      const updateResult = await db.collection("documents").updateOne(
        { _id: new ObjectId(invite.roomId) },
        { $addToSet: { userIds: userId } } // Sử dụng $addToSet để tránh trùng lặp
      );

      if (updateResult.matchedCount === 0) {
        return new Response(JSON.stringify({ 
          message: "Tài liệu không tồn tại", 
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
    return new Response(JSON.stringify({ message: `Đã ${newStatus.toLowerCase()} lời mời thành công`, status: 200 }), { status: 200 });
  } catch (error) {
    console.error("Error in POST request:", error);
    return new Response(JSON.stringify({ message: "Có lỗi xảy ra", status: 500 }), { status: 500 });
  }
}
