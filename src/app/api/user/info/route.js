import { NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import { auth } from '@clerk/nextjs'

export async function GET(req) {
  try {
      // Xác thực với Clerk
      const { userId } = auth()
      if (!userId) {
          return NextResponse.json({
              status: "unauthorized",
              message: "Unauthorized",
              users: []
          }, { status: 401 })
      }

      // Lấy userIds từ query params
      const { searchParams } = new URL(req.url)
      const userIdsString = searchParams.get('userIds')
      
      if (!userIdsString) {
          return NextResponse.json({
              status: "error",
              message: "userIds is required",
              users: []
          }, { status: 400 })
      }

      // Split string thành array
      const userIds = userIdsString.split(',')

      // Kết nối database
      const client = await clientPromise
      const db = client.db('calis-docs')
      const usersCollection = db.collection('users')

      // Tìm tất cả users có userId nằm trong mảng userIds
      const users = await usersCollection.find(
          { 
              userId: { $in: userIds }
          },
          {
              projection: {
                  username: 1,
                  imageUrl: 1,
                  _id: 0
              }
          }
      ).toArray()

      // Format lại data theo yêu cầu
      const formattedUsers = users.map(user => ({
          name: user.username,
          avatar: user.imageUrl || "https://liveblocks.io/avatars/avatar-1.png"
      }))

      return NextResponse.json({
          status: "success",
          users: formattedUsers
      }, { 
          status: 200,
          headers: {
              'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=30'
          }
      })

  } catch (error) {
      console.error('Lỗi khi lấy thông tin users:', error)
      return NextResponse.json({
          status: "error",
          message: "Lỗi server",
          users: []
      }, { status: 500 })
  }
}
