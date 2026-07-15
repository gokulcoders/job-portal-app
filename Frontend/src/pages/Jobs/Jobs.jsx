import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import JobList from '@components/jobs/JobList'
import Pagination from '@components/jobs/Pagination'
import { fetchJobs } from '@services/api'
import './Jobs.css'

const SearchIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
)
const PinIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
  </svg>
)
const FilterIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
  </svg>
)
const SparkleIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z"/>
  </svg>
)

const KEYWORDS = ['All', 'node', 'java', 'javascript']

export default function Jobs() {
  const [searchParams] = useSearchParams()

  const [keyword, setKeyword]           = useState(searchParams.get('q') || '')
  const [location, setLocation]         = useState(searchParams.get('location') || '')
  const [keywordFilter, setKeywordFilter] = useState('All')
  const [page, setPage]                 = useState(Number(searchParams.get('page')) || 1)

  const [jobs, setJobs]       = useState([])
  const [total, setTotal]     = useState(0)
  const [pages, setPages]     = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)

  useEffect(() => {
    const controller = new AbortController()
    async function loadJobs() {
      setLoading(true)
      setError(null)
      try {
        const params = { page, limit: 20, signal: controller.signal }
        if (keyword) params.q = keyword
        if (keywordFilter !== 'All') params.keyword = keywordFilter
        if (location) params.place = location
        const data = await fetchJobs(params)
        setJobs(data.jobs)
        setTotal(data.total)
        setPages(data.pages)
      } catch (err) {
        if (err.name !== 'CanceledError') setError('Could not load jobs. Is the backend running?')
      } finally {
        setLoading(false)
      }
    }
    loadJobs()
    return () => controller.abort()
  }, [keyword, keywordFilter, location, page])

  return (
    <div className="hv-root">

      {/* ── Hero ── */}
      <section className="jb-hero">
        <div className="jb-hero-inner">
          <div className="jb-hero-eyebrow">
            <SparkleIcon /> Live Opportunities
          </div>
          <h1>Find your <span>next role</span></h1>
          <p className="jb-hero-sub">
            <strong>{total}</strong> scraped position{total === 1 ? '' : 's'} updated daily from LinkedIn
          </p>

          <div className="jb-search-wrap">
            <form className="jb-search" onSubmit={(e) => e.preventDefault()}>
              <div className="hv-search-field">
                <SearchIcon />
                <input
                  type="text"
                  placeholder="Job title or company…"
                  value={keyword}
                  onChange={(e) => { setKeyword(e.target.value); setPage(1) }}
                />
              </div>
              <div className="jb-search-divider" />
              <div className="hv-search-field">
                <PinIcon />
                <input
                  type="text"
                  placeholder="Location…"
                  value={location}
                  onChange={(e) => { setLocation(e.target.value); setPage(1) }}
                />
              </div>
              <button type="submit" className="jb-search-btn">Search</button>
            </form>
          </div>
        </div>
      </section>

      {/* ── Body ── */}
      <section className="jb-body">

        {/* Filters */}
        <aside className="jb-filters">
          <div className="jb-filters-header">
            <span className="jb-filters-header-icon"><FilterIcon /></span>
            Filters
          </div>

          <div className="jb-filter-group">
            <span className="jb-filter-label">Keyword</span>
            <div className="jb-pill-row">
              {KEYWORDS.map((k) => (
                <button
                  key={k}
                  type="button"
                  className={keywordFilter === k ? 'jb-pill jb-pill-active' : 'jb-pill'}
                  onClick={() => { setKeywordFilter(k); setPage(1) }}
                >
                  {k}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Results */}
        <div className="jb-results">
          <div className="jb-results-head">
            <span className="jb-results-count">
              <span className="jb-results-count-badge">{total}</span>
              position{total === 1 ? '' : 's'} found
            </span>
          </div>

          {error ? (
            <div className="jb-empty">
              <div className="jb-empty-icon">
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
              </div>
              <p>{error}</p>
            </div>
          ) : (
            <>
              <JobList jobs={jobs} loading={loading} />
              {!loading && <Pagination page={page} pages={pages} onPageChange={setPage} />}
            </>
          )}
        </div>
      </section>

    </div>
  )
}
