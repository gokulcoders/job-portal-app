import './JobCard.css'

const PinIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
  </svg>
)
const ClockIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
  </svg>
)
const ExternalIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
    <polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
  </svg>
)
const LinkedInIcon = () => (
  <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
)

const FALLBACK_COLORS = [
  ['#ede9fe', '#6d28d9'], ['#d1fae5', '#065f46'], ['#fce7f3', '#9d174d'],
  ['#fef3c7', '#92400e'], ['#dbeafe', '#1e40af'], ['#ffe4e6', '#9f1239'],
]

function CompanyAvatar({ image, name }) {
  const letter = (name || '?').charAt(0).toUpperCase()
  const [bg, color] = FALLBACK_COLORS[letter.charCodeAt(0) % FALLBACK_COLORS.length]

  if (image) {
    return (
      <div className="jc-logo-wrap">
        <img
          className="jc-logo"
          src={image}
          alt={name}
          onError={(e) => {
            e.currentTarget.parentElement.innerHTML =
              `<div class="jc-logo-fallback" style="background:${bg};color:${color}">${letter}</div>`
          }}
        />
      </div>
    )
  }
  return (
    <div className="jc-logo-wrap">
      <div className="jc-logo-fallback" style={{ background: bg, color }}>
        {letter}
      </div>
    </div>
  )
}

export default function JobCard({ job }) {
  const applyUrl = job.applyLink || job.jobLink

  return (
    <article className="jc-card">
      {/* Top row */}
      <div className="jc-top">
        <CompanyAvatar image={job.companyImage} name={job.company} />
        <div className="jc-header">
          <h3 className="jc-title">{job.title || 'Untitled Role'}</h3>
          {job.company && (
            job.companyLink
              ? <a className="jc-company" href={job.companyLink} target="_blank" rel="noopener noreferrer">{job.company}</a>
              : <span className="jc-company">{job.company}</span>
          )}
        </div>
        {job.source === 'linkedin' && (
          <span className="jc-source-badge"><LinkedInIcon /> LinkedIn</span>
        )}
      </div>

      <div className="jc-divider" />

      {/* Meta */}
      {(job.place || job.lastDate) && (
        <div className="jc-meta">
          {job.place && (
            <span className="jc-meta-item"><PinIcon />{job.place}</span>
          )}
          {job.lastDate && (
            <span className="jc-meta-item"><ClockIcon />{job.lastDate}</span>
          )}
        </div>
      )}

      {/* Tags */}
      <div className="jc-tags">
        {job.keyword && <span className="jc-tag jc-tag-keyword">{job.keyword}</span>}
      </div>

      {/* Footer */}
      <div className="jc-footer">
        <a className="jc-apply-btn" href={applyUrl} target="_blank" rel="noopener noreferrer">
          Apply Now <ExternalIcon />
        </a>
        <a className="jc-view-link" href={job.jobLink} target="_blank" rel="noopener noreferrer">
          View Job
        </a>
      </div>
    </article>
  )
}
