import JobCard from './JobCard'
import './JobList.css'

function SkeletonCard() {
  return (
    <div className="jl-skeleton">
      <div className="jl-sk-row">
        <div className="jl-sk-logo sk-pulse" />
        <div className="jl-sk-lines">
          <div className="jl-sk-line sk-pulse" style={{ width: '65%' }} />
          <div className="jl-sk-line sk-pulse" style={{ width: '42%', height: '10px' }} />
        </div>
      </div>
      <div className="jl-sk-divider" />
      <div className="jl-sk-line sk-pulse" style={{ width: '55%', height: '10px' }} />
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <div className="jl-sk-line sk-pulse" style={{ width: '72px', height: '22px', borderRadius: '99px' }} />
      </div>
      <div className="jl-sk-line sk-pulse" style={{ width: '110px', height: '34px', borderRadius: '99px' }} />
    </div>
  )
}

export default function JobList({ jobs, loading }) {
  if (loading) {
    return (
      <div className="job-list-grid">
        {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
      </div>
    )
  }

  if (!jobs?.length) {
    return (
      <div className="jl-empty">
        <div className="jl-empty-icon">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#c4b5fd" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
        </div>
        <p className="jl-empty-title">No jobs found</p>
        <p className="jl-empty-sub">Try a different keyword or location, or check back after the next scrape.</p>
      </div>
    )
  }

  return (
    <div className="job-list-grid">
      {jobs.map((job) => <JobCard job={job} key={job._id} />)}
    </div>
  )
}
