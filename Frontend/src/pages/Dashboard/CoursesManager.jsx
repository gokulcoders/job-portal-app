import { useState, useEffect, useCallback } from 'react'
import { fetchAdminCourses, createCourse, updateCourse, deleteCourse } from '@services/api'
import './CoursesManager.css'

const YT_ID_RE = /(?:youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
const extractYouTubeId = (url) => (String(url || '').match(YT_ID_RE) || [])[1] || null

const LEVELS = ['Beginner', 'Intermediate', 'Advanced']
const SUGGESTED_CATEGORIES = ['Design', 'Engineering', 'Data', 'Business', 'Marketing']

const EditIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
    <path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4z"/>
  </svg>
)
const TrashIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
    <path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/>
  </svg>
)
const PlayIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
)
const EyeIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
  </svg>
)
const EyeOffIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
)

const EMPTY_FORM = { title: '', youtubeUrl: '', duration: '', category: '', level: 'Beginner', instructor: '', price: 'Free', description: '' }

function Toast({ msg, type, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3000)
    return () => clearTimeout(t)
  }, [onClose])
  return (
    <div className={`crm-toast crm-toast--${type}`}>
      <span>{msg}</span>
      <button onClick={onClose}>✕</button>
    </div>
  )
}

function ConfirmModal({ course, onConfirm, onCancel }) {
  return (
    <div className="crm-overlay">
      <div className="crm-modal">
        <p className="crm-modal-title">Delete this course?</p>
        <p className="crm-modal-sub"><strong>{course.title}</strong> and everyone's watch progress on it will be permanently removed.</p>
        <div className="crm-modal-actions">
          <button type="button" className="crm-btn crm-btn-ghost" onClick={onCancel}>Cancel</button>
          <button type="button" className="crm-btn crm-btn-danger" onClick={onConfirm}>Delete</button>
        </div>
      </div>
    </div>
  )
}

export default function CoursesManager() {
  const [courses,  setCourses]  = useState([])
  const [loading,  setLoading]  = useState(true)
  const [error,    setError]    = useState(null)
  const [toast,    setToast]    = useState(null)
  const [toDelete, setToDelete] = useState(null)

  const [form, setForm]         = useState(EMPTY_FORM)
  const [editingId, setEditingId] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  const showToast = (msg, type = 'success') => setToast({ msg, type })

  const load = useCallback(() => {
    setLoading(true)
    setError(null)
    fetchAdminCourses()
      .then(setCourses)
      .catch(() => setError('Failed to load courses.'))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => { load() }, [load])

  function resetForm() {
    setForm(EMPTY_FORM)
    setEditingId(null)
  }

  function startEdit(course) {
    setEditingId(course._id)
    setForm({
      title: course.title || '',
      youtubeUrl: course.youtubeUrl || '',
      duration: course.duration || '',
      category: course.category || '',
      level: course.level || 'Beginner',
      instructor: course.instructor || '',
      price: course.price || 'Free',
      description: course.description || '',
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.title.trim() || !form.youtubeUrl.trim() || !form.duration) {
      showToast('Title, YouTube link and duration are required', 'error')
      return
    }
    if (!extractYouTubeId(form.youtubeUrl)) {
      showToast("That doesn't look like a valid YouTube link", 'error')
      return
    }
    setSubmitting(true)
    try {
      if (editingId) {
        const updated = await updateCourse(editingId, form)
        setCourses(prev => prev.map(c => c._id === editingId ? updated : c))
        showToast('Course updated')
      } else {
        const created = await createCourse(form)
        setCourses(prev => [created, ...prev])
        showToast('Course published')
      }
      resetForm()
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to save course', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  async function handleDelete() {
    if (!toDelete) return
    try {
      await deleteCourse(toDelete._id)
      setCourses(prev => prev.filter(c => c._id !== toDelete._id))
      showToast('Course deleted')
      if (editingId === toDelete._id) resetForm()
    } catch {
      showToast('Failed to delete course', 'error')
    } finally {
      setToDelete(null)
    }
  }

  async function handleToggleActive(course) {
    try {
      const updated = await updateCourse(course._id, { isActive: !course.isActive })
      setCourses(prev => prev.map(c => c._id === updated._id ? updated : c))
      showToast(updated.isActive ? 'Course is now visible to users' : 'Course hidden from users')
    } catch {
      showToast('Failed to update visibility', 'error')
    }
  }

  const previewId = extractYouTubeId(form.youtubeUrl)

  return (
    <div className="crm-root">
      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
      {toDelete && <ConfirmModal course={toDelete} onConfirm={handleDelete} onCancel={() => setToDelete(null)} />}

      <div className="crm-header">
        <h1 className="crm-title">Courses</h1>
        <p className="crm-sub">Publish YouTube-based courses — visible to every logged-in user on the public Courses page</p>
      </div>

      <div className="crm-layout">
        {/* ── Create / edit form ── */}
        <form className="crm-form-card" onSubmit={handleSubmit}>
          <h2 className="crm-card-title">{editingId ? 'Edit course' : 'New course'}</h2>

          <div className="crm-video-preview">
            {previewId ? (
              <>
                <img src={`https://img.youtube.com/vi/${previewId}/hqdefault.jpg`} alt="Video thumbnail" />
                <span className="crm-video-play"><PlayIcon /></span>
              </>
            ) : (
              <div className="crm-video-preview-empty">Paste a YouTube link to preview the thumbnail</div>
            )}
          </div>

          <div className="crm-field">
            <label className="crm-label">YouTube link *</label>
            <input className="crm-input" value={form.youtubeUrl} onChange={e => setForm(f => ({ ...f, youtubeUrl: e.target.value }))} placeholder="https://www.youtube.com/watch?v=…" type="url" />
          </div>

          <div className="crm-field">
            <label className="crm-label">Title *</label>
            <input className="crm-input" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="e.g. Advanced React Patterns" />
          </div>

          <div className="crm-field-row">
            <div className="crm-field">
              <label className="crm-label">Duration (minutes) *</label>
              <input className="crm-input" type="number" min="1" value={form.duration} onChange={e => setForm(f => ({ ...f, duration: e.target.value }))} placeholder="45" />
            </div>
            <div className="crm-field">
              <label className="crm-label">Level</label>
              <select className="crm-input" value={form.level} onChange={e => setForm(f => ({ ...f, level: e.target.value }))}>
                {LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
          </div>

          <div className="crm-field-row">
            <div className="crm-field">
              <label className="crm-label">Category</label>
              <input className="crm-input" list="crm-category-list" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} placeholder="e.g. Engineering" />
              <datalist id="crm-category-list">
                {SUGGESTED_CATEGORIES.map(c => <option key={c} value={c} />)}
              </datalist>
            </div>
            <div className="crm-field">
              <label className="crm-label">Price</label>
              <input className="crm-input" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} placeholder="Free or $49" />
            </div>
          </div>

          <div className="crm-field">
            <label className="crm-label">Instructor <span className="crm-optional">optional</span></label>
            <input className="crm-input" value={form.instructor} onChange={e => setForm(f => ({ ...f, instructor: e.target.value }))} placeholder="Instructor name" />
          </div>

          <div className="crm-field">
            <label className="crm-label">Description <span className="crm-optional">optional</span></label>
            <textarea className="crm-textarea" rows={3} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="What will learners get from this course…" maxLength={600} />
          </div>

          <div className="crm-form-actions">
            <button type="submit" className="crm-btn crm-btn-primary" disabled={submitting}>
              {submitting ? <><span className="crm-spin" /> Saving…</> : editingId ? 'Update course' : 'Publish course'}
            </button>
            {editingId && (
              <button type="button" className="crm-btn crm-btn-ghost" onClick={resetForm}>Cancel edit</button>
            )}
          </div>
        </form>

        {/* ── Existing courses ── */}
        <div className="crm-list-card">
          <h2 className="crm-card-title">All courses <span className="crm-count">{courses.length}</span></h2>

          {error ? (
            <div className="crm-empty">{error}</div>
          ) : loading ? (
            <div className="crm-empty">Loading…</div>
          ) : courses.length === 0 ? (
            <div className="crm-empty">No courses yet — publish one using the form.</div>
          ) : (
            <div className="crm-course-list">
              {courses.map(course => (
                <div key={course._id} className={`crm-course-row ${course.isActive ? '' : 'crm-course-row--hidden'}`}>
                  <img className="crm-course-thumb" src={`https://img.youtube.com/vi/${course.youtubeId}/default.jpg`} alt={course.title} />
                  <div className="crm-course-info">
                    <div className="crm-course-title-row">
                      <p className="crm-course-title">{course.title}</p>
                      {!course.isActive && <span className="crm-hidden-badge">Hidden</span>}
                    </div>
                    <p className="crm-course-meta">
                      {course.category} · {course.level} · {course.duration} min · {course.price}
                    </p>
                  </div>
                  <div className="crm-course-actions">
                    <button
                      type="button"
                      className="crm-icon-btn"
                      onClick={() => handleToggleActive(course)}
                      title={course.isActive ? 'Hide from users' : 'Show to users'}
                    >
                      {course.isActive ? <EyeIcon /> : <EyeOffIcon />}
                    </button>
                    <button type="button" className="crm-icon-btn" onClick={() => startEdit(course)} title="Edit course">
                      <EditIcon />
                    </button>
                    <button type="button" className="crm-icon-btn crm-icon-btn-danger" onClick={() => setToDelete(course)} title="Delete course">
                      <TrashIcon />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
