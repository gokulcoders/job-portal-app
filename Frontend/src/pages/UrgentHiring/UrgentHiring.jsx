import { useMemo, useState } from 'react'
import './UrgentHiring.css'

const BoltIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M13 2 3 14h7l-1 8 10-12h-7l1-8z" />
  </svg>
)
const SearchIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="7" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
)

const JOB_TYPES = ['All', 'Full-time', 'Contract']

const URGENT_JOBS = [
  { id: 1, title: 'On-call Site Reliability Engineer', company: 'Stripe', location: 'Remote', jobType: 'Full-time', closesInDays: 2, tags: ['SRE', 'Kubernetes'] },
  { id: 2, title: 'Trust & Safety Specialist', company: 'Airbnb', location: 'Remote', jobType: 'Contract', closesInDays: 1, tags: ['Policy', 'Investigations'] },
  { id: 3, title: 'Launch Support Engineer', company: 'Notion', location: 'San Francisco', jobType: 'Full-time', closesInDays: 3, tags: ['Support', 'API'] },
  { id: 4, title: 'Payments Fraud Analyst', company: 'Shopify', location: 'Remote', jobType: 'Full-time', closesInDays: 2, tags: ['Risk', 'SQL'] },
  { id: 5, title: 'Contract Recruiter — Q3 Surge', company: 'Figma', location: 'Remote', jobType: 'Contract', closesInDays: 4, tags: ['Sourcing', 'ATS'] },
]

export default function UrgentHiring() {
  const [keyword, setKeyword] = useState('')
  const [jobType, setJobType] = useState('All')

  const filtered = useMemo(() => {
    const kw = keyword.trim().toLowerCase()
    return URGENT_JOBS.filter((j) => {
      const matchesType = jobType === 'All' || j.jobType === jobType
      const matchesKeyword = !kw || j.title.toLowerCase().includes(kw) || j.company.toLowerCase().includes(kw)
      return matchesType && matchesKeyword
    }).sort((a, b) => a.closesInDays - b.closesInDays)
  }, [keyword, jobType])

  return (
    <div className="hv-root">

      <section className="uh-hero">
        <div className="hv-page-hero-inner">
          <span className="uh-badge"><BoltIcon /> Closing fast</span>
          <h1>Roles closing fast — apply before the window shuts.</h1>
          <p>Company-verified urgent roles with one-click apply. {URGENT_JOBS.length} open right now.</p>

          <form className="hv-search uh-search" onSubmit={(e) => e.preventDefault()}>
            <div className="hv-search-field">
              <SearchIcon />
              <input type="text" placeholder="Role or company" value={keyword} onChange={(e) => setKeyword(e.target.value)} />
            </div>
          </form>

          <div className="hv-popular">
            {JOB_TYPES.map((t) => (
              <button key={t} type="button" className={jobType === t ? 'hv-popular-active' : ''} onClick={() => setJobType(t)}>{t}</button>
            ))}
          </div>
        </div>
      </section>

      <section className="hv-section">
        <div className="jb-results-head">
          <span>{filtered.length} urgent role{filtered.length === 1 ? '' : 's'}</span>
        </div>

        {filtered.length === 0 ? (
          <div className="jb-empty">
            <BoltIcon />
            <p>No urgent roles match your search right now.</p>
          </div>
        ) : (
          <div className="jb-list">
            {filtered.map((j) => (
              <div className="jb-card uh-card" key={j.id}>
                <span className="jb-avatar uh-avatar">{j.company[0]}</span>
                <div className="jb-card-main">
                  <div className="uh-title-row">
                    <h3>{j.title}</h3>
                    <span className="uh-countdown">Closes in {j.closesInDays}d</span>
                  </div>
                  <p className="jb-card-meta">{j.company} · {j.location}</p>
                  <div className="jb-card-tags">
                    <span className="jb-tag uh-tag-accent">{j.jobType}</span>
                    {j.tags.map((t) => <span className="jb-tag" key={t}>{t}</span>)}
                  </div>
                </div>
                <div className="jb-card-side">
                  <button type="button" className="uh-apply-btn">One-click apply</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

    </div>
  )
}
