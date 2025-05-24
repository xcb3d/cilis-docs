import { Liveblocks } from "@liveblocks/node";
import { auth } from "@clerk/nextjs";
import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { ObjectId } from "mongodb";

const liveblocks = new Liveblocks({
  secret: process.env.LIVEBLOCKS_SECRET_KEY,
});

export async function POST(request) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new Response(JSON.stringify({ message: "Unauthorized", status: 401 }), { status: 401 });
    }

    const body = await request.json();
    const client = await clientPromise;
    const db = client.db("calis-docs");

    const { email, data } = body;

    if (!email || !data) {
      return new Response(JSON.stringify({ message: "Missing required information", status: 400 }), { status: 400 });
    }

    // Tìm userId của email
    const user = await db.collection("users").findOne({ email: email });

    if (!user) {
      return new Response(JSON.stringify({ message: "Email does not exist", status: 404 }), { status: 404 });
    }

    const document = await db.collection("documents").findOne({ 
      _id: new ObjectId(data.roomId),
      userIds: user.userId 
    });

    if (document) {
      return new Response(JSON.stringify({ 
        message: "This user is already a member of this document", 
        status: 409 
      }), { status: 409 });
    }    

    // Kiểm tra lời mời đã tồn tại hay chưa
    const existingInvite = await db.collection("invites").findOne({
      inviteeId: user.userId,
      roomId: data.roomId,
      $or: [
        { status: "PENDING" },
        { status: "ACCEPT" }
      ]
    });

    if (existingInvite) {
      return new Response(JSON.stringify({ message: "This user has already received an invitation or joined the document", status: 409 }), { status: 409 });
    }

    const invitedData = {
      inviteFrom: userId,
      roomId: data.roomId
    };

    // Nếu không có lời mời trùng lặp, gửi lời mời mới
    try {
      const subjectId = nanoid();

      await liveblocks.triggerInboxNotification({
        userId: user.userId,
        kind: "$invite",
        subjectId: subjectId,
        activityData: invitedData,
      });

      // Ghi vào database
      await db.collection("invites").insertOne({
        inviteeId: user.userId,
        roomId: data.roomId,
        status: "PENDING",
        subjectId: subjectId,
        inviteFrom: userId,
        createdAt: new Date(),
      });

    } catch (error) {
      console.error("Liveblocks notification error:", error);
      return new Response(JSON.stringify({ message: "Unable to send invitation", status: 500 }), { status: 500 });
    }

    // Trả về thành công
    return new Response(JSON.stringify({ message: "Invitation sent successfully", status: 200 }), { status: 200 });
  } catch (error) {
    console.error("Error in POST request:", error);
    return new Response(JSON.stringify({ message: "An error occurred", status: 500 }), { status: 500 });
  }
}
