import { useState, useEffect, useCallback, useRef } from 'react'
import { fetchAdminCompanies, createCompany, updateCompany, deleteCompany, importCompanies } from '@services/api'
import './CompaniesManager.css'

const UploadIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
  </svg>
)
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
const FileIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
  </svg>
)

const EMPTY_FORM = { name: '', industry: '', location: '', size: '', website: '', description: '', remoteFriendly: false }

function Toast({ msg, type, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 4000)
    return () => clearTimeout(t)
  }, [onClose])
  return (
    <div className={`cpm-toast cpm-toast--${type}`}>
      <span>{msg}</span>
      <button onClick={onClose}>✕</button>
    </div>
  )
}

function ConfirmModal({ company, onConfirm, onCancel }) {
  return (
    <div className="cpm-overlay">
      <div className="cpm-modal">
        <p className="cpm-modal-title">Delete this company?</p>
        <p className="cpm-modal-sub"><strong>{company.name}</strong> will be removed from the directory immediately. This cannot be undone.</p>
        <div className="cpm-modal-actions">
          <button type="button" className="cpm-btn cpm-btn-ghost" onClick={onCancel}>Cancel</button>
          <button type="button" className="cpm-btn cpm-btn-danger" onClick={onConfirm}>Delete</button>
        </div>
      </div>
    </div>
  )
}

export default function CompaniesManager() {
  const [companies, setCompanies] = useState([])
  const [loading,   setLoading]   = useState(true)
  const [error,     setError]     = useState(null)
  const [toast,     setToast]     = useState(null)
  const [toDelete,  setToDelete]  = useState(null)

  const [form,      setForm]      = useState(EMPTY_FORM)
  const [editingId, setEditingId] = useState(null)
  const [logoFile,  setLogoFile]  = useState(null)
  const [logoPreview, setLogoPreview] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const logoInputRef = useRef(null)

  const [importFile, setImportFile] = useState(null)
  const [importIndustry, setImportIndustry] = useState('')
  const [importing,  setImporting]  = useState(false)
  const importInputRef = useRef(null)

  const showToast = (msg, type = 'success') => setToast({ msg, type })

  const load = useCallback(() => {
    setLoading(true)
    setError(null)
    fetchAdminCompanies()
      .then(setCompanies)
      .catch(() => setError('Failed to load companies.'))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => { load() }, [load])

  function handleLogoChange(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setLogoFile(file)
    setLogoPreview(URL.createObjectURL(file))
  }

  function resetForm() {
    setForm(EMPTY_FORM)
    setEditingId(null)
    setLogoFile(null)
    setLogoPreview(null)
    if (logoInputRef.current) logoInputRef.current.value = ''
  }

  function startEdit(company) {
    setEditingId(company._id)
    setForm({
      name: company.name || '',
      industry: company.industry || '',
      location: company.location || '',
      size: company.size || '',
      website: company.website || '',
      description: company.description || '',
      remoteFriendly: !!company.remoteFriendly,
    })
    setLogoFile(null)
    setLogoPreview(company.logo || null)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.name.trim()) {
      showToast('Company name is required', 'error')
      return
    }
    setSubmitting(true)
    try {
      const fd = new FormData()
      Object.entries(form).forEach(([k, v]) => fd.append(k, v))
      if (logoFile) fd.append('logo', logoFile)

      if (editingId) {
        const updated = await updateCompany(editingId, fd)
        setCompanies(prev => prev.map(c => c._id === editingId ? updated : c))
        showToast('Company updated')
      } else {
        const created = await createCompany(fd)
        setCompanies(prev => [created, ...prev].sort((a, b) => a.name.localeCompare(b.name)))
        showToast('Company added')
      }
      resetForm()
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to save company', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  async function handleDelete() {
    if (!toDelete) return
    try {
      await deleteCompany(toDelete._id)
      setCompanies(prev => prev.filter(c => c._id !== toDelete._id))
      showToast('Company deleted')
      if (editingId === toDelete._id) resetForm()
    } catch {
      showToast('Failed to delete company', 'error')
    } finally {
      setToDelete(null)
    }
  }

  async function handleImport() {
    if (!importFile) return
    setImporting(true)
    try {
      const summary = await importCompanies(importFile, importIndustry.trim())
      const parts = [`${summary.inserted} added`]
      if (summary.skipped) parts.push(`${summary.skipped} already existed (skipped)`)
      if (summary.errors?.length) parts.push(`${summary.errors.length} row${summary.errors.length === 1 ? '' : 's'} failed`)
      showToast(parts.join(' · '), summary.inserted > 0 ? 'success' : 'error')
      setImportFile(null)
      setImportIndustry('')
      if (importInputRef.current) importInputRef.current.value = ''
      load()
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to import file', 'error')
    } finally {
      setImporting(false)
    }
  }

  return (
    <div className="cpm-root">
      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
      {toDelete && <ConfirmModal company={toDelete} onConfirm={handleDelete} onCancel={() => setToDelete(null)} />}

      <div className="cpm-header">
        <h1 className="cpm-title">Companies</h1>
        <p className="cpm-sub">Manage the public company directory — add one at a time, or bulk-import from a CSV/Excel file. Open-role counts update automatically from live job data.</p>
      </div>

      <div className="cpm-layout">
        <div className="cpm-left">
          {/* ── Bulk import ── */}
          <div className="cpm-import-card">
            <h2 className="cpm-card-title">Bulk import</h2>
            <p className="cpm-import-hint">CSV or Excel file with a "name" column (industry, location, size, description, website, remote are optional). Companies that already exist (by name) are skipped — nothing is duplicated.</p>
            <label className="cpm-import-drop" htmlFor="cpm-import-input">
              <FileIcon />
              <span>{importFile ? importFile.name : 'Choose a .csv or .xlsx file'}</span>
            </label>
            <input
              id="cpm-import-input"
              ref={importInputRef}
              type="file"
              accept=".csv,.xlsx,.xls"
              onChange={e => setImportFile(e.target.files?.[0] || null)}
              hidden
            />
            <input
              className="cpm-input cpm-import-industry"
              value={importIndustry}
              onChange={e => setImportIndustry(e.target.value)}
              placeholder="Default industry for this file (optional), e.g. IT"
            />
            <button type="button" className="cpm-btn cpm-btn-primary" disabled={!importFile || importing} onClick={handleImport}>
              {importing ? <><span className="cpm-spin" /> Importing…</> : 'Import companies'}
            </button>
          </div>

          {/* ── Create / edit form ── */}
          <form className="cpm-form-card" onSubmit={handleSubmit}>
            <h2 className="cpm-card-title">{editingId ? 'Edit company' : 'Add company'}</h2>

            <label className="cpm-dropzone" htmlFor="cpm-logo-input">
              {logoPreview ? (
                <img src={logoPreview} alt="Logo preview" className="cpm-dropzone-preview" />
              ) : (
                <div className="cpm-dropzone-empty">
                  <UploadIcon />
                  <span>Click to upload logo</span>
                  <span className="cpm-dropzone-hint">JPG, PNG or WEBP · up to 5MB · optional</span>
                </div>
              )}
            </label>
            <input
              id="cpm-logo-input"
              ref={logoInputRef}
              type="file"
              accept="image/png, image/jpeg, image/webp"
              onChange={handleLogoChange}
              hidden
            />

            <div className="cpm-field">
              <label className="cpm-label">Company name *</label>
              <input className="cpm-input" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Stripe" />
            </div>

            <div className="cpm-field-row">
              <div className="cpm-field">
                <label className="cpm-label">Industry</label>
                <input className="cpm-input" value={form.industry} onChange={e => setForm(f => ({ ...f, industry: e.target.value }))} placeholder="e.g. Tech" />
              </div>
              <div className="cpm-field">
                <label className="cpm-label">Location</label>
                <input className="cpm-input" value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} placeholder="City, Country" />
              </div>
            </div>

            <div className="cpm-field-row">
              <div className="cpm-field">
                <label className="cpm-label">Size <span className="cpm-optional">optional</span></label>
                <input className="cpm-input" value={form.size} onChange={e => setForm(f => ({ ...f, size: e.target.value }))} placeholder="e.g. 500-1000" />
              </div>
              <div className="cpm-field">
                <label className="cpm-label">Website</label>
                <input className="cpm-input" value={form.website} onChange={e => setForm(f => ({ ...f, website: e.target.value }))} placeholder="https://…" type="url" />
              </div>
            </div>

            <div className="cpm-field">
              <label className="cpm-label">Description <span className="cpm-optional">optional</span></label>
              <textarea className="cpm-textarea" rows={3} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Short description shown on the company card…" maxLength={400} />
            </div>

            <label className="cpm-checkbox">
              <input type="checkbox" checked={form.remoteFriendly} onChange={e => setForm(f => ({ ...f, remoteFriendly: e.target.checked }))} />
              Remote-friendly
            </label>

            <div className="cpm-form-actions">
              <button type="submit" className="cpm-btn cpm-btn-primary" disabled={submitting}>
                {submitting ? <><span className="cpm-spin" /> Saving…</> : editingId ? 'Update company' : 'Add company'}
              </button>
              {editingId && (
                <button type="button" className="cpm-btn cpm-btn-ghost" onClick={resetForm}>Cancel edit</button>
              )}
            </div>
          </form>
        </div>

        {/* ── Existing companies ── */}
        <div className="cpm-list-card">
          <h2 className="cpm-card-title">All companies <span className="cpm-count">{companies.length}</span></h2>

          {error ? (
            <div className="cpm-empty">{error}</div>
          ) : loading ? (
            <div className="cpm-empty">Loading…</div>
          ) : companies.length === 0 ? (
            <div className="cpm-empty">No companies yet — add one or bulk-import a file.</div>
          ) : (
            <div className="cpm-company-list">
              {companies.map(company => (
                <div key={company._id} className="cpm-company-row">
                  <div className="cpm-company-thumb">
                    {company.logo ? <img src={company.logo} alt={company.name} /> : <div className="cpm-company-thumb-empty">{company.name?.[0]?.toUpperCase() || '?'}</div>}
                  </div>
                  <div className="cpm-company-info">
                    <p className="cpm-company-name">{company.name}</p>
                    <p className="cpm-company-meta">
                      {[company.industry, company.location].filter(Boolean).join(' · ') || '—'}
                      {' · '}{company.openRoles} open role{company.openRoles === 1 ? '' : 's'}
                    </p>
                  </div>
                  <div className="cpm-company-actions">
                    <button type="button" className="cpm-icon-btn" onClick={() => startEdit(company)} title="Edit company">
                      <EditIcon />
                    </button>
                    <button type="button" className="cpm-icon-btn cpm-icon-btn-danger" onClick={() => setToDelete(company)} title="Delete company">
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
