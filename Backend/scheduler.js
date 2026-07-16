import 'dotenv/config'
import http from 'http'
import cron from 'node-cron'
import { connectDB }        from './src/config/db.js'
import { cleanupOldJobs }  from './src/modules/jobs/jobs.service.js'
import { runScraper }       from './scraper/jobscrapper.js'
import { runNaukriScraper } from './scraper/naukriScraper.js'

const SCRAPER_PORT    = Number(process.env.SCRAPER_PORT) || 5001
// Default: every 6 hours (360 min) — scrapers cover many locations, need time between runs
const intervalMinutes = Number(process.env.SCRAPER_INTERVAL_MINUTES) || 360
// Cron: "0 */6 * * *" = every 6 hours at :00
const scheduleExpr    = intervalMinutes >= 60
  ? `0 */${Math.max(1, Math.floor(intervalMinutes / 60))} * * *`
  : `*/${Math.max(1, intervalMinutes)} * * * *`

// ── State ──────────────────────────────────────────────────────────────────
const state = {
  running:    false,
  lastRun:    null,   // ISO string
  lastStatus: null,   // 'success' | 'failed'
  lastError:  null,
  nextRun:    null,   // ISO string
  totalRuns:  0,
  failedRuns: 0,
}

function computeNextRun() {
  const now  = new Date()
  const next = new Date(now)
  next.setSeconds(0, 0)
  next.setMinutes(Math.ceil(now.getMinutes() / intervalMinutes) * intervalMinutes)
  if (next <= now) next.setMinutes(next.getMinutes() + intervalMinutes)
  state.nextRun = next.toISOString()
}

// ── Run both scrapers sequentially ─────────────────────────────────────────
async function runAllScrapers(source = 'cron') {
  if (state.running) {
    console.log(`Scraper already running — skipping (triggered by ${source})`)
    return { skipped: true, reason: 'already_running' }
  }

  state.running   = true
  state.lastRun   = new Date().toISOString()
  state.lastError = null
  state.totalRuns += 1
  console.log(`[${source}] All scrapers started at ${state.lastRun}`)

  const errors = []

  // 0. Clean up expired jobs first (older than 24h)
  try {
    const deleted = await cleanupOldJobs(24)
    if (deleted > 0) console.log(`Cleanup: removed ${deleted} expired job(s) from DB.`)
  } catch (err) {
    console.error('Cleanup failed (non-fatal):', err.message)
  }

  // 1. LinkedIn scraper
  try {
    console.log('\n=== LINKEDIN SCRAPER ===')
    await runScraper()
    console.log('LinkedIn scraper done.')
  } catch (err) {
    console.error('LinkedIn scraper failed:', err.message)
    errors.push(`LinkedIn: ${err.message}`)
  }

  // 2. Naukri scraper
  try {
    console.log('\n=== NAUKRI SCRAPER ===')
    await runNaukriScraper()
    console.log('Naukri scraper done.')
  } catch (err) {
    console.error('Naukri scraper failed:', err.message)
    errors.push(`Naukri: ${err.message}`)
  }

  if (errors.length === 0) {
    state.lastStatus = 'success'
    console.log(`All scrapers completed at ${new Date().toISOString()}`)
  } else {
    state.lastStatus = 'failed'
    state.lastError  = errors.join(' | ')
    state.failedRuns += 1
  }

  state.running = false
  computeNextRun()
  return errors.length === 0 ? { success: true } : { success: false, error: state.lastError }
}

// ── Run individual scraper ─────────────────────────────────────────────────
async function runScheduledScraper(which = 'all', source = 'cron') {
  if (state.running) {
    console.log(`Scraper already running — skipping (${source})`)
    return { skipped: true, reason: 'already_running' }
  }
  if (which === 'naukri') {
    state.running = true
    state.lastRun = new Date().toISOString()
    state.totalRuns += 1
    try {
      await runNaukriScraper()
      state.lastStatus = 'success'
      return { success: true }
    } catch (err) {
      state.lastStatus = 'failed'
      state.lastError  = err.message
      state.failedRuns += 1
      return { success: false, error: err.message }
    } finally {
      state.running = false
      computeNextRun()
    }
  }
  if (which === 'linkedin') {
    state.running = true
    state.lastRun = new Date().toISOString()
    state.totalRuns += 1
    try {
      await runScraper()
      state.lastStatus = 'success'
      return { success: true }
    } catch (err) {
      state.lastStatus = 'failed'
      state.lastError  = err.message
      state.failedRuns += 1
      return { success: false, error: err.message }
    } finally {
      state.running = false
      computeNextRun()
    }
  }
  return runAllScrapers(source)
}

// ── HTTP server ────────────────────────────────────────────────────────────
function json(res, statusCode, data) {
  const body = JSON.stringify(data, null, 2)
  res.writeHead(statusCode, {
    'Content-Type':  'application/json',
    'Content-Length': Buffer.byteLength(body),
  })
  res.end(body)
}

const server = http.createServer(async (req, res) => {
  const { method, url } = req

  // ── GET /health ──────────────────────────────────────────────────────────
  if (method === 'GET' && url === '/health') {
    return json(res, 200, { status: 'ok', uptime: process.uptime() })
  }

  // ── GET /status ──────────────────────────────────────────────────────────
  if (method === 'GET' && url === '/status') {
    return json(res, 200, {
      running:          state.running,
      lastRun:          state.lastRun,
      lastStatus:       state.lastStatus,
      lastError:        state.lastError,
      nextRun:          state.nextRun,
      totalRuns:        state.totalRuns,
      failedRuns:       state.failedRuns,
      intervalMinutes,
      schedule:         scheduleExpr,
      keywords:         (process.env.SCRAPER_KEYWORDS || 'node,java,javascript').split(',').map(k => k.trim()),
    })
  }

  // ── POST /trigger — run all scrapers ────────────────────────────────────
  if (method === 'POST' && url === '/trigger') {
    if (state.running) return json(res, 409, { message: 'Scraper is already running' })
    runAllScrapers('manual-trigger').catch(() => {})
    return json(res, 202, { message: 'Both scrapers triggered', startedAt: state.lastRun })
  }

  // ── POST /trigger/linkedin ────────────────────────────────────────────────
  if (method === 'POST' && url === '/trigger/linkedin') {
    if (state.running) return json(res, 409, { message: 'Scraper is already running' })
    runScheduledScraper('linkedin', 'manual').catch(() => {})
    return json(res, 202, { message: 'LinkedIn scraper triggered' })
  }

  // ── POST /trigger/naukri ──────────────────────────────────────────────────
  if (method === 'POST' && url === '/trigger/naukri') {
    if (state.running) return json(res, 409, { message: 'Scraper is already running' })
    runScheduledScraper('naukri', 'manual').catch(() => {})
    return json(res, 202, { message: 'Naukri scraper triggered' })
  }

  // ── POST /cleanup — delete expired jobs immediately ───────────────────────
  if (method === 'POST' && url === '/cleanup') {
    try {
      const deleted = await cleanupOldJobs(24)
      return json(res, 200, { message: `Deleted ${deleted} expired job(s)`, deleted })
    } catch (err) {
      return json(res, 500, { error: err.message })
    }
  }

  // ── 404 ───────────────────────────────────────────────────────────────────
  return json(res, 404, {
    error: 'Not found',
    routes: [
      'GET  /health             — liveness check',
      'GET  /status             — scraper state & stats',
      'POST /trigger            — run both scrapers now',
      'POST /trigger/linkedin   — run LinkedIn only',
      'POST /trigger/naukri     — run Naukri only',
      'POST /cleanup            — delete jobs older than 24h now',
    ],
  })
})

// ── Bootstrap ──────────────────────────────────────────────────────────────
connectDB().then(() => {
  server.listen(SCRAPER_PORT, () => {
    console.log(`Scraper service on http://localhost:${SCRAPER_PORT}`)
    console.log(`  POST /trigger           — both scrapers`)
    console.log(`  POST /trigger/linkedin  — LinkedIn only`)
    console.log(`  POST /trigger/naukri    — Naukri only`)
    console.log(`  POST /cleanup           — delete expired jobs now`)
    console.log(`  GET  /status            — scraper state`)
    console.log(`Cron: every ${intervalMinutes} minutes  [${scheduleExpr}]`)
  })

  // ── Hourly cleanup — delete jobs older than 24h even between scraper runs ──
  cron.schedule('0 * * * *', async () => {
    try {
      const deleted = await cleanupOldJobs(24)
      if (deleted > 0) console.log(`[hourly-cleanup] Removed ${deleted} expired job(s).`)
    } catch (err) {
      console.error('[hourly-cleanup] Failed:', err.message)
    }
  }, { timezone: 'Asia/Kolkata' })

  // ── Main scraper cron ──────────────────────────────────────────────────────
  computeNextRun()
  cron.schedule(scheduleExpr, () => runAllScrapers('cron'), {
    scheduled: true,
    timezone: 'Asia/Kolkata',
  })

  // Run once immediately on startup
  runAllScrapers('startup').catch((err) => {
    console.error('Startup scraper run failed:', err)
  })
}).catch(err => {
  console.error('Failed to connect to MongoDB:', err.message)
  process.exit(1)
})

// ── Process error handlers ─────────────────────────────────────────────────
process.on('unhandledRejection', (reason) => {
  console.error('Unhandled rejection in scheduler:', reason)
})

process.on('uncaughtException', (error) => {
  console.error('Uncaught exception in scheduler:', error)
  process.exit(1)
})
