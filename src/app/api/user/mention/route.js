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

      // Lấy params từ URL
      const { searchParams } = new URL(req.url)
      const text = searchParams.get('text')
      const roomId = searchParams.get('roomId')

      // Kết nối database
      const client = await clientPromise
      const db = client.db('calis-docs')
      const usersCollection = db.collection('users')

      // Tìm users thỏa mãn điều kiện
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

      // Trả về response với cache headers
      const userIds = users.map(user => user.userId)
      return NextResponse.json({
          status: "success",
          message: "Tìm thấy người dùng",
          userIds
      }, { 
          status: 200,
          headers: {
              'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=30'
          }
      })

  } catch (error) {
      console.error('Lỗi khi tìm users:', error)
      return NextResponse.json({
          status: "error",
          message: "Lỗi server",
          users: []
      }, { status: 500 })
  }
}
