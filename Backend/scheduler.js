import 'dotenv/config'
import http from 'http'
import cron from 'node-cron'
import { runScraper } from './scraper/jobscrapper.js'

const SCRAPER_PORT      = Number(process.env.SCRAPER_PORT)      || 5001
const intervalMinutes   = Number(process.env.SCRAPER_INTERVAL_MINUTES) || 30
const scheduleExpr      = `*/${Math.max(1, intervalMinutes)} * * * *`

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

// ── Scraper runner ─────────────────────────────────────────────────────────
async function runScheduledScraper(source = 'cron') {
  if (state.running) {
    console.log(`⚠️  Scraper already running — skipping (triggered by ${source})`)
    return { skipped: true, reason: 'already_running' }
  }

  state.running   = true
  state.lastRun   = new Date().toISOString()
  state.lastError = null
  state.totalRuns += 1
  console.log(`⏳ [${source}] Scraper started at ${state.lastRun}`)

  try {
    await runScraper()
    state.lastStatus = 'success'
    console.log(`✅ [${source}] Scraper completed at ${new Date().toISOString()}`)
    return { success: true }
  } catch (err) {
    state.lastStatus = 'failed'
    state.lastError  = err.message || String(err)
    state.failedRuns += 1
    console.error(`❌ [${source}] Scraper failed:`, err)
    return { success: false, error: state.lastError }
  } finally {
    state.running = false
    computeNextRun()
  }
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

  // ── POST /trigger ─────────────────────────────────────────────────────────
  if (method === 'POST' && url === '/trigger') {
    if (state.running) {
      return json(res, 409, { message: 'Scraper is already running', running: true })
    }
    // Start in background — don't await so the HTTP response returns immediately
    runScheduledScraper('manual-trigger').catch(() => {})
    return json(res, 202, { message: 'Scraper triggered', startedAt: state.lastRun })
  }

  // ── 404 ───────────────────────────────────────────────────────────────────
  return json(res, 404, {
    error: 'Not found',
    routes: [
      'GET  /health  — liveness check',
      'GET  /status  — scraper state & stats',
      'POST /trigger — run the scraper now',
    ],
  })
})

// ── Bootstrap ──────────────────────────────────────────────────────────────
server.listen(SCRAPER_PORT, () => {
  console.log(`🚀 Scraper service running on http://localhost:${SCRAPER_PORT}`)
  console.log(`   GET  /health  — liveness check`)
  console.log(`   GET  /status  — scraper state & stats`)
  console.log(`   POST /trigger — run scraper now`)
  console.log(`⏰ Cron: every ${intervalMinutes} minute(s)  [${scheduleExpr}]`)
})

// ── Cron schedule ──────────────────────────────────────────────────────────
computeNextRun()
cron.schedule(scheduleExpr, () => runScheduledScraper('cron'), {
  scheduled: true,
  timezone: 'UTC',
})

// Run once immediately on startup
runScheduledScraper('startup').catch((err) => {
  console.error('❌ Startup scraper run failed:', err)
})

// ── Process error handlers ─────────────────────────────────────────────────
process.on('unhandledRejection', (reason) => {
  console.error('Unhandled rejection in scheduler:', reason)
})

process.on('uncaughtException', (error) => {
  console.error('Uncaught exception in scheduler:', error)
  process.exit(1)
})
