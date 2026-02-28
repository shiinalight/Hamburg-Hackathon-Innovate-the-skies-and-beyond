import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { SEARCH_PREFS_KEY, createShuttle, getShuttles, updateShuttle, earnPoints } from '../lib/storage.js'

export default function Setup({ onUserChanged }) {
  const nav = useNavigate()
  const [params] = useSearchParams()
  const editId = params.get('editId')

  const [form, setForm] = useState({
    dest: 'Alexanderplatz',
    flight: '',
    lang: 'English',
    transport: 'Taxi',
    age: '25-35',
    capacity: '4'
  })

  const isEdit = useMemo(() => Boolean(editId), [editId])

  useEffect(() => {
    if (!isEdit) return
    const s = getShuttles().find(x => String(x.id) === String(editId))
    if (!s) return
    setForm({
      dest: s.dest || 'Alexanderplatz',
      flight: s.flight || '',
      lang: s.lang || 'English',
      transport: s.transport || 'Taxi',
      age: s.agePref || '25-35',
      capacity: String(s.capacity || 4)
    })
  }, [isEdit, editId])

  function setField(key, value) {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  function handleFindShuttles() {
    localStorage.setItem(SEARCH_PREFS_KEY, JSON.stringify(form))
    nav('/shuttles')
  }

  function handleUpdate() {
    const next = updateShuttle(editId, {
      dest: form.dest,
      flight: form.flight,
      transport: form.transport,
      capacity: Number(form.capacity),
      lang: form.lang,
      agePref: form.age
    })
    if (next) {
      window.alert('Shuttle updated successfully! ✅')
      nav(`/manage/${next.id}`)
    }
  }

  // Extra convenience: allow creating a shuttle directly from setup (like original flow on shuttles page)
  function handleCreateNow() {
    const shuttle = createShuttle({
      dest: form.dest,
      flight: form.flight,
      capacity: form.capacity,
      lang: form.lang,
      transport: form.transport,
      agePref: form.age
    })

    earnPoints(20, 'driver')
    onUserChanged?.()
    window.alert(`Shuttle created for ${shuttle.dest}! +20 Points Earned 🚀`)
    nav(`/manage/${shuttle.id}`)
  }

  return (
    <div id="screen-setup" className="screen active">
      <header className="app-header">
        <button className="icon-btn" onClick={() => nav('/')}> <i className="fa-solid fa-arrow-left" /> </button>
        <div className="progress-container">
          <div className="progress-text">New Trip Setup <span className="progress-percent">50%</span></div>
          <div className="progress-bar"><div className="progress-fill" style={{ width: '50%' }} /></div>
        </div>
      </header>

      <div className="scroll-content" style={{ maxHeight: 'calc(100vh - 120px)', overflow: 'hidden' }}>
        <div className="form-section">
          <p className="section-label">Where to?</p>
          <h2 className="section-title">Destination &amp; Flight</h2>
          <div className="compact-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <div className="input-group">
              <i className="fa-solid fa-location-dot search-icon" />
              <input
                type="text"
                placeholder="Alexanderplatz"
                value={form.dest}
                onChange={e => setField('dest', e.target.value)}
              />
            </div>
            <div className="input-group">
              <i className="fa-solid fa-plane-arrival search-icon" />
              <input
                type="text"
                placeholder="LH2024"
                value={form.flight}
                onChange={e => setField('flight', e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <p className="section-label">Preferences</p>
          <h2 className="section-title">Matching Details</h2>
          <div className="pref-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            <div className="select-group">
              <label className="field-label">Language</label>
              <select value={form.lang} onChange={e => setField('lang', e.target.value)}>
                <option>English</option>
                <option>German</option>
                <option>Spanish</option>
              </select>
              <i className="fa-solid fa-chevron-down select-icon" />
            </div>
            <div className="select-group">
              <label className="field-label">Transport</label>
              <select value={form.transport} onChange={e => setField('transport', e.target.value)}>
                <option>Taxi</option>
                <option>Ride-share</option>
                <option>Public Transit</option>
              </select>
              <i className="fa-solid fa-chevron-down select-icon" />
            </div>
            <div className="select-group">
              <label className="field-label">Age</label>
              <select value={form.age} onChange={e => setField('age', e.target.value)}>
                <option>No Pref</option>
                <option>18-24</option>
                <option>25-35</option>
                <option>35+</option>
              </select>
              <i className="fa-solid fa-chevron-down select-icon" />
            </div>
            <div className="select-group">
              <label className="field-label">Capacity</label>
              <select value={form.capacity} onChange={e => setField('capacity', e.target.value)}>
                <option value="4">4 People</option>
                <option value="6">6 People</option>
              </select>
              <i className="fa-solid fa-chevron-down select-icon" />
            </div>
          </div>
        </div>

        <div className="form-section" style={{ paddingBottom: 5 }}>
          <p className="section-label">Your Role</p>
          <div className="role-grid" style={{ gap: 8 }}>
            <div className="role-card active" style={{ padding: 10 }}>
              <i className="fa-solid fa-shuttle-van" style={{ fontSize: 16 }} />
              <h3 style={{ fontSize: 13 }}>Joiner</h3>
            </div>
            <div className="role-card" style={{ padding: 10 }}>
              <i className="fa-solid fa-map-location-dot" style={{ fontSize: 16 }} />
              <h3 style={{ fontSize: 13 }}>Host</h3>
            </div>
          </div>
        </div>

        <div className="action-footer" style={{ padding: 10 }}>
          {!isEdit ? (
            <>
              <button className="btn btn-primary btn-large" onClick={handleFindShuttles}>Find Matching Shuttles</button>
              <button className="btn btn-secondary btn-large" style={{ marginTop: 10 }} onClick={handleCreateNow}>
                Create My Shuttle Now
              </button>
              <p style={{ textAlign: 'center', fontSize: 10, color: 'var(--text-muted)', marginTop: 5 }}>
                We&apos;ll match you with the best travel companions.
              </p>
            </>
          ) : (
            <>
              <button className="btn btn-primary btn-large" onClick={handleUpdate}>Update Shuttle Details</button>
              <p style={{ textAlign: 'center', fontSize: 10, color: 'var(--text-muted)', marginTop: 5 }}>
                Updates are saved locally for this demo.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
