// app/api/liveblocks/deleteRoom/route.js
import { Liveblocks } from "@liveblocks/node";
import { auth } from "@clerk/nextjs";

const liveblocks = new Liveblocks({
  secret: process.env.LIVEBLOCKS_SECRET_KEY,
});

export async function DELETE(request) {
  try {
    // Xác thực với Clerk
    const { userId } = auth();
    
    if (!userId) {
      return new Response("Unauthorized", { status: 401 });
    }

    // Lấy roomId từ URL params
    const { searchParams } = new URL(request.url);
    const roomId = searchParams.get("roomId");

    if (!roomId) {
      return new Response("Room ID is required", { status: 400 });
    }
    // Xóa room từ Liveblocks
    await liveblocks.deleteRoom(roomId);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });

  } catch (error) {
    console.error("Error deleting room:", error);
    return new Response(
      JSON.stringify({ 
        error: "Error deleting room",
        details: error.message 
      }), 
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
}
