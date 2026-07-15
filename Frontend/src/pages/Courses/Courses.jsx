import { useMemo, useState } from 'react'
import './Courses.css'

const StarIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2l2.9 6.3 6.9.7-5.2 4.7 1.5 6.8L12 17l-6.1 3.5 1.5-6.8-5.2-4.7 6.9-.7z" />
  </svg>
)
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

const CATEGORIES = ['All', 'Design', 'Engineering', 'Data', 'Business', 'Marketing']

const COURSES = [
  { id: 1, title: 'UX Design Fundamentals', category: 'Design', instructor: 'Maria Chen', level: 'Beginner', duration: '6h', rating: 4.8, reviews: 1240, price: 'Free', gradient: 'linear-gradient(135deg,#a855f7,#ec4899)' },
  { id: 2, title: 'Advanced React Patterns', category: 'Engineering', instructor: 'Daniel Osei', level: 'Advanced', duration: '9h', rating: 4.9, reviews: 2103, price: '$49', gradient: 'linear-gradient(135deg,#6366f1,#a855f7)' },
  { id: 3, title: 'SQL for Data Analysis', category: 'Data', instructor: 'Priya Nair', level: 'Beginner', duration: '5h', rating: 4.7, reviews: 980, price: '$29', gradient: 'linear-gradient(135deg,#0ea5e9,#22d3ee)' },
  { id: 4, title: 'Product Management 101', category: 'Business', instructor: 'James Carter', level: 'Beginner', duration: '7h', rating: 4.6, reviews: 860, price: 'Free', gradient: 'linear-gradient(135deg,#f97316,#ec4899)' },
  { id: 5, title: 'Growth Marketing Playbook', category: 'Marketing', instructor: 'Sofia Ramirez', level: 'Intermediate', duration: '8h', rating: 4.5, reviews: 640, price: '$39', gradient: 'linear-gradient(135deg,#16a34a,#84cc16)' },
  { id: 6, title: 'Machine Learning Foundations', category: 'Data', instructor: 'Wei Zhang', level: 'Intermediate', duration: '12h', rating: 4.9, reviews: 3120, price: '$59', gradient: 'linear-gradient(135deg,#db2777,#a855f7)' },
  { id: 7, title: 'Figma to Design Systems', category: 'Design', instructor: 'Maria Chen', level: 'Intermediate', duration: '6h', rating: 4.8, reviews: 1520, price: '$35', gradient: 'linear-gradient(135deg,#a855f7,#6366f1)' },
  { id: 8, title: 'System Design Interview Prep', category: 'Engineering', instructor: 'Daniel Osei', level: 'Advanced', duration: '10h', rating: 4.9, reviews: 2740, price: '$45', gradient: 'linear-gradient(135deg,#16171b,#3f3f46)' },
  { id: 9, title: 'Negotiation & Salary Strategy', category: 'Business', instructor: 'James Carter', level: 'Beginner', duration: '3h', rating: 4.7, reviews: 510, price: 'Free', gradient: 'linear-gradient(135deg,#f59e0b,#ef4444)' },
]

export default function Courses() {
  const [keyword, setKeyword] = useState('')
  const [category, setCategory] = useState('All')

  const filtered = useMemo(() => {
    const kw = keyword.trim().toLowerCase()
    return COURSES.filter((c) => {
      const matchesCategory = category === 'All' || c.category === category
      const matchesKeyword = !kw || c.title.toLowerCase().includes(kw) || c.instructor.toLowerCase().includes(kw)
      return matchesCategory && matchesKeyword
    })
  }, [keyword, category])

  return (
    <div className="hv-root">

      <section className="hv-page-hero">
        <div className="hv-page-hero-inner">
          <h1>Learn skills that move your career forward.</h1>
          <p>{COURSES.length}+ courses across design, engineering, data and business.</p>

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
        <div className="hv-section-head">
          <div>
            <span className="hv-eyebrow">{filtered.length} course{filtered.length === 1 ? '' : 's'}</span>
            <h2>{category === 'All' ? 'All courses' : category}</h2>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="crs-empty">
            <LayersIcon />
            <p>No courses match your search. Try a different keyword or category.</p>
          </div>
        ) : (
          <div className="crs-grid">
            {filtered.map((c) => (
              <div className="crs-card" key={c.id}>
                <div className="crs-thumb" style={{ background: c.gradient }}>
                  <LayersIcon />
                  <span className="crs-level">{c.level}</span>
                </div>
                <div className="crs-body">
                  <span className="crs-category">{c.category}</span>
                  <h3>{c.title}</h3>
                  <p className="crs-instructor">By {c.instructor}</p>
                  <div className="crs-meta">
                    <span className="crs-rating"><StarIcon /> {c.rating} <em>({c.reviews})</em></span>
                    <span className="crs-duration"><ClockIcon /> {c.duration}</span>
                  </div>
                  <div className="crs-footer">
                    <span className="crs-price">{c.price}</span>
                    <button type="button">View course</button>
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
