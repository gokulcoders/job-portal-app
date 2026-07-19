import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchCourses } from '@services/api'
import './Courses.css'

const ClockIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="9" /><polyline points="12 7 12 12 15.5 15" />
  </svg>
)
const LayersIcon = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 2 7 12 12 22 7 12 2" /><polyline points="2 17 12 22 22 17" /><polyline points="2 12 12 17 22 12" />
  </svg>
)
const CompassIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/>
  </svg>
)
const ArrowRightIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
  </svg>
)

const CATEGORIES = ['All', 'Design', 'Engineering', 'Data', 'Business', 'Marketing']

function formatDuration(mins) {
  if (!mins) return '—'
  const h = Math.floor(mins / 60)
  const m = mins % 60
  if (h === 0) return `${m}m`
  return m === 0 ? `${h}h` : `${h}h ${m}m`
}

export default function Courses() {
  const navigate = useNavigate()
  const [keyword, setKeyword]   = useState('')
  const [category, setCategory] = useState('All')
  const [courses, setCourses]   = useState([])
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState(null)

  useEffect(() => {
    setLoading(true)
    setError(null)
    fetchCourses()
      .then(setCourses)
      .catch(() => setError('Could not load courses.'))
      .finally(() => setLoading(false))
  }, [])

  const filtered = useMemo(() => {
    const kw = keyword.trim().toLowerCase()
    return courses.filter((c) => {
      const matchesCategory = category === 'All' || c.category === category
      const matchesKeyword = !kw || c.title.toLowerCase().includes(kw) || (c.instructor || '').toLowerCase().includes(kw)
      return matchesCategory && matchesKeyword
    })
  }, [courses, keyword, category])

  return (
    <div className="hv-root">

      <section className="hv-page-hero">
        <div className="hv-page-hero-inner">
          <h1>Learn skills that move your career forward.</h1>
          <p>{courses.length}+ courses across design, engineering, data and business.</p>

          <form className="hv-search crs-search" onSubmit={(e) => e.preventDefault()}>
            <div className="hv-search-field">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="7" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input type="text" placeholder="Search courses or instructors" value={keyword} onChange={(e) => setKeyword(e.target.value)} />
            </div>
          </form>

          <div className="hv-popular">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                type="button"
                className={category === c ? 'hv-popular-active' : ''}
                onClick={() => setCategory(c)}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="hv-section">
        <a
          className="crs-roadmap-banner"
          href="https://roadmap.sh/roadmaps"
          target="_blank"
          rel="noopener noreferrer"
        >
          <span className="crs-roadmap-icon"><CompassIcon /></span>
          <span className="crs-roadmap-text">
            <strong>Want a structured learning path?</strong>
            <span>Explore roadmap.sh's free developer roadmaps and project ideas</span>
          </span>
          <span className="crs-roadmap-cta">Explore roadmaps <ArrowRightIcon /></span>
        </a>

        <div className="hv-section-head">
          <div>
            <span className="hv-eyebrow">{filtered.length} course{filtered.length === 1 ? '' : 's'}</span>
            <h2>{category === 'All' ? 'All courses' : category}</h2>
          </div>
        </div>

        {error ? (
          <div className="crs-empty"><LayersIcon /><p>{error}</p></div>
        ) : loading ? (
          <div className="crs-grid">
            {Array.from({ length: 6 }).map((_, i) => <div key={i} className="crs-card crs-card-skeleton" />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="crs-empty">
            <LayersIcon />
            <p>No courses match your search. Try a different keyword or category.</p>
          </div>
        ) : (
          <div className="crs-grid">
            {filtered.map((c) => (
              <div className="crs-card" key={c._id} onClick={() => navigate(`/courses/${c._id}`)}>
                <div className="crs-thumb" style={{ backgroundImage: `url(https://img.youtube.com/vi/${c.youtubeId}/hqdefault.jpg)` }}>
                  <span className="crs-level">{c.level}</span>
                </div>
                <div className="crs-body">
                  <span className="crs-category">{c.category}</span>
                  <h3>{c.title}</h3>
                  <p className="crs-instructor">{c.instructor ? `By ${c.instructor}` : ' '}</p>
                  <div className="crs-meta">
                    <span className="crs-duration"><ClockIcon /> {formatDuration(c.duration)}</span>
                  </div>
                  <div className="crs-footer">
                    <span className="crs-price">{c.price}</span>
                    <button type="button" onClick={(e) => { e.stopPropagation(); navigate(`/courses/${c._id}`) }}>View course</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

    </div>
  )
}
