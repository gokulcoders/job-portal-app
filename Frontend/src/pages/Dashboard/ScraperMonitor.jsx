import { useState, useEffect, useRef } from 'react'
import { toast } from 'sonner'
import api from '@/api/axiosInstance'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend, PieChart, Pie, Cell } from 'recharts'
import './ScraperMonitor.css'

export default function ScraperMonitor() {
    const [stats, setStats] = useState({ total: 0, linkedin: 0, naukri: 0, other: 0 })
    const [loading, setLoading] = useState(true)
    const [clearing, setClearing] = useState(false)
    const [running, setRunning] = useState({ linkedin: false, naukri: false })

    // Poll for stats every 10 seconds if any scraper is running
    const isAnyRunning = running.linkedin || running.naukri
    const pollInterval = useRef(null)

    const fetchStats = async (hideLoader = false) => {
        try {
            if (!hideLoader) setLoading(true)
            const { data } = await api.get('/api/jobs/admin/scraper/stats')
            setStats(data || { total: 0, linkedin: 0, naukri: 0, other: 0 })
        } catch (err) {
            console.error('Failed to fetch scraper stats:', err)
        } finally {
            if (!hideLoader) setLoading(false)
        }
    }

    useEffect(() => {
        fetchStats()
        // Restore running state from localStorage if active in the last 30 minutes
        const stored = localStorage.getItem('scraperRunningState')
        if (stored) {
            const parsed = JSON.parse(stored)
            const now = Date.now()
            const updated = { ...running }
            let changed = false
            if (parsed.linkedin && (now - parsed.linkedin) < 30 * 60 * 1000) { updated.linkedin = true; changed = true }
            if (parsed.naukri && (now - parsed.naukri) < 30 * 60 * 1000) { updated.naukri = true; changed = true }
            if (changed) setRunning(updated)
        }
    }, [])

    useEffect(() => {
        if (isAnyRunning) {
            pollInterval.current = setInterval(() => {
                fetchStats(true)
            }, 10000)
        } else {
            if (pollInterval.current) clearInterval(pollInterval.current)
        }
        return () => { if (pollInterval.current) clearInterval(pollInterval.current) }
    }, [isAnyRunning])

    const markRunning = (source) => {
        const updated = { ...running, [source]: true }
        setRunning(updated)
        const stored = JSON.parse(localStorage.getItem('scraperRunningState') || '{}')
        stored[source] = Date.now()
        localStorage.setItem('scraperRunningState', JSON.stringify(stored))
    }

    const cancelRunning = (source) => {
        const updated = { ...running, [source]: false }
        setRunning(updated)
        const stored = JSON.parse(localStorage.getItem('scraperRunningState') || '{}')
        delete stored[source]
        localStorage.setItem('scraperRunningState', JSON.stringify(stored))
    }

    const handleClear = async (source) => {
        if (!window.confirm(`Are you sure you want to clear ${source.toUpperCase()} scraper data?`)) return

        try {
            setClearing(true)
            const { data } = await api.delete(`/api/jobs/admin/scraper/clear?source=${source}`)
            toast.success(data.message || `Cleared ${source} data`)
            // Also stop running state if we are clearing
            if (source === 'all') { cancelRunning('linkedin'); cancelRunning('naukri') }
            else cancelRunning(source)

            fetchStats()
        } catch (err) {
            toast.error(`Failed to clear ${source} data`)
        } finally {
            setClearing(false)
        }
    }

    const handleRunScraper = async (source) => {
        try {
            markRunning(source)
            await api.post('/api/jobs/admin/scraper/run', { source })
            toast.success(`${source.toUpperCase()} scraper has started successfully!`)
        } catch (err) {
            toast.error(`Failed to start ${source} scraper`)
            cancelRunning(source)
        }
    }

    // Chart Data
    const chartData = [
        { name: 'LinkedIn', jobs: stats.linkedin || 0 },
        { name: 'Naukri', jobs: stats.naukri || 0 },
        { name: 'Other', jobs: stats.other || 0 },
    ]
    const COLORS = ['#0077b5', '#16a34a', '#8b5cf6']

    return (
        <div className="scraper-hub">
            <header className="sh-header">
                <div className="sh-header-text">
                    <h1 className="sh-title">Scraper Activity Monitor</h1>
                    <p className="sh-subtitle">Live analytics and remote control center for background scraping jobs.</p>
                </div>
                <button className={`sh-btn sh-btn-refresh ${loading ? 'loading' : ''}`} onClick={() => fetchStats()} disabled={loading || clearing}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="23 4 23 10 17 10" />
                        <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
                    </svg>
                    Refresh
                </button>
            </header>

            <div className="sh-grid">
                {/* ---------- LEFT COLUMN: OVERVIEW ---------- */}
                <div className="sh-col sh-col-main">

                    {/* Compact Stat Cards */}
                    <div className="sh-stats-row">
                        <div className="sh-stat-card linkedin">
                            <div className="sh-stat-icon">LI</div>
                            <div className="sh-stat-info">
                                <span className="sh-stat-label">LinkedIn Jobs</span>
                                <span className="sh-stat-val">{stats.linkedin || 0}</span>
                            </div>
                            {running.linkedin && <div className="sh-pulse-indicator _blue" title="Scraping in progress..." />}
                        </div>

                        <div className="sh-stat-card naukri">
                            <div className="sh-stat-icon _green">NK</div>
                            <div className="sh-stat-info">
                                <span className="sh-stat-label">Naukri Jobs</span>
                                <span className="sh-stat-val">{stats.naukri || 0}</span>
                            </div>
                            {running.naukri && <div className="sh-pulse-indicator _green" title="Scraping in progress..." />}
                        </div>

                        <div className="sh-stat-card total">
                            <div className="sh-stat-icon _purple">Σ</div>
                            <div className="sh-stat-info">
                                <span className="sh-stat-label">Total Jobs Scraped</span>
                                <span className="sh-stat-val">{stats.total || 0}</span>
                            </div>
                        </div>
                    </div>

                    {/* Chart Area */}
                    <div className="sh-chart-container">
                        <div className="sh-chart-header">
                            <h3 className="sh-sec-title">Performance Analytics</h3>
                            {isAnyRunning && <span className="sh-live-badge"><span className="dot"></span>Live Syncing</span>}
                        </div>
                        <div className="sh-chart-wrapper">
                            <ResponsiveContainer width="100%" height={260}>
                                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 13 }} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 13 }} />
                                    <Tooltip cursor={{ fill: 'rgba(0,0,0,0.02)' }} contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }} />
                                    <Bar dataKey="jobs" radius={[6, 6, 0, 0]} maxBarSize={45}>
                                        {chartData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* ---------- RIGHT COLUMN: CONTROLS ---------- */}
                <div className="sh-col sh-col-side">
                    <div className="sh-control-panel">
                        <h3 className="sh-sec-title">Scraper Controls</h3>
                        <p className="sh-sec-desc">Manually trigger or halt data collection bots.</p>

                        <div className="sh-control-group">
                            <div className="sh-bot-header">
                                <div>
                                    <h4 className="sh-bot-title">LinkedIn Bot</h4>
                                    <span className={`sh-bot-status ${running.linkedin ? 'active' : 'idle'}`}>
                                        {running.linkedin ? 'Running...' : 'Idle'}
                                    </span>
                                </div>
                                <div className="sh-bot-actions">
                                    <button
                                        className={`sh-action-btn run _blue ${running.linkedin ? 'is-running' : ''}`}
                                        onClick={() => running.linkedin ? cancelRunning('linkedin') : handleRunScraper('linkedin')}
                                    >
                                        {running.linkedin ? 'Stop Bot' : 'Start Bot'}
                                    </button>
                                    <button className="sh-action-btn clear" onClick={() => handleClear('linkedin')}>Clear</button>
                                </div>
                            </div>
                        </div>

                        <div className="sh-control-group">
                            <div className="sh-bot-header">
                                <div>
                                    <h4 className="sh-bot-title">Naukri Bot</h4>
                                    <span className={`sh-bot-status ${running.naukri ? 'active' : 'idle'}`}>
                                        {running.naukri ? 'Running...' : 'Idle'}
                                    </span>
                                </div>
                                <div className="sh-bot-actions">
                                    <button
                                        className={`sh-action-btn run _green ${running.naukri ? 'is-running' : ''}`}
                                        onClick={() => running.naukri ? cancelRunning('naukri') : handleRunScraper('naukri')}
                                    >
                                        {running.naukri ? 'Stop Bot' : 'Start Bot'}
                                    </button>
                                    <button className="sh-action-btn clear" onClick={() => handleClear('naukri')}>Clear</button>
                                </div>
                            </div>
                        </div>

                        <div className="sh-danger-zone">
                            <h4 className="sh-danger-title">Danger Zone</h4>
                            <button className="sh-btn-danger" onClick={() => handleClear('all')}>
                                Purge All Scraped Data
                            </button>
                        </div>
                    </div>

                    <div className="sh-chart-container" style={{ marginTop: '20px', padding: '16px' }}>
                        <h3 className="sh-sec-title" style={{ fontSize: '1rem' }}>Source Distribution</h3>
                        <div style={{ height: '180px' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie data={chartData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={4} dataKey="jobs">
                                        {chartData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}
