import { useMemo, useState } from 'react'
import './WalkIn.css'

const SearchIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="7" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
)
const CalendarIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
  </svg>
)
const PinIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
  </svg>
)
const ClockIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="9" /><polyline points="12 7 12 12 15.5 15" />
  </svg>
)

const CITIES = ['All cities', 'Bengaluru', 'Mumbai', 'Remote (Video)', 'Berlin']

const DRIVES = [
  { id: 1, company: 'Notion', role: 'Product Designer', date: 'Jul 12, 2026', time: '10:00 AM – 4:00 PM', venue: 'WeWork Koramangala', city: 'Bengaluru', spotsLeft: 8 },
  { id: 2, company: 'Danobil', role: 'HR Program Associate', date: 'Jul 14, 2026', time: '11:00 AM – 3:00 PM', venue: 'Danobil HQ, Bandra', city: 'Mumbai', spotsLeft: 5 },
  { id: 3, company: 'Shopify', role: 'Support Engineer', date: 'Jul 18, 2026', time: '9:00 AM – 1:00 PM', venue: 'Video walk-in (Zoom)', city: 'Remote (Video)', spotsLeft: 20 },
  { id: 4, company: 'Duolingo', role: 'Content Marketing Associate', date: 'Jul 20, 2026', time: '2:00 PM – 6:00 PM', venue: 'Factory Berlin Mitte', city: 'Berlin', spotsLeft: 12 },
  { id: 5, company: 'Stripe', role: 'Customer Success Associate', date: 'Jul 22, 2026', time: '10:00 AM – 5:00 PM', venue: 'Prestige Tech Park', city: 'Bengaluru', spotsLeft: 3 },
]

export default function WalkIn() {
  const [keyword, setKeyword] = useState('')
  const [city, setCity] = useState('All cities')

  const filtered = useMemo(() => {
    const kw = keyword.trim().toLowerCase()
    return DRIVES.filter((d) => {
      const matchesCity = city === 'All cities' || d.city === city
      const matchesKeyword = !kw || d.role.toLowerCase().includes(kw) || d.company.toLowerCase().includes(kw)
      return matchesCity && matchesKeyword
    })
  }, [keyword, city])

  return (
    <div className="hv-root">

      <section className="hv-page-hero">
        <div className="hv-page-hero-inner">
          <h1>Walk-in interview drives near you.</h1>
          <p>{DRIVES.length} scheduled drives this month — venue maps and calendar sync included.</p>

          <form className="hv-search wi-search" onSubmit={(e) => e.preventDefault()}>
            <div className="hv-search-field">
              <SearchIcon />
              <input type="text" placeholder="Role or company" value={keyword} onChange={(e) => setKeyword(e.target.value)} />
            </div>
          </form>

          <div className="hv-popular">
            {CITIES.map((c) => (
              <button key={c} type="button" className={city === c ? 'hv-popular-active' : ''} onClick={() => setCity(c)}>{c}</button>
            ))}
          </div>
        </div>
      </section>

      <section className="hv-section">
        <div className="jb-results-head">
          <span>{filtered.length} drive{filtered.length === 1 ? '' : 's'}</span>
        </div>

        {filtered.length === 0 ? (
          <div className="jb-empty">
            <CalendarIcon />
            <p>No walk-in drives match your search. Try another city.</p>
          </div>
        ) : (
          <div className="wi-grid">
            {filtered.map((d) => (
              <div className="wi-card" key={d.id}>
                <div className="wi-card-top">
                  <span className="wi-avatar">{d.company[0]}</span>
                  <div>
                    <h3>{d.role}</h3>
                    <p className="wi-company">{d.company}</p>
                  </div>
                  <span className="wi-spots">{d.spotsLeft} spots left</span>
                </div>
                <div className="wi-detail"><CalendarIcon /> {d.date}</div>
                <div className="wi-detail"><ClockIcon /> {d.time}</div>
                <div className="wi-detail"><PinIcon /> {d.venue}, {d.city}</div>
                <button type="button" className="wi-cal-btn">Add to calendar</button>
              </div>
            ))}
          </div>
        )}
      </section>

    </div>
  )
}
