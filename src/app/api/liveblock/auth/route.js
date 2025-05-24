import { Liveblocks } from "@liveblocks/node";
import { auth, currentUser } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

const liveblocks = new Liveblocks({
  secret: process.env.LIVEBLOCKS_SECRET_KEY,
});

// Function to validate ObjectId
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

    // If type is getNoti, no need to check permissions
    if (type === 'getNoti' && (roomId === undefined || roomId === 'abcd')) {
      const session = liveblocks.prepareSession(userId, {
        userInfo: {
          name: user?.username || "Guest",
          email: user?.emailAddresses[0]?.emailAddress,
          avatar: user?.imageUrl,
        },
      });
      session.allow(roomId || 'abc', session.FULL_ACCESS);
      const { body } = await session.authorize();
      return NextResponse.json({
        status: "success",
        message: "Full access granted",
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
    
    // Check if roomId is a valid ObjectId
    if (!isValidObjectId(roomId)) {
      return NextResponse.json(
        {
          status: "not_found",
          message: "Room does not exist"
        },
        { status: 404 }
      );
    }
    
    // Check access permissions from database
    const client = await clientPromise;
    const db = client.db('calis-docs');
    const usersCollection = db.collection('users');

    const userDoc = await usersCollection.findOne(
      { userId: userId },
      { projection: { documentIds: 1, _id: 0 } }
    );

    // Check if user has access to this document
    if (!userDoc?.documentIds?.includes(roomId)) {
      return NextResponse.json(
        {
          status: "forbidden",
          message: "No access to this document"
        },
        { status: 403 }
      );
    }

    // If user has permission, create session with full access
    const session = liveblocks.prepareSession(userId, {
      userInfo: {
        name: user?.username || "Guest",
        email: user?.emailAddresses[0]?.emailAddress,
        avatar: user?.imageUrl,
      },
    });
    session.allow(roomId, session.FULL_ACCESS);
    const { body } = await session.authorize();
    return NextResponse.json({
      status: "success",
      message: "Full access granted",
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
