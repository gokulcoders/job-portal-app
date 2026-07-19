import { useEffect, useRef, useState, useCallback } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { fetchCourse, fetchMyCourseProgress, saveCourseProgress } from '@services/api'
import './CourseWatch.css'

const BackIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
  </svg>
)
const ClockIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="9" /><polyline points="12 7 12 12 15.5 15" />
  </svg>
)
const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
)

function formatDuration(mins) {
  if (!mins) return '—'
  const h = Math.floor(mins / 60)
  const m = mins % 60
  if (h === 0) return `${m}m`
  return m === 0 ? `${h}h` : `${h}h ${m}m`
}

// Loads the YouTube IFrame API script once and resolves when window.YT is ready.
let ytApiPromise = null
function loadYouTubeApi() {
  if (window.YT?.Player) return Promise.resolve(window.YT)
  if (ytApiPromise) return ytApiPromise

  ytApiPromise = new Promise((resolve) => {
    const prevReady = window.onYouTubeIframeAPIReady
    window.onYouTubeIframeAPIReady = () => {
      prevReady?.()
      resolve(window.YT)
    }
    const tag = document.createElement('script')
    tag.src = 'https://www.youtube.com/iframe_api'
    document.body.appendChild(tag)
  })
  return ytApiPromise
}

const SAVE_INTERVAL_MS = 8000

export default function CourseWatch() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [course, setCourse]     = useState(null)
  const [progress, setProgress] = useState(null)
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState(null)
  const [livePercent, setLivePercent] = useState(0)
  const [completed, setCompleted]     = useState(false)

  const playerRef   = useRef(null)
  const containerRef = useRef(null)
  const intervalRef  = useRef(null)
  const seekedRef    = useRef(false)

  const persistProgress = useCallback(async () => {
    const player = playerRef.current
    if (!player?.getCurrentTime) return
    const watchedSeconds  = player.getCurrentTime()
    const durationSeconds = player.getDuration()
    if (!durationSeconds) return
    try {
      const saved = await saveCourseProgress(id, { watchedSeconds, durationSeconds })
      setLivePercent(saved.progressPercent)
      setCompleted(saved.completed)
    } catch { /* non-fatal — will retry on next tick */ }
  }, [id])

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)
    Promise.all([fetchCourse(id), fetchMyCourseProgress(id).catch(() => null)])
      .then(([c, p]) => {
        if (cancelled) return
        setCourse(c)
        setProgress(p)
        setLivePercent(p?.progressPercent || 0)
        setCompleted(!!p?.completed)
      })
      .catch(() => !cancelled && setError('Could not load this course.'))
      .finally(() => !cancelled && setLoading(false))
    return () => { cancelled = true }
  }, [id])

  // Set up the YouTube player once the course (and its videoId) is known
  useEffect(() => {
    if (!course?.youtubeId || !containerRef.current) return
    let destroyed = false

    loadYouTubeApi().then((YT) => {
      if (destroyed) return
      playerRef.current = new YT.Player(containerRef.current, {
        videoId: course.youtubeId,
        playerVars: { rel: 0, modestbranding: 1 },
        events: {
          onReady: () => {
            if (!seekedRef.current && progress?.watchedSeconds > 10 && !progress?.completed) {
              playerRef.current.seekTo(progress.watchedSeconds, true)
            }
            seekedRef.current = true
          },
          onStateChange: (e) => {
            const PLAYING = 1, PAUSED = 2, ENDED = 0
            if (e.data === PLAYING) {
              clearInterval(intervalRef.current)
              intervalRef.current = setInterval(persistProgress, SAVE_INTERVAL_MS)
            } else if (e.data === PAUSED || e.data === ENDED) {
              clearInterval(intervalRef.current)
              persistProgress()
            }
          },
        },
      })
    })

    return () => {
      destroyed = true
      clearInterval(intervalRef.current)
      playerRef.current?.destroy?.()
      playerRef.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [course?.youtubeId])

  // Save one last time if the user navigates away mid-video
  useEffect(() => () => { persistProgress() }, [persistProgress])

  if (loading) {
    return <div className="cw-state">Loading course…</div>
  }
  if (error || !course) {
    return (
      <div className="cw-state">
        <p>{error || 'Course not found.'}</p>
        <Link to="/courses" className="cw-back-link"><BackIcon /> Back to courses</Link>
      </div>
    )
  }

  return (
    <div className="cw-root">
      <Link to="/courses" className="cw-back-link"><BackIcon /> Back to courses</Link>

      <div className="cw-layout">
        <div className="cw-player-col">
          <div className="cw-player-wrap">
            <div ref={containerRef} />
          </div>

          <div className="cw-progress-row">
            <div className="cw-progress-bar">
              <div className="cw-progress-fill" style={{ width: `${livePercent}%` }} />
            </div>
            <span className="cw-progress-label">
              {completed ? <><CheckIcon /> Completed</> : `${livePercent}% watched`}
            </span>
          </div>

          <h1 className="cw-title">{course.title}</h1>
          <div className="cw-meta-row">
            {course.instructor && <span>By {course.instructor}</span>}
            <span className="cw-meta-dot">·</span>
            <span><ClockIcon /> {formatDuration(course.duration)}</span>
            <span className="cw-meta-dot">·</span>
            <span className="cw-level-tag">{course.level}</span>
          </div>
          {course.description && <p className="cw-description">{course.description}</p>}
        </div>

        <aside className="cw-side">
          <div className="cw-side-card">
            <span className="cw-side-category">{course.category}</span>
            <p className="cw-side-price">{course.price}</p>
            <button type="button" className="cw-side-btn" onClick={() => navigate('/courses')}>Browse more courses</button>
          </div>
        </aside>
      </div>
    </div>
  )
}
