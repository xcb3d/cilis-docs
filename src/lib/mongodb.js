import { MongoClient } from 'mongodb'

if (!process.env.MONGODB_URI) {
  throw new Error('Missing MONGODB_URI environment variable')
}

const uri = process.env.MONGODB_URI
const options = {}

let client
let clientPromise

if (process.env.BUILD_MODE === 'dev') {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options)
    global._mongoClientPromise = client.connect()
  }
  clientPromise = global._mongoClientPromise
} else {
  client = new MongoClient(uri, options)
  clientPromise = client.connect()
}

export default clientPromise
