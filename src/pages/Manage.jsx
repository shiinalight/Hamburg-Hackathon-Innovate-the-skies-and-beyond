import React, { useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getShuttles } from '../lib/storage.js'

export default function Manage() {
  const nav = useNavigate()
  const { id } = useParams()

  const shuttle = useMemo(() => {
    const all = getShuttles()
    if (id) return all.find(s => String(s.id) === String(id)) || null
    return all.find(s => s.host === 'You') || all[0] || null
  }, [id])

  const members = useMemo(() => {
    if (!shuttle) return []
    const list = [{ name: shuttle.host === 'You' ? 'You' : shuttle.host, avatar: shuttle.avatar, role: 'Host' }]
    if (Number(shuttle.occupied) > 1) {
      const mockMembers = [
        { name: 'John D.', avatar: 'https://randomuser.me/api/portraits/men/32.jpg' },
        { name: 'Sarah W.', avatar: 'https://randomuser.me/api/portraits/women/44.jpg' }
      ]
      for (let i = 0; i < Number(shuttle.occupied) - 1; i++) {
        list.push({ ...mockMembers[i % mockMembers.length], role: 'Member' })
      }
    }
    return list
  }, [shuttle])

  if (!shuttle) {
    return (
      <div id="screen-manage-shuttle" className="screen active" style={{ display: 'flex', height: 'calc(100vh - 73px)' }}>
        <header className="app-header">
          <button className="icon-btn" onClick={() => nav('/')}><i className="fa-solid fa-arrow-left" /></button>
          <h2>Manage Your Shuttle</h2>
          <button className="icon-btn" disabled><i className="fa-solid fa-pen-to-square" /></button>
        </header>
        <div className="scroll-content" style={{ padding: 15, flexGrow: 1, overflowY: 'auto' }}>
          <p style={{ padding: 20, textAlign: 'center', color: 'var(--text-muted)' }}>
            You have no active rides. Create one on the Home page!
          </p>
        </div>
      </div>
    )
  }

  return (
    <div
      id="screen-manage-shuttle"
      className="screen active"
      style={{ display: 'flex', height: 'calc(100vh - 73px)' }}
    >
      <header className="app-header">
        <button className="icon-btn" onClick={() => nav('/')}><i className="fa-solid fa-arrow-left" /></button>
        <h2>Manage Your Shuttle</h2>
        <button className="icon-btn" onClick={() => nav(`/setup?editId=${shuttle.id}`)}><i className="fa-solid fa-pen-to-square" /></button>
      </header>

      <div className="scroll-content" style={{ padding: 15, flexGrow: 1, overflowY: 'auto' }}>
        <div
          className="shuttle-info-card"
          style={{
            background: 'white',
            padding: 15,
            borderRadius: 'var(--border-radius-sm)',
            boxShadow: 'var(--shadow-sm)',
            marginBottom: 15,
            border: '1px solid var(--border-color)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
            <div>
              <h3 style={{ fontSize: 18, color: 'var(--primary-color)' }}>{shuttle.title}</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>
                <i className="fa-solid fa-location-dot" /> {shuttle.dest}
              </p>
            </div>
            <div
              className="badge-item active"
              style={{
                padding: '5px 10px',
                fontSize: 10,
                background: 'var(--accent-color)',
                color: 'var(--primary-color)',
                fontWeight: 800,
                borderRadius: 10
              }}
            >
              HOST
            </div>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 8,
              fontSize: 13,
              color: 'var(--text-main)'
            }}
          >
            <span><i className="fa-solid fa-plane" /> Flight: <b>{shuttle.flight || 'None'}</b></span>
            <span><i className="fa-solid fa-car" /> <b>{shuttle.transport || 'Taxi'}</b></span>
            <span><i className="fa-solid fa-globe" /> <b>{shuttle.lang || 'English'}</b></span>
            <span><i className="fa-solid fa-user-group" /> <b>{shuttle.agePref || 'None'}</b></span>
          </div>
        </div>

        <div className="members-section">
          <h3 style={{ fontSize: 16, marginBottom: 12 }}>
            Shuttle Members ({shuttle.occupied}/{shuttle.capacity})
          </h3>

          <div className="members-list">
            {members.map((m, idx) => (
              <div className="message-item" key={`${m.name}-${idx}`}>
                <img src={m.avatar || 'https://via.placeholder.com/50'} className="avatar" alt={m.name} />
                <div className="message-info">
                  <h4>{m.name} {idx === 0 ? '(Host)' : ''}</h4>
                  <p>{idx === 0 ? 'Status: Ready to roll' : 'Joined just now'}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="action-footer" style={{ padding: '12px 20px', background: 'var(--bg-alt)', flexShrink: 0 }}>
        <button className="btn btn-secondary btn-large" onClick={() => nav('/')}>Go Back Home</button>
      </div>
    </div>
  )
}
