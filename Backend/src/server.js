import 'dotenv/config'
import cron from 'node-cron'
import app from './app.js'
import { connectDB } from './config/db.js'
import { redis } from './config/redis.js'
import { deleteExpiredPosts } from './modules/featuredPosts/featuredPosts.service.js'
import { sendWatchReminders } from './modules/courses/courses.service.js'

const PORT = process.env.PORT || 5000

async function start() {
  await connectDB()
  await redis.ping()
  app.listen(PORT, () => console.log(`Backend listening on http://localhost:${PORT}`))

  // Hourly cleanup — deletes FeaturedPosts whose lastDate has passed, along with
  // their Cloudinary images.
  cron.schedule('0 * * * *', async () => {
    try {
      const deleted = await deleteExpiredPosts()
      if (deleted > 0) console.log(`[featured-posts-cleanup] Removed ${deleted} expired post(s).`)
    } catch (err) {
      console.error('[featured-posts-cleanup] Failed:', err.message)
    }
  }, { timezone: 'Asia/Kolkata' })

  // Also run once on boot so stale posts don't linger until the next hour mark.
  deleteExpiredPosts().catch(err => console.error('[featured-posts-cleanup] Startup run failed:', err.message))

  // Daily "continue watching" reminders for users who started a course and
  // went quiet for 2+ days without finishing it.
  cron.schedule('0 9 * * *', async () => {
    try {
      const reminded = await sendWatchReminders(2)
      if (reminded > 0) console.log(`[course-reminders] Sent ${reminded} watch reminder(s).`)
    } catch (err) {
      console.error('[course-reminders] Failed:', err.message)
    }
  }, { timezone: 'Asia/Kolkata' })
}

start().catch((err) => {
  console.error('Failed to start server:', err.message)
  process.exit(1)
})
