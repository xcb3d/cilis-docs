import { NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import { auth } from '@clerk/nextjs'


export async function PATCH(request) {
    try {
        // Xác thực với Clerk
        const { userId } = auth()
        if (!userId) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            )
        }

        // Lấy documentId từ request body
        const { documentId } = await request.json()

        // Validate documentId
        if (!documentId) {
            return NextResponse.json(
                { error: 'Document ID is required' },
                { status: 400 }
            )
        }

        // Kết nối database
        const client = await clientPromise
        const db = client.db('calis-docs')
        const usersCollection = db.collection('users')

        // Tìm và cập nhật user, tạo mới nếu chưa tồn tại
        const result = await usersCollection.updateOne(
            { userId: userId },
            {
                $addToSet: { documentIds: documentId },
                $setOnInsert: { 
                    userId: userId,
                    createdAt: new Date()
                }
            },
            { upsert: true } // Tạo mới document nếu không tồn tại
        )

        return NextResponse.json(
            { 
                message: 'Update successfully',
                updated: result.modifiedCount > 0,
                created: result.upsertedCount > 0
            },
            { status: 200 }
        )

    } catch (error) {
        console.error('Error updating user:', error)
        return NextResponse.json(
            { error: 'Server error' },
            { status: 500 }
        )
    }
}