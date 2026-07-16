import { useEffect, useState } from 'react'
import { fetchWalkInJobs } from '@services/api'
import JobList from '@components/jobs/JobList'
import Pagination from '@components/jobs/Pagination'
import './WalkIn.css'

const WalkIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="13" cy="4" r="1.5" fill="currentColor" stroke="none"/>
    <path d="M7.5 8.5 10 6l3.5 1 2 3-3 1.5"/>
    <path d="M10 14l-1 4.5M12.5 14.5l1.5 4"/>
    <path d="M7 12l1-3.5 2 2 3-1"/>
  </svg>
)
const SearchIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
)
const PinIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
  </svg>
)

const LOCATIONS = [
  'All', 'Chennai', 'Coimbatore', 'Madurai', 'Trichy', 'Salem',
  'Bangalore', 'Hyderabad', 'Mumbai', 'Pune', 'Delhi', 'Remote',
]

export default function WalkIn() {
  const [keyword,  setKeyword]  = useState('')
  const [location, setLocation] = useState('All')
  const [page,     setPage]     = useState(1)
  const [jobs,     setJobs]     = useState([])
  const [total,    setTotal]    = useState(0)
  const [pages,    setPages]    = useState(0)
  const [loading,  setLoading]  = useState(true)
  const [error,    setError]    = useState(null)

  useEffect(() => {
    const controller = new AbortController()
    setLoading(true)
    setError(null)
    const params = { page, limit: 20, signal: controller.signal }
    if (keyword.trim())      params.q     = keyword.trim()
    if (location !== 'All')  params.place = location

    fetchWalkInJobs(params)
      .then(data => { setJobs(data.jobs); setTotal(data.total); setPages(data.pages) })
      .catch(err => { if (err.name !== 'CanceledError') setError('Could not load jobs.') })
      .finally(() => setLoading(false))

    return () => controller.abort()
  }, [keyword, location, page])

  return (
    <div className="hv-root">

      <section className="wi-hero">
        <div className="wi-hero-inner">
          <span className="wi-badge"><WalkIcon /> Walk-in Drives</span>
          <h1>Walk in. Get hired <span>today.</span></h1>
          <p>
            <strong>{total}</strong> walk-in drive{total !== 1 ? 's' : ''} — no application form, just show up.
          </p>

          <div className="wi-search-bar">
            <div className="wi-search-field">
              <SearchIcon />
              <input
                type="text"
                placeholder="Role or company…"
                value={keyword}
                onChange={e => { setKeyword(e.target.value); setPage(1) }}
              />
            </div>
          </div>

          <div className="wi-loc-row">
            <PinIcon />
            {LOCATIONS.map(loc => (
              <button
                key={loc}
                type="button"
                className={location === loc ? 'wi-loc-pill wi-loc-active' : 'wi-loc-pill'}
                onClick={() => { setLocation(loc); setPage(1) }}
              >
                {loc}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="wi-body">
        {error ? (
          <div className="wi-empty"><p>{error}</p></div>
        ) : (
          <>
            <div className="wi-results-head">
              <span className="wi-count-badge">{total}</span>
              walk-in drive{total !== 1 ? 's' : ''} found
              {location !== 'All' && <span className="wi-loc-label"> in {location}</span>}
            </div>
            <JobList jobs={jobs} loading={loading} />
            {!loading && <Pagination page={page} pages={pages} onPageChange={setPage} />}
          </>
        )}
      </section>

    </div>
  )
}
