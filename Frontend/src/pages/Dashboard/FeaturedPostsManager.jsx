import { useState, useEffect, useCallback, useRef } from 'react'
import { fetchAdminFeaturedPosts, createFeaturedPost, deleteFeaturedPost } from '@services/api'
import { PAGE_META } from '@components/jobs/FeaturedPostCard'
import './FeaturedPostsManager.css'

const UploadIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
  </svg>
)
const TrashIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
    <path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/>
  </svg>
)
const LinkIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
  </svg>
)

// Matches the OPPORTUNITIES sidebar section: Browse Jobs, Urgent Hiring, Internships, Walk-in Drives
const TARGET_PAGES = [
  { value: 'jobs',       label: 'Browse Jobs' },
  { value: 'urgent',     label: 'Urgent Hiring' },
  { value: 'internship', label: 'Internships' },
  { value: 'walkin',     label: 'Walk-in Drives' },
]

const EMPTY_FORM = { page: 'urgent', title: '', company: '', place: '', lastDate: '', link: '', content: '' }

function Toast({ msg, type, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3000)
    return () => clearTimeout(t)
  }, [onClose])
  return (
    <div className={`uhm-toast uhm-toast--${type}`}>
      <span>{msg}</span>
      <button onClick={onClose}>✕</button>
    </div>
  )
}

function ConfirmModal({ post, onConfirm, onCancel }) {
  return (
    <div className="uhm-overlay">
      <div className="uhm-modal">
        <p className="uhm-modal-title">Delete this post?</p>
        <p className="uhm-modal-sub"><strong>{post.title}</strong> will be removed from the {PAGE_META[post.page]?.label || 'page'} immediately. This cannot be undone.</p>
        <div className="uhm-modal-actions">
          <button type="button" className="uhm-btn uhm-btn-ghost" onClick={onCancel}>Cancel</button>
          <button type="button" className="uhm-btn uhm-btn-danger" onClick={onConfirm}>Delete</button>
        </div>
      </div>
    </div>
  )
}

function PageBadge({ page }) {
  const meta = PAGE_META[page] || PAGE_META.jobs
  return <span className="uhm-page-badge" style={{ background: `linear-gradient(135deg, ${meta.from}, ${meta.to})` }}>{meta.label}</span>
}

export default function FeaturedPostsManager() {
  const [posts,    setPosts]    = useState([])
  const [loading,  setLoading]  = useState(true)
  const [error,    setError]    = useState(null)
  const [toast,    setToast]    = useState(null)
  const [toDelete, setToDelete] = useState(null)

  const [form,      setForm]      = useState(EMPTY_FORM)
  const [imageFile, setImageFile] = useState(null)
  const [preview,   setPreview]   = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const fileInputRef = useRef(null)

  const showToast = (msg, type = 'success') => setToast({ msg, type })

  const load = useCallback(() => {
    setLoading(true)
    setError(null)
    fetchAdminFeaturedPosts()
      .then(setPosts)
      .catch(() => setError('Failed to load posts.'))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => { load() }, [load])

  function handleImageChange(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setImageFile(file)
    setPreview(URL.createObjectURL(file))
  }

  function resetForm() {
    setForm(f => ({ ...EMPTY_FORM, page: f.page }))
    setImageFile(null)
    setPreview(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.title.trim() || !form.link.trim()) {
      showToast('Title and link are required', 'error')
      return
    }
    setSubmitting(true)
    try {
      const fd = new FormData()
      Object.entries(form).forEach(([k, v]) => fd.append(k, v))
      if (imageFile) fd.append('image', imageFile)

      const post = await createFeaturedPost(fd)
      setPosts(prev => [post, ...prev])
      resetForm()
      showToast(`Post published to ${PAGE_META[post.page]?.label || 'page'}`)
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to create post', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  async function handleDelete() {
    if (!toDelete) return
    try {
      await deleteFeaturedPost(toDelete._id)
      setPosts(prev => prev.filter(p => p._id !== toDelete._id))
      showToast('Post deleted')
    } catch {
      showToast('Failed to delete post', 'error')
    } finally {
      setToDelete(null)
    }
  }

  return (
    <div className="uhm-root">
      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
      {toDelete && <ConfirmModal post={toDelete} onConfirm={handleDelete} onCancel={() => setToDelete(null)} />}

      <div className="uhm-header">
        <h1 className="uhm-title">Featured Posts</h1>
        <p className="uhm-sub">Publish banner posts to any of the opportunities pages — Browse Jobs, Urgent Hiring, Internships or Walk-in Drives</p>
      </div>

      <div className="uhm-layout">
        {/* ── Create form ── */}
        <form className="uhm-form-card" onSubmit={handleSubmit}>
          <h2 className="uhm-card-title">New post</h2>

          <div className="uhm-field">
            <label className="uhm-label">Show on page *</label>
            <div className="uhm-page-select">
              {TARGET_PAGES.map(p => (
                <button
                  type="button"
                  key={p.value}
                  className={`uhm-page-pill ${form.page === p.value ? 'uhm-page-pill--active' : ''}`}
                  style={form.page === p.value ? { background: `linear-gradient(135deg, ${PAGE_META[p.value].from}, ${PAGE_META[p.value].to})` } : undefined}
                  onClick={() => setForm(f => ({ ...f, page: p.value }))}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <label className="uhm-dropzone" htmlFor="uhm-image-input">
            {preview ? (
              <img src={preview} alt="Preview" className="uhm-dropzone-preview" />
            ) : (
              <div className="uhm-dropzone-empty">
                <UploadIcon />
                <span>Click to upload banner image</span>
                <span className="uhm-dropzone-hint">JPG, PNG or WEBP · up to 5MB</span>
              </div>
            )}
          </label>
          <input
            id="uhm-image-input"
            ref={fileInputRef}
            type="file"
            accept="image/png, image/jpeg, image/webp"
            onChange={handleImageChange}
            hidden
          />

          <div className="uhm-field">
            <label className="uhm-label">Title *</label>
            <input className="uhm-input" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="e.g. Immediate opening — Frontend Developer" />
          </div>

          <div className="uhm-field-row">
            <div className="uhm-field">
              <label className="uhm-label">Company</label>
              <input className="uhm-input" value={form.company} onChange={e => setForm(f => ({ ...f, company: e.target.value }))} placeholder="Company name" />
            </div>
            <div className="uhm-field">
              <label className="uhm-label">Location</label>
              <input className="uhm-input" value={form.place} onChange={e => setForm(f => ({ ...f, place: e.target.value }))} placeholder="City / Remote" />
            </div>
          </div>

          <div className="uhm-field-row">
            <div className="uhm-field">
              <label className="uhm-label">Apply link *</label>
              <input className="uhm-input" value={form.link} onChange={e => setForm(f => ({ ...f, link: e.target.value }))} placeholder="https://…" type="url" />
            </div>
            <div className="uhm-field">
              <label className="uhm-label">Last date <span className="uhm-optional">optional</span></label>
              <input className="uhm-input" value={form.lastDate} onChange={e => setForm(f => ({ ...f, lastDate: e.target.value }))} placeholder="e.g. 30 Jul 2026" />
            </div>
          </div>

          <div className="uhm-field">
            <label className="uhm-label">Content <span className="uhm-optional">optional</span></label>
            <textarea className="uhm-textarea" rows={3} value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))} placeholder="Short description shown on the banner…" maxLength={400} />
            <span className="uhm-char-count">{form.content.length}/400</span>
          </div>

          <button type="submit" className="uhm-btn uhm-btn-primary" disabled={submitting}>
            {submitting ? <><span className="uhm-spin" /> Publishing…</> : 'Publish post'}
          </button>
        </form>

        {/* ── Existing posts ── */}
        <div className="uhm-list-card">
          <h2 className="uhm-card-title">Live posts <span className="uhm-count">{posts.length}</span></h2>

          {error ? (
            <div className="uhm-empty">{error}</div>
          ) : loading ? (
            <div className="uhm-empty">Loading…</div>
          ) : posts.length === 0 ? (
            <div className="uhm-empty">No featured posts yet — publish one using the form.</div>
          ) : (
            <div className="uhm-post-list">
              {posts.map(post => (
                <div key={post._id} className="uhm-post-row">
                  <div className="uhm-post-thumb">
                    {post.image ? <img src={post.image} alt={post.title} /> : <div className="uhm-post-thumb-empty">{post.title?.[0]?.toUpperCase() || '?'}</div>}
                  </div>
                  <div className="uhm-post-info">
                    <div className="uhm-post-title-row">
                      <p className="uhm-post-title">{post.title}</p>
                      <PageBadge page={post.page} />
                    </div>
                    <p className="uhm-post-meta">
                      {[post.company, post.place].filter(Boolean).join(' · ') || '—'}
                    </p>
                    <a className="uhm-post-link" href={post.link} target="_blank" rel="noopener noreferrer">
                      <LinkIcon /> {post.link}
                    </a>
                  </div>
                  <button type="button" className="uhm-post-delete" onClick={() => setToDelete(post)} title="Delete post">
                    <TrashIcon />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
