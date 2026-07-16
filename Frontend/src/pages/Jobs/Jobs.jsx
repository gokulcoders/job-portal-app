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
const BriefcaseIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
  </svg>
)
const MapPinIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
  </svg>
)
const ResetIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/>
  </svg>
)

const SOURCES   = ['All', 'LinkedIn', 'Naukri']
const KEYWORDS  = ['All', 'node', 'java', 'javascript', 'python', 'react', 'devops', 'android']
const JOB_TYPES = [
  { label: 'All Jobs',       value: '' },
  { label: 'Full-time',      value: 'fulltime' },
  { label: 'Urgent Hiring',  value: 'urgent' },
  { label: 'Walk-in',        value: 'walk-in' },
  { label: 'Internship',     value: 'internship' },
]
const LOCATIONS = [
  // Tamil Nadu
  { label: 'Chennai',      value: 'chennai' },
  { label: 'Coimbatore',   value: 'coimbatore' },
  { label: 'Madurai',      value: 'madurai' },
  { label: 'Trichy',       value: 'trichy' },
  { label: 'Salem',        value: 'salem' },
  { label: 'Tirunelveli', value: 'tirunelveli' },
  { label: 'Vellore',      value: 'vellore' },
  { label: 'Erode',        value: 'erode' },
  { label: 'Tiruppur',     value: 'tiruppur' },
  { label: 'Pondicherry',  value: 'pondicherry' },
  // Karnataka
  { label: 'Bangalore',    value: 'bangalore' },
  { label: 'Mysore',       value: 'mysore' },
  // Andhra / Telangana
  { label: 'Hyderabad',    value: 'hyderabad' },
  { label: 'Visakhapatnam', value: 'visakhapatnam' },
  // Maharashtra
  { label: 'Mumbai',       value: 'mumbai' },
  { label: 'Pune',         value: 'pune' },
  // Delhi NCR
  { label: 'Delhi',        value: 'delhi' },
  { label: 'Noida',        value: 'noida' },
  { label: 'Gurgaon',      value: 'gurgaon' },
  // Others
  { label: 'Kolkata',      value: 'kolkata' },
  { label: 'Ahmedabad',    value: 'ahmedabad' },
  { label: 'Kochi',        value: 'kochi' },
  { label: 'Remote',       value: 'remote' },
]

export default function Jobs() {
  const [searchParams] = useSearchParams()

  const [keyword, setKeyword]           = useState(searchParams.get('q') || '')
  const [location, setLocation]         = useState(searchParams.get('location') || '')
  const [keywordFilter, setKeywordFilter] = useState('All')
  const [sourceFilter, setSourceFilter]   = useState('All')
  const [jobTypeFilter, setJobTypeFilter] = useState('')
  const [locationPill, setLocationPill]   = useState('')
  const [page, setPage]                 = useState(Number(searchParams.get('page')) || 1)

  const [jobs, setJobs]       = useState([])
  const [total, setTotal]     = useState(0)
  const [pages, setPages]     = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)

  // Active filter count for reset badge
  const activeCount = [
    sourceFilter !== 'All',
    keywordFilter !== 'All',
    jobTypeFilter !== '',
    locationPill !== '',
    keyword !== '',
    location !== '',
  ].filter(Boolean).length

  function resetFilters() {
    setKeyword('')
    setLocation('')
    setKeywordFilter('All')
    setSourceFilter('All')
    setJobTypeFilter('')
    setLocationPill('')
    setPage(1)
  }

  useEffect(() => {
    const controller = new AbortController()
    async function loadJobs() {
      setLoading(true)
      setError(null)
      try {
        const params = { page, limit: 20, signal: controller.signal }
        if (keyword)                    params.q       = keyword
        if (keywordFilter !== 'All')    params.keyword = keywordFilter
        if (sourceFilter !== 'All')     params.source  = sourceFilter.toLowerCase()
        if (jobTypeFilter)              params.jobType = jobTypeFilter
        // location pill overrides the text input
        if (locationPill)               params.place   = locationPill
        else if (location)              params.place   = location
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
  }, [keyword, keywordFilter, sourceFilter, jobTypeFilter, locationPill, location, page])

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
            <strong>{total}</strong> position{total === 1 ? '' : 's'} updated daily from LinkedIn &amp; Naukri
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
                  placeholder="City, state…"
                  value={location}
                  onChange={(e) => {
                    setLocation(e.target.value)
                    setLocationPill('')   // clear pill when typing
                    setPage(1)
                  }}
                />
              </div>
              <button type="submit" className="jb-search-btn">Search</button>
            </form>
          </div>
        </div>
      </section>

      {/* ── Body ── */}
      <section className="jb-body">

        {/* ── Sidebar Filters ── */}
        <aside className="jb-filters">
          <div className="jb-filters-header">
            <span className="jb-filters-header-icon"><FilterIcon /></span>
            Filters
            {activeCount > 0 && (
              <button className="jb-reset-btn" onClick={resetFilters}>
                <ResetIcon /> Reset {activeCount > 0 && <span className="jb-reset-badge">{activeCount}</span>}
              </button>
            )}
          </div>

          {/* Source */}
          <div className="jb-filter-group">
            <span className="jb-filter-label">Source</span>
            <div className="jb-pill-row">
              {SOURCES.map((s) => (
                <button key={s} type="button"
                  className={sourceFilter === s ? 'jb-pill jb-pill-active' : 'jb-pill'}
                  onClick={() => { setSourceFilter(s); setPage(1) }}>
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Job Status / Type */}
          <div className="jb-filter-group">
            <span className="jb-filter-label"><BriefcaseIcon /> Job Status</span>
            <div className="jb-pill-row">
              {JOB_TYPES.map((t) => (
                <button key={t.value} type="button"
                  className={jobTypeFilter === t.value ? 'jb-pill jb-pill-active' : 'jb-pill'}
                  onClick={() => { setJobTypeFilter(t.value); setPage(1) }}>
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Location quick-picks */}
          <div className="jb-filter-group">
            <span className="jb-filter-label"><MapPinIcon /> Job Location</span>
            <div className="jb-location-grid">
              {LOCATIONS.map((loc) => (
                <button key={loc.value} type="button"
                  className={locationPill === loc.value ? 'jb-pill jb-pill-active' : 'jb-pill'}
                  onClick={() => {
                    setLocationPill(prev => prev === loc.value ? '' : loc.value)
                    setLocation('')
                    setPage(1)
                  }}>
                  {loc.label}
                </button>
              ))}
            </div>
          </div>

          {/* Keyword */}
          <div className="jb-filter-group">
            <span className="jb-filter-label">Keyword</span>
            <div className="jb-pill-row">
              {KEYWORDS.map((k) => (
                <button key={k} type="button"
                  className={keywordFilter === k ? 'jb-pill jb-pill-active' : 'jb-pill'}
                  onClick={() => { setKeywordFilter(k); setPage(1) }}>
                  {k}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* ── Results ── */}
        <div className="jb-results">
          <div className="jb-results-head">
            <span className="jb-results-count">
              <span className="jb-results-count-badge">{total}</span>
              position{total === 1 ? '' : 's'} found
              {locationPill && <span className="jb-results-location"> in {LOCATIONS.find(l => l.value === locationPill)?.label}</span>}
              {jobTypeFilter && <span className="jb-results-location"> · {JOB_TYPES.find(t => t.value === jobTypeFilter)?.label}</span>}
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
