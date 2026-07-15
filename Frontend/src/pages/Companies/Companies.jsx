import { useMemo, useState } from 'react'
import './Companies.css'

const StarIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2l2.9 6.3 6.9.7-5.2 4.7 1.5 6.8L12 17l-6.1 3.5 1.5-6.8-5.2-4.7 6.9-.7z" />
  </svg>
)
const PinIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
  </svg>
)
const UsersIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
)
const BuildingIcon = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <rect x="4" y="2" width="16" height="20" rx="1" /><line x1="9" y1="8" x2="9" y2="8" /><line x1="15" y1="8" x2="15" y2="8" /><line x1="9" y1="12" x2="9" y2="12" /><line x1="15" y1="12" x2="15" y2="12" /><line x1="9" y1="16" x2="15" y2="16" />
  </svg>
)

const INDUSTRIES = ['All', 'Tech', 'Finance', 'Healthcare', 'Retail', 'Media']

const COMPANIES = [
  { id: 1, name: 'Notion', industry: 'Tech', hq: 'San Francisco, US', size: '500-1000', rating: 4.7, openRoles: 24, remoteFriendly: true },
  { id: 2, name: 'Stripe', industry: 'Finance', hq: 'Dublin, IE', size: '1000-5000', rating: 4.6, openRoles: 41, remoteFriendly: true },
  { id: 3, name: 'Airbnb', industry: 'Tech', hq: 'San Francisco, US', size: '5000+', rating: 4.5, openRoles: 18, remoteFriendly: true },
  { id: 4, name: 'Canva', industry: 'Tech', hq: 'Sydney, AU', size: '1000-5000', rating: 4.8, openRoles: 12, remoteFriendly: false },
  { id: 5, name: 'Mayo Clinic', industry: 'Healthcare', hq: 'Rochester, US', size: '5000+', rating: 4.4, openRoles: 33, remoteFriendly: false },
  { id: 6, name: 'Shopify', industry: 'Retail', hq: 'Ottawa, CA', size: '5000+', rating: 4.6, openRoles: 27, remoteFriendly: true },
  { id: 7, name: 'Duolingo', industry: 'Media', hq: 'Pittsburgh, US', size: '500-1000', rating: 4.7, openRoles: 9, remoteFriendly: true },
  { id: 8, name: 'Figma', industry: 'Tech', hq: 'San Francisco, US', size: '500-1000', rating: 4.9, openRoles: 15, remoteFriendly: true },
]

export default function Companies() {
  const [keyword, setKeyword] = useState('')
  const [industry, setIndustry] = useState('All')
  const [remoteOnly, setRemoteOnly] = useState(false)

  const filtered = useMemo(() => {
    const kw = keyword.trim().toLowerCase()
    return COMPANIES.filter((c) => {
      const matchesIndustry = industry === 'All' || c.industry === industry
      const matchesKeyword = !kw || c.name.toLowerCase().includes(kw) || c.hq.toLowerCase().includes(kw)
      const matchesRemote = !remoteOnly || c.remoteFriendly
      return matchesIndustry && matchesKeyword && matchesRemote
    })
  }, [keyword, industry, remoteOnly])

  return (
    <div className="hv-root">

      <section className="hv-page-hero">
        <div className="hv-page-hero-inner">
          <h1>Discover companies hiring right now.</h1>
          <p>{COMPANIES.length}+ world-class companies with open roles on HireVerse.</p>

          <form className="hv-search cmp-search" onSubmit={(e) => e.preventDefault()}>
            <div className="hv-search-field">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="7" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input type="text" placeholder="Company name or location" value={keyword} onChange={(e) => setKeyword(e.target.value)} />
            </div>
          </form>

          <div className="hv-popular">
            {INDUSTRIES.map((i) => (
              <button
                key={i}
                type="button"
                className={industry === i ? 'hv-popular-active' : ''}
                onClick={() => setIndustry(i)}
              >
                {i}
              </button>
            ))}
          </div>
          <label className="cmp-remote-check">
            <input type="checkbox" checked={remoteOnly} onChange={(e) => setRemoteOnly(e.target.checked)} />
            Remote-friendly only
          </label>
        </div>
      </section>

      <section className="hv-section">
        <div className="hv-section-head">
          <div>
            <span className="hv-eyebrow">{filtered.length} compan{filtered.length === 1 ? 'y' : 'ies'}</span>
            <h2>{industry === 'All' ? 'All companies' : industry}</h2>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="cmp-empty">
            <BuildingIcon />
            <p>No companies match your filters. Try widening your search.</p>
          </div>
        ) : (
          <div className="cmp-grid">
            {filtered.map((c) => (
              <div className="cmp-card" key={c.id}>
                <div className="cmp-top">
                  <span className="cmp-avatar">{c.name[0]}</span>
                  <div>
                    <h3>{c.name}</h3>
                    <p className="cmp-meta"><PinIcon /> {c.hq}</p>
                  </div>
                </div>
                <div className="cmp-info-row">
                  <span><UsersIcon /> {c.size} employees</span>
                  <span className="cmp-rating"><StarIcon /> {c.rating}</span>
                </div>
                <div className="cmp-footer">
                  <span className="cmp-roles">{c.openRoles} open roles</span>
                  <button type="button">View jobs</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

    </div>
  )
}
