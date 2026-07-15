import 'dotenv/config'
import app from './app.js'
import { connectDB } from './config/db.js'
import { redis } from './config/redis.js'

const PORT = process.env.PORT || 5000

async function start() {
  await connectDB()
  await redis.ping()
  app.listen(PORT, () => console.log(`Backend listening on http://localhost:${PORT}`))
}

start().catch((err) => {
  console.error('Failed to start server:', err.message)
  process.exit(1)
})
