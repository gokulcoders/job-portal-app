import mongoose from 'mongoose'
import { redis } from '../../config/redis.js'
import cloudinary from '../../config/cloudinary.js'
import { deleteExpiredPosts } from '../featuredPosts/featuredPosts.service.js'
import { sendWatchReminders } from '../courses/courses.service.js'

// Parses ioredis' INFO text blob ("# Section\r\nkey:value\r\n...") into a flat object.
function parseRedisInfo(text) {
  const out = {}
  for (const line of text.split('\r\n')) {
    if (!line || line.startsWith('#')) continue
    const idx = line.indexOf(':')
    if (idx === -1) continue
    out[line.slice(0, idx)] = line.slice(idx + 1)
  }
  return out
}

async function getRedisHealth() {
  try {
    const [infoText, dbSize] = await Promise.all([redis.info(), redis.dbsize()])
    const info = parseRedisInfo(infoText)
    return {
      status: 'up',
      version: info.redis_version,
      uptimeSeconds: Number(info.uptime_in_seconds || 0),
      connectedClients: Number(info.connected_clients || 0),
      usedMemoryBytes: Number(info.used_memory || 0),
      usedMemoryHuman: info.used_memory_human,
      peakMemoryBytes: Number(info.used_memory_peak || 0),
      keyCount: dbSize,
    }
  } catch (err) {
    return { status: 'down', error: err.message }
  }
}

async function getMongoHealth() {
  try {
    if (mongoose.connection.readyState !== 1) {
      return { status: 'down', error: 'Not connected' }
    }
    const stats = await mongoose.connection.db.stats()
    return {
      status: 'up',
      host: mongoose.connection.host,
      database: mongoose.connection.name,
      collections: stats.collections,
      documents: stats.objects,
      dataSizeBytes: stats.dataSize,
      storageSizeBytes: stats.storageSize,
      indexSizeBytes: stats.indexSize,
      indexes: stats.indexes,
    }
  } catch (err) {
    return { status: 'down', error: err.message }
  }
}

async function getImageStorageHealth() {
  try {
    const usage = await cloudinary.api.usage()
    return {
      status: 'up',
      plan: usage.plan,
      storageBytes: usage.storage?.usage ?? 0,
      storageLimitBytes: usage.storage?.limit ?? null,
      bandwidthBytes: usage.bandwidth?.usage ?? 0,
      bandwidthLimitBytes: usage.bandwidth?.limit ?? null,
      resourceCount: usage.resources ?? 0,
      derivedResourceCount: usage.derived_resources ?? 0,
      credits: usage.credits ? { usage: usage.credits.usage, limit: usage.credits.limit } : null,
      lastUpdated: usage.last_updated,
    }
  } catch (err) {
    return { status: 'down', error: err.message }
  }
}

export async function getHealth() {
  const [redisHealth, mongoHealth, imageHealth] = await Promise.all([
    getRedisHealth(),
    getMongoHealth(),
    getImageStorageHealth(),
  ])
  return { redis: redisHealth, mongo: mongoHealth, imageStorage: imageHealth, checkedAt: new Date() }
}

// Clears the Redis cache (OTPs + rate-limit counters). Non-destructive to
// Mongo/Cloudinary data — only affects short-lived, regenerable Redis keys.
export async function flushCache() {
  const before = await redis.dbsize()
  await redis.flushdb()
  return { keysCleared: before }
}

// Manually re-runs the scheduled maintenance jobs (normally hourly/daily cron)
// on demand, so an admin doesn't have to wait for the next scheduled tick.
export async function runCleanupJobs() {
  const [expiredPostsDeleted, watchRemindersSent] = await Promise.all([
    deleteExpiredPosts(),
    sendWatchReminders(2),
  ])
  return { expiredPostsDeleted, watchRemindersSent }
}
