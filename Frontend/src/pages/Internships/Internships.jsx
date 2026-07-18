import { useEffect, useState } from 'react'
import { fetchInternshipJobs, fetchFeaturedPosts } from '@services/api'
import JobList from '@components/jobs/JobList'
import Pagination from '@components/jobs/Pagination'
import FeaturedPostCard from '@components/jobs/FeaturedPostCard'
import './Internships.css'

const GradCapIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 10 12 5 2 10l10 5 10-5z"/><path d="M6 12v5c0 1.5 3 3 6 3s6-1.5 6-3v-5"/>
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
  'All', 'Chennai', 'Coimbatore', 'Madurai', 'Bangalore',
  'Hyderabad', 'Mumbai', 'Pune', 'Delhi', 'Remote',
]

export default function Internships() {
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
    fetchFeaturedPosts('internship').then(setFeatured).catch(() => {})
  }, [])

  useEffect(() => {
    const controller = new AbortController()
    setLoading(true)
    setError(null)
    const params = { page, limit: 20, signal: controller.signal }
    if (keyword.trim())      params.q     = keyword.trim()
    if (location !== 'All')  params.place = location

    fetchInternshipJobs(params)
      .then(data => { setJobs(data.jobs); setTotal(data.total); setPages(data.pages) })
      .catch(err => { if (err.name !== 'CanceledError') setError('Could not load internships.') })
      .finally(() => setLoading(false))

    return () => controller.abort()
  }, [keyword, location, page])

  return (
    <div className="hv-root">

      <section className="in-hero">
        <div className="in-hero-inner">
          <span className="in-badge"><GradCapIcon /> Internships</span>
          <h1>Launch your career with the <span>right internship</span></h1>
          <p>
            <strong>{total}</strong> internship{total !== 1 ? 's' : ''} available — real projects, real experience.
          </p>

          <div className="in-search-bar">
            <div className="in-search-field">
              <SearchIcon />
              <input
                type="text"
                placeholder="Role or company…"
                value={keyword}
                onChange={e => { setKeyword(e.target.value); setPage(1) }}
              />
            </div>
          </div>

          <div className="in-loc-row">
            <PinIcon />
            {LOCATIONS.map(loc => (
              <button
                key={loc}
                type="button"
                className={location === loc ? 'in-loc-pill in-loc-active' : 'in-loc-pill'}
                onClick={() => { setLocation(loc); setPage(1) }}
              >
                {loc}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="in-body">
        {featured.length > 0 && (
          <div className="in-featured">
            <div className="in-results-head">Featured internships</div>
            <div className="in-featured-grid">
              {featured.map(post => <FeaturedPostCard post={post} key={post._id} />)}
            </div>
          </div>
        )}
        {error ? (
          <div className="in-empty"><p>{error}</p></div>
        ) : (
          <>
            <div className="in-results-head">
              <span className="in-count-badge">{total}</span>
              internship{total !== 1 ? 's' : ''} found
              {location !== 'All' && <span className="in-loc-label"> in {location}</span>}
            </div>
            <JobList jobs={jobs} loading={loading} />
            {!loading && <Pagination page={page} pages={pages} onPageChange={setPage} />}
          </>
        )}
      </section>

    </div>
  )
}
