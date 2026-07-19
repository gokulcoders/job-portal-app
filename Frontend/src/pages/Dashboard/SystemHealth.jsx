import { useState, useEffect, useCallback } from 'react'
import { fetchSystemHealth, flushSystemCache, runSystemCleanup } from '@services/api'
import './SystemHealth.css'

// ── Icons ─────────────────────────────────────────────────────────────────
const RedisIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14c0 1.66 4.03 3 9 3s9-1.34 9-3V5"/><path d="M3 12c0 1.66 4.03 3 9 3s9-1.34 9-3"/>
  </svg>
)
const MongoIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2c3 3 5 6.5 5 10.5a5 5 0 0 1-10 0C7 8.5 9 5 12 2z"/><path d="M12 15v7"/>
  </svg>
)
const ImageIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/>
  </svg>
)
const RefreshIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M23 4v6h-6"/><path d="M1 20v-6h6"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
  </svg>
)

function formatBytes(bytes) {
  if (bytes == null) return '—'
  if (bytes === 0) return '0 B'
  const units = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.min(units.length - 1, Math.floor(Math.log(bytes) / Math.log(1024)))
  return `${(bytes / 1024 ** i).toFixed(i === 0 ? 0 : 1)} ${units[i]}`
}

function formatUptime(seconds) {
  if (!seconds) return '—'
  const d = Math.floor(seconds / 86400)
  const h = Math.floor((seconds % 86400) / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  if (d > 0) return `${d}d ${h}h`
  if (h > 0) return `${h}h ${m}m`
  return `${m}m`
}

function StatusDot({ status }) {
  return (
    <span className={`sh-status sh-status--${status}`}>
      <span className="sh-status-dot" />
      {status === 'up' ? 'Online' : 'Offline'}
    </span>
  )
}

function ProgressBar({ used, limit }) {
  if (!limit) return null
  const pct = Math.min(100, Math.round((used / limit) * 100))
  return (
    <div className="sh-progress">
      <div className="sh-progress-track">
        <div className="sh-progress-fill" style={{ width: `${pct}%` }} />
      </div>
      <span className="sh-progress-label">{formatBytes(used)} / {formatBytes(limit)} ({pct}%)</span>
    </div>
  )
}

function InfoRow({ label, value }) {
  return (
    <div className="sh-info-row">
      <span className="sh-info-label">{label}</span>
      <span className="sh-info-value">{value}</span>
    </div>
  )
}

function ConfirmModal({ onConfirm, onCancel }) {
  return (
    <div className="sh-overlay">
      <div className="sh-modal">
        <h3 className="sh-modal-title">Flush Redis cache?</h3>
        <p className="sh-modal-body">
          This clears all Redis keys — pending OTP codes and rate-limit counters included.
          Users mid-signup/login will need to request a new OTP. This does not affect MongoDB
          data or stored images.
        </p>
        <div className="sh-modal-actions">
          <button type="button" className="sh-btn sh-btn-ghost" onClick={onCancel}>Cancel</button>
          <button type="button" className="sh-btn sh-btn-danger" onClick={onConfirm}>Flush cache</button>
        </div>
      </div>
    </div>
  )
}

export default function SystemHealth() {
  const [health, setHealth] = useState(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState(null)
  const [toast, setToast] = useState(null)
  const [confirmFlush, setConfirmFlush] = useState(false)
  const [flushing, setFlushing] = useState(false)
  const [cleaning, setCleaning] = useState(false)

  const showToast = (msg, type = 'success') => setToast({ msg, type })

  const load = useCallback((isRefresh) => {
    if (isRefresh) setRefreshing(true)
    return fetchSystemHealth()
      .then(setHealth)
      .catch(() => setError('Failed to load system health.'))
      .finally(() => { setLoading(false); setRefreshing(false) })
  }, [])

  useEffect(() => { load(false) }, [load])

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 3500)
    return () => clearTimeout(t)
  }, [toast])

  async function handleFlushCache() {
    setConfirmFlush(false)
    setFlushing(true)
    try {
      const { keysCleared } = await flushSystemCache()
      showToast(`Redis cache flushed — ${keysCleared} key${keysCleared === 1 ? '' : 's'} cleared.`)
      await load(true)
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to flush cache.', 'error')
    } finally {
      setFlushing(false)
    }
  }

  async function handleRunCleanup() {
    setCleaning(true)
    try {
      const { expiredPostsDeleted, watchRemindersSent } = await runSystemCleanup()
      showToast(`Cleanup ran — ${expiredPostsDeleted} expired post(s) removed, ${watchRemindersSent} reminder(s) sent.`)
      await load(true)
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to run cleanup.', 'error')
    } finally {
      setCleaning(false)
    }
  }

  if (loading) return <div className="sh-root"><div className="sh-empty">Loading system health…</div></div>
  if (error || !health) return <div className="sh-root"><div className="sh-empty">{error || 'No data.'}</div></div>

  const { redis, mongo, imageStorage } = health

  return (
    <div className="sh-root">
      {toast && <div className={`sh-toast sh-toast--${toast.type}`}>{toast.msg}<button onClick={() => setToast(null)}>✕</button></div>}
      {confirmFlush && <ConfirmModal onConfirm={handleFlushCache} onCancel={() => setConfirmFlush(false)} />}

      <div className="sh-header">
        <div>
          <h1 className="sh-title">System Health</h1>
          <p className="sh-sub">Redis, MongoDB &amp; image storage — live infrastructure stats</p>
        </div>
        <button type="button" className="sh-refresh-btn" onClick={() => load(true)} disabled={refreshing}>
          <span className={refreshing ? 'sh-spin' : ''}><RefreshIcon /></span>
          Refresh
        </button>
      </div>

      <div className="sh-grid-3">
        {/* ── Redis ── */}
        <div className="sh-card">
          <div className="sh-card-head">
            <span className="sh-card-icon" style={{ background: '#dc262618', color: '#dc2626' }}><RedisIcon /></span>
            <div>
              <h2 className="sh-card-title">Redis</h2>
              <span className="sh-card-desc">OTP storage &amp; rate limiting</span>
            </div>
            <StatusDot status={redis.status} />
          </div>
          {redis.status === 'up' ? (
            <div className="sh-info-list">
              <InfoRow label="Memory used" value={redis.usedMemoryHuman || formatBytes(redis.usedMemoryBytes)} />
              <InfoRow label="Peak memory" value={formatBytes(redis.peakMemoryBytes)} />
              <InfoRow label="Keys stored" value={redis.keyCount} />
              <InfoRow label="Connected clients" value={redis.connectedClients} />
              <InfoRow label="Uptime" value={formatUptime(redis.uptimeSeconds)} />
              <InfoRow label="Version" value={redis.version || '—'} />
            </div>
          ) : (
            <p className="sh-card-error">{redis.error || 'Redis is unreachable.'}</p>
          )}
        </div>

        {/* ── MongoDB ── */}
        <div className="sh-card">
          <div className="sh-card-head">
            <span className="sh-card-icon" style={{ background: '#1baf7a18', color: '#1baf7a' }}><MongoIcon /></span>
            <div>
              <h2 className="sh-card-title">MongoDB</h2>
              <span className="sh-card-desc">{mongo.database || 'Primary database'}</span>
            </div>
            <StatusDot status={mongo.status} />
          </div>
          {mongo.status === 'up' ? (
            <div className="sh-info-list">
              <InfoRow label="Data size" value={formatBytes(mongo.dataSizeBytes)} />
              <InfoRow label="Storage size" value={formatBytes(mongo.storageSizeBytes)} />
              <InfoRow label="Index size" value={formatBytes(mongo.indexSizeBytes)} />
              <InfoRow label="Collections" value={mongo.collections} />
              <InfoRow label="Documents" value={mongo.documents} />
              <InfoRow label="Indexes" value={mongo.indexes} />
              <InfoRow label="Host" value={mongo.host || '—'} />
            </div>
          ) : (
            <p className="sh-card-error">{mongo.error || 'MongoDB is unreachable.'}</p>
          )}
        </div>

        {/* ── Image storage (Cloudinary) ── */}
        <div className="sh-card">
          <div className="sh-card-head">
            <span className="sh-card-icon" style={{ background: '#2a78d618', color: '#2a78d6' }}><ImageIcon /></span>
            <div>
              <h2 className="sh-card-title">Image storage</h2>
              <span className="sh-card-desc">Cloudinary{imageStorage.plan ? ` — ${imageStorage.plan}` : ''}</span>
            </div>
            <StatusDot status={imageStorage.status} />
          </div>
          {imageStorage.status === 'up' ? (
            <div className="sh-info-list">
              <div className="sh-info-block">
                <span className="sh-info-label">Storage</span>
                <ProgressBar used={imageStorage.storageBytes} limit={imageStorage.storageLimitBytes} />
                {!imageStorage.storageLimitBytes && <span className="sh-info-value">{formatBytes(imageStorage.storageBytes)}</span>}
              </div>
              <div className="sh-info-block">
                <span className="sh-info-label">Bandwidth (this cycle)</span>
                <ProgressBar used={imageStorage.bandwidthBytes} limit={imageStorage.bandwidthLimitBytes} />
                {!imageStorage.bandwidthLimitBytes && <span className="sh-info-value">{formatBytes(imageStorage.bandwidthBytes)}</span>}
              </div>
              <InfoRow label="Images stored" value={imageStorage.resourceCount} />
              <InfoRow label="Derived images" value={imageStorage.derivedResourceCount} />
              {imageStorage.credits && (
                <InfoRow label="Credits used" value={`${imageStorage.credits.usage} / ${imageStorage.credits.limit}`} />
              )}
            </div>
          ) : (
            <p className="sh-card-error">{imageStorage.error || 'Cloudinary is unreachable.'}</p>
          )}
        </div>
      </div>

      {/* ── Maintenance ── */}
      <div className="sh-card sh-maintenance">
        <h2 className="sh-card-title" style={{ marginBottom: '1.1rem' }}>Maintenance</h2>

        <div className="sh-maint-row">
          <div>
            <p className="sh-maint-label">Run cleanup jobs now</p>
            <p className="sh-maint-desc">
              Manually re-runs the scheduled jobs: deletes expired featured posts (and their images)
              and sends &quot;continue watching&quot; reminders. Safe to run anytime — normally runs hourly/daily.
            </p>
          </div>
          <button type="button" className="sh-btn sh-btn-primary" onClick={handleRunCleanup} disabled={cleaning}>
            {cleaning ? <><span className="sh-btn-spin" /> Running…</> : 'Run now'}
          </button>
        </div>

        <div className="sh-maint-row">
          <div>
            <p className="sh-maint-label">Flush Redis cache</p>
            <p className="sh-maint-desc">
              Clears all Redis keys (pending OTPs, rate-limit counters). Use if Redis memory looks
              abnormally high or you need to reset rate limits. Does not touch MongoDB or images.
            </p>
          </div>
          <button type="button" className="sh-btn sh-btn-danger" onClick={() => setConfirmFlush(true)} disabled={flushing}>
            {flushing ? <><span className="sh-btn-spin" /> Flushing…</> : 'Flush cache'}
          </button>
        </div>
      </div>

      <p className="sh-checked-at">Last checked {new Date(health.checkedAt).toLocaleTimeString('en-IN')}</p>
    </div>
  )
}
