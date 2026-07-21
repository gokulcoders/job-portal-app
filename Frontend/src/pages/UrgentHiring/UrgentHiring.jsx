import { useEffect, useState } from 'react'
import { fetchJobs, fetchFeaturedPosts } from '@services/api'
import JobList from '@components/jobs/JobList'
import Pagination from '@components/jobs/Pagination'
import FeaturedPostCard from '@components/jobs/FeaturedPostCard'
import './UrgentHiring.css'

const BoltIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M13 2 3 14h7l-1 8 10-12h-7l1-8z"/>
  </svg>
)
const SearchIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
)
const PinIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
  </svg>
)

const LOCATIONS = [
  'All', 'Chennai', 'Coimbatore', 'Bangalore', 'Hyderabad',
  'Mumbai', 'Pune', 'Delhi', 'Kolkata', 'Remote',
]

export default function UrgentHiring() {
  const [keyword,  setKeyword]  = useState('')
  const [location, setLocation] = useState('All')
  const [page,     setPage]     = useState(1)
  const [jobs,     setJobs]     = useState([])
  const [total,    setTotal]    = useState(0)
  const [pages,    setPages]    = useState(0)
  const [loading,  setLoading]  = useState(true)
  const [error,    setError]    = useState(null)
  const [featured, setFeatured] = useState([])

  useEffect(() => {
    fetchFeaturedPosts('urgent').then(setFeatured).catch(() => {})
  }, [])

  useEffect(() => {
    const controller = new AbortController()
    setLoading(true)
    setError(null)
    const params = { jobType: 'urgent', page, limit: 20, signal: controller.signal }
    if (keyword.trim())      params.q     = keyword.trim()
    if (location !== 'All')  params.place = location

    fetchJobs(params)
      .then(data => { setJobs(data.jobs); setTotal(data.total); setPages(data.pages) })
      .catch(err => { if (err.name !== 'CanceledError') setError('Could not load jobs.') })
      .finally(() => setLoading(false))

    return () => controller.abort()
  }, [keyword, location, page])

  return (
    <div className="hv-root">

      <section className="uh-hero">
        <div className="uh-hero-inner">
          <span className="uh-badge"><BoltIcon /> Urgent Hiring</span>
          <h1>Companies hiring <span>right now</span></h1>
          <p>
            <strong>{total}</strong> urgent position{total !== 1 ? 's' : ''} open — apply before slots fill up.
          </p>

          <div className="uh-search-bar">
            <div className="uh-search-field">
              <SearchIcon />
              <input
                type="text"
                placeholder="Role or company…"
                value={keyword}
                onChange={e => { setKeyword(e.target.value); setPage(1) }}
              />
            </div>
          </div>

          {/* Location pills */}
          <div className="uh-loc-row">
            <PinIcon />
            {LOCATIONS.map(loc => (
              <button
                key={loc}
                type="button"
                className={location === loc ? 'uh-loc-pill uh-loc-active' : 'uh-loc-pill'}
                onClick={() => { setLocation(loc); setPage(1) }}
              >
                {loc}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="uh-body">
        {featured.length > 0 && (
          <div className="uh-featured">
            <div className="uh-results-head">Featured urgent hires</div>
            <div className="uh-featured-grid">
              {featured.map(post => <FeaturedPostCard post={post} key={post._id} />)}
            </div>
          </div>
        )}
        {error ? (
          <div className="uh-empty"><p>{error}</p></div>
        ) : (!loading && total === 0 && featured.length > 0) ? null : (
          <>
            <div className="uh-results-head">
              <span className="uh-count-badge">{total}</span>
              urgent position{total !== 1 ? 's' : ''} found
              {location !== 'All' && <span className="uh-loc-label"> in {location}</span>}
            </div>
            <JobList jobs={jobs} loading={loading} />
            {!loading && <Pagination page={page} pages={pages} onPageChange={setPage} />}
          </>
        )}
      </section>

    </div>
  )
}
