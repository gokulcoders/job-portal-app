import './FeaturedPostCard.css'

const BoltIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
    <path d="M13 2 3 14h7l-1 8 10-12h-7l1-8z"/>
  </svg>
)
const PinIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
  </svg>
)
const ClockIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
  </svg>
)
const ExternalIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
    <polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
  </svg>
)

export const PAGE_META = {
  urgent:     { label: 'Urgent Hiring', from: '#ef4444', to: '#f97316' },
  walkin:     { label: 'Walk-in Drive', from: '#0891b2', to: '#0e7490' },
  internship: { label: 'Internship',    from: '#7c3aed', to: '#a855f7' },
  jobs:       { label: 'Featured',      from: '#2563eb', to: '#4f8ef7' },
}

export default function FeaturedPostCard({ post }) {
  const meta = PAGE_META[post.page] || PAGE_META.jobs
  const gradient = `linear-gradient(135deg, ${meta.from}, ${meta.to})`

  return (
    <article className="fp-card" style={{ '--fp-from': meta.from, '--fp-to': meta.to }}>
      {post.image && (
        <div className="fp-image-wrap">
          <img className="fp-image" src={post.image} alt={post.title} />
          <span className="fp-ribbon" style={{ background: gradient }}><BoltIcon /> {meta.label}</span>
        </div>
      )}
      <div className="fp-body">
        {!post.image && <span className="fp-ribbon fp-ribbon-inline" style={{ background: gradient }}><BoltIcon /> {meta.label}</span>}
        <h3 className="fp-title">{post.title}</h3>
        {post.company && <p className="fp-company">{post.company}</p>}

        {(post.place || post.lastDate) && (
          <div className="fp-meta">
            {post.place && <span className="fp-meta-item"><PinIcon />{post.place}</span>}
            {post.lastDate && (
              <span className="fp-meta-item">
                <ClockIcon /> Apply by {new Date(post.lastDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
              </span>
            )}
          </div>
        )}

        {post.content && <p className="fp-content">{post.content}</p>}

        <a className="fp-apply-btn" href={post.link} target="_blank" rel="noopener noreferrer" style={{ background: gradient }}>
          View / Apply <ExternalIcon />
        </a>
      </div>
    </article>
  )
}
