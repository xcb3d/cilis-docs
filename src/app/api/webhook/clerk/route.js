// app/api/webhook/clerk/route.ts
import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { WebhookEvent } from '@clerk/nextjs/server'
import clientPromise from '@/lib/mongodb'

export async function POST(req) {
  
  try {
    const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET

    if (!WEBHOOK_SECRET) {
      console.error('WEBHOOK_SECRET is missing');
      return new Response('Configuration error', {
        status: 500
      })
    }

    // Log headers
    const headerPayload = headers();
    const svix_id = headerPayload.get("svix-id");
    const svix_timestamp = headerPayload.get("svix-timestamp");
    const svix_signature = headerPayload.get("svix-signature");


    if (!svix_id || !svix_timestamp || !svix_signature) {
      console.error('Missing required headers');
      return new Response('Missing required headers', {
        status: 400
      })
    }

    // Log request body
    const payload = await req.json()
    const body = JSON.stringify(payload);

    // Verify webhook
    const wh = new Webhook(WEBHOOK_SECRET);
    let evt

    try {
      evt = wh.verify(body, {
        "svix-id": svix_id,
        "svix-timestamp": svix_timestamp,
        "svix-signature": svix_signature,
      })
    } catch (err) {
      console.error('Webhook verification failed:', err);
      return new Response('Webhook verification failed', {
        status: 400
      })
    }

    // Kết nối MongoDB
    const client = await clientPromise;
    const db = client.db("calis-docs");

    if (evt.type === 'user.created') {
      try {
        const { id, email_addresses, username, first_name, last_name, image_url } = evt.data;
        
        // Tạo user document
        const user = {
          userId: id,
          email: email_addresses[0]?.email_address,
          username: username,
          firstName: first_name,
          lastName: last_name,
          imageUrl: image_url,
          createdAt: new Date(),
          updatedAt: new Date(),
          documentIds: [],
        }

        // Thêm vào collection users
        await db.collection('users').insertOne(user);
        
        return new Response('User created successfully', {
          status: 200
        })
      } catch (error) {
        console.error('Database operation failed:', error);
        return new Response('Database operation failed', {
          status: 500
        })
      }
    } 
    // Thêm xử lý cho sự kiện user.updated
    else if (evt.type === 'user.updated') {
      try {
        const { id, email_addresses, username, first_name, last_name, image_url } = evt.data;
        
        // Cập nhật thông tin user
        const updatedUserData = {
          email: email_addresses[0]?.email_address,
          username: username,
          firstName: first_name,
          lastName: last_name,
          imageUrl: image_url,
          updatedAt: new Date(),
        };

        // Cập nhật user trong database
        await db.collection('users').updateOne(
          { userId: id },
          { $set: updatedUserData }
        );
        
        return new Response('User updated successfully', {
          status: 200
        })
      } catch (error) {
        console.error('Database update failed:', error);
        return new Response('Database update failed', {
          status: 500
        })
      }
    }

    return new Response('Webhook processed', {
      status: 200
    })
  } catch (error) {
    console.error('Unexpected error:', error);
    return new Response('Internal server error', {
      status: 500
    })
  }
}
