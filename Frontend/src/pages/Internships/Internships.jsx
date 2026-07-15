import { useMemo, useState } from 'react'
import './Internships.css'

const SearchIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="7" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
)
const GradCapIcon = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 10 12 5 2 10l10 5 10-5z" /><path d="M6 12v5c0 1.5 3 3 6 3s6-1.5 6-3v-5" />
  </svg>
)

const FIELDS = ['All', 'Engineering', 'Design', 'Marketing', 'Data', 'Business']
const DURATIONS = ['Any', '1-3 months', '3-6 months', '6+ months']

const INTERNSHIPS = [
  { id: 1, title: 'Software Engineering Intern', company: 'Shopify', location: 'Remote', remote: true, field: 'Engineering', duration: '3-6 months', stipend: '$2.5K/mo', applyBy: 'Aug 15, 2026' },
  { id: 2, title: 'Product Design Intern', company: 'Canva', location: 'Sydney', remote: false, field: 'Design', duration: '1-3 months', stipend: '$2K/mo', applyBy: 'Jul 30, 2026' },
  { id: 3, title: 'Growth Marketing Intern', company: 'Duolingo', location: 'Remote', remote: true, field: 'Marketing', duration: '3-6 months', stipend: '$1.8K/mo', applyBy: 'Aug 5, 2026' },
  { id: 4, title: 'Data Analytics Intern', company: 'Airbnb', location: 'Remote', remote: true, field: 'Data', duration: '6+ months', stipend: '$2.8K/mo', applyBy: 'Aug 20, 2026' },
  { id: 5, title: 'Business Operations Intern', company: 'Stripe', location: 'Dublin', remote: false, field: 'Business', duration: '3-6 months', stipend: '$2.2K/mo', applyBy: 'Jul 25, 2026' },
  { id: 6, title: 'Frontend Engineering Intern', company: 'Figma', location: 'Remote', remote: true, field: 'Engineering', duration: '1-3 months', stipend: '$2.4K/mo', applyBy: 'Aug 10, 2026' },
]

export default function Internships() {
  const [keyword, setKeyword] = useState('')
  const [field, setField] = useState('All')
  const [duration, setDuration] = useState('Any')
  const [remoteOnly, setRemoteOnly] = useState(false)

  const filtered = useMemo(() => {
    const kw = keyword.trim().toLowerCase()
    return INTERNSHIPS.filter((i) => {
      const matchesField = field === 'All' || i.field === field
      const matchesDuration = duration === 'Any' || i.duration === duration
      const matchesKeyword = !kw || i.title.toLowerCase().includes(kw) || i.company.toLowerCase().includes(kw)
      const matchesRemote = !remoteOnly || i.remote
      return matchesField && matchesDuration && matchesKeyword && matchesRemote
    })
  }, [keyword, field, duration, remoteOnly])

  return (
    <div className="hv-root">

      <section className="hv-page-hero">
        <div className="hv-page-hero-inner">
          <h1>Kickstart your career with the right internship.</h1>
          <p>{INTERNSHIPS.length} active internships from companies ready to mentor.</p>

          <form className="hv-search int-search" onSubmit={(e) => e.preventDefault()}>
            <div className="hv-search-field">
              <SearchIcon />
              <input type="text" placeholder="Role or company" value={keyword} onChange={(e) => setKeyword(e.target.value)} />
            </div>
          </form>
        </div>
      </section>

      <section className="jb-body">
        <aside className="jb-filters">
          <h3>Filters</h3>

          <div className="jb-filter-group">
            <span className="jb-filter-label">Field</span>
            <div className="jb-pill-row">
              {FIELDS.map((f) => (
                <button key={f} type="button" className={field === f ? 'jb-pill jb-pill-active' : 'jb-pill'} onClick={() => setField(f)}>{f}</button>
              ))}
            </div>
          </div>

          <div className="jb-filter-group">
            <span className="jb-filter-label">Duration</span>
            <div className="jb-pill-row">
              {DURATIONS.map((d) => (
                <button key={d} type="button" className={duration === d ? 'jb-pill jb-pill-active' : 'jb-pill'} onClick={() => setDuration(d)}>{d}</button>
              ))}
            </div>
          </div>

          <label className="jb-remote-check">
            <input type="checkbox" checked={remoteOnly} onChange={(e) => setRemoteOnly(e.target.checked)} />
            Remote only
          </label>
        </aside>

        <div className="int-results">
          <div className="jb-results-head">
            <span>{filtered.length} internship{filtered.length === 1 ? '' : 's'}</span>
          </div>

          {filtered.length === 0 ? (
            <div className="jb-empty">
              <GradCapIcon />
              <p>No internships match your filters. Try widening your search.</p>
            </div>
          ) : (
            <div className="jb-list">
              {filtered.map((i) => (
                <div className="jb-card" key={i.id}>
                  <span className="jb-avatar">{i.company[0]}</span>
                  <div className="jb-card-main">
                    <h3>{i.title}</h3>
                    <p className="jb-card-meta">{i.company} · {i.location} · Apply by {i.applyBy}</p>
                    <div className="jb-card-tags">
                      <span className="jb-tag jb-tag-accent">{i.field}</span>
                      <span className="jb-tag">{i.duration}</span>
                      {i.remote && <span className="jb-tag">Remote</span>}
                    </div>
                  </div>
                  <div className="jb-card-side">
                    <span className="jb-salary">{i.stipend}</span>
                    <button type="button">Apply</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

    </div>
  )
}
