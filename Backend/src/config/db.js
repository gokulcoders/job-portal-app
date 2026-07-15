import mongoose from 'mongoose'

export async function connectDB() {
  mongoose.set('strictQuery', true)

  if (mongoose.connection.readyState === 1) {
    return
  }

  await mongoose.connect(process.env.MONGODB_URI)

  console.log(`MongoDB connected: ${mongoose.connection.host}/${mongoose.connection.name}`)

  mongoose.connection.on('error', (err) => {
    console.error('MongoDB connection error:', err.message)
  })
}
