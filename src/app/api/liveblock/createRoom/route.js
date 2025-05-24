// src/app/api/liveblock/createRoom/route.js
import { auth } from "@clerk/nextjs";
import { Liveblocks } from "@liveblocks/node";
import { NextResponse } from "next/server";

const liveblocks = new Liveblocks({
  secret: process.env.LIVEBLOCKS_SECRET_KEY,
});

export async function POST(request) {
  try {
    const { userId } = auth()
    const { roomId } = await request.json();

    // Create new room
    await liveblocks.createRoom(roomId, {
      defaultAccesses: [],
      usersAccesses: {
        [userId]: ["room:write"]
      },
      metadata: {
        documentId:  roomId,
        createdAt: new Date().toISOString(),
      },
    });
    

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error creating room:", error);
    return NextResponse.json(
      { error: "Error creating room" },
      { status: 500 }
    );
  }
}
