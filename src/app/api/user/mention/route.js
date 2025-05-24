import { NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import { auth } from '@clerk/nextjs'

export async function GET(req) {
  try {
      // Authentication with Clerk
      const { userId } = auth()
      if (!userId) {
          return NextResponse.json({
              status: "unauthorized",
              message: "Unauthorized",
              users: []
          }, { status: 401 })
      }

      // Get params from URL
      const { searchParams } = new URL(req.url)
      const text = searchParams.get('text')
      const roomId = searchParams.get('roomId')

      // Connect to database
      const client = await clientPromise
      const db = client.db('calis-docs')
      const usersCollection = db.collection('users')

      // Find users matching conditions
      const users = await usersCollection.find({
          username: { 
              $regex: text, 
              $options: 'i'
          },
          documentIds: roomId,
          userId: { $ne: userId }
      }, {
          projection: {
              userId: 1,
              username: 1,
              avatar: 1,
              _id: 0
          }
      }).toArray()

      // Return response with cache headers
      const userIds = users.map(user => user.userId)
      return NextResponse.json({
          status: "success",
          message: "Users found",
          userIds
      }, { 
          status: 200,
          headers: {
              'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=30'
          }
      })

  } catch (error) {
      console.error('Error finding users:', error)
      return NextResponse.json({
          status: "error",
          message: "Server error",
          users: []
      }, { status: 500 })
  }
}
