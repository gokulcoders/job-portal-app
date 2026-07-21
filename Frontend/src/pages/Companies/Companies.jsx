import { useEffect, useMemo, useState } from 'react'
import { fetchCompanies } from '@services/api'
import './Companies.css'

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
const ExternalIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
    <polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
  </svg>
)

export default function Companies() {
  const [companies, setCompanies] = useState([])
  const [loading,   setLoading]   = useState(true)
  const [error,     setError]     = useState(null)
  const [keyword,   setKeyword]   = useState('')
  const [industry,  setIndustry]  = useState('All')
  const [remoteOnly, setRemoteOnly] = useState(false)

  useEffect(() => {
    setLoading(true)
    setError(null)
    fetchCompanies()
      .then(setCompanies)
      .catch(() => setError('Could not load companies.'))
      .finally(() => setLoading(false))
  }, [])

  const industries = useMemo(() => {
    const unique = [...new Set(companies.map(c => c.industry).filter(Boolean))].sort()
    return ['All', ...unique]
  }, [companies])

  const filtered = useMemo(() => {
    const kw = keyword.trim().toLowerCase()
    return companies.filter((c) => {
      const matchesIndustry = industry === 'All' || c.industry === industry
      const matchesKeyword = !kw || c.name.toLowerCase().includes(kw) || c.location?.toLowerCase().includes(kw)
      const matchesRemote = !remoteOnly || c.remoteFriendly
      return matchesIndustry && matchesKeyword && matchesRemote
    })
  }, [companies, keyword, industry, remoteOnly])

  return (
    <div className="hv-root">

      <section className="hv-page-hero">
        <div className="hv-page-hero-inner">
          <h1>Discover companies hiring right now.</h1>
          <p>{companies.length}+ companies with open roles on HireVerse.</p>

          <form className="hv-search cmp-search" onSubmit={(e) => e.preventDefault()}>
            <div className="hv-search-field">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="7" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input type="text" placeholder="Company name or location" value={keyword} onChange={(e) => setKeyword(e.target.value)} />
            </div>
          </form>

          {industries.length > 1 && (
            <div className="hv-popular">
              {industries.map((i) => (
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
          )}
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

        {error ? (
          <div className="cmp-empty">
            <BuildingIcon />
            <p>{error}</p>
          </div>
        ) : loading ? (
          <div className="cmp-empty">
            <p>Loading companies…</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="cmp-empty">
            <BuildingIcon />
            <p>No companies match your filters. Try widening your search.</p>
          </div>
        ) : (
          <div className="cmp-grid">
            {filtered.map((c) => (
              <div className="cmp-card" key={c._id}>
                <div className="cmp-top">
                  {c.logo ? (
                    <img className="cmp-logo" src={c.logo} alt={c.name} />
                  ) : (
                    <span className="cmp-avatar">{c.name[0]}</span>
                  )}
                  <div>
                    <h3>{c.name}</h3>
                    {c.location && <p className="cmp-meta"><PinIcon /> {c.location}</p>}
                  </div>
                </div>
                {c.description && <p className="cmp-desc">{c.description}</p>}
                <div className="cmp-info-row">
                  {c.size ? <span><UsersIcon /> {c.size} employees</span> : <span />}
                  {c.remoteFriendly && <span className="cmp-remote-badge">Remote-friendly</span>}
                </div>
                <div className="cmp-footer">
                  <span className="cmp-roles">{c.openRoles} open role{c.openRoles === 1 ? '' : 's'}</span>
                  {c.website ? (
                    <a className="cmp-visit-btn" href={c.website} target="_blank" rel="noopener noreferrer">
                      Visit site <ExternalIcon />
                    </a>
                  ) : (
                    <a className="cmp-visit-btn" href={`/jobs?q=${encodeURIComponent(c.name)}`}>
                      View jobs
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

    </div>
  )
}
