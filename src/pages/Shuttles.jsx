import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { SEARCH_PREFS_KEY, earnPoints, getShuttles, simpleMatch } from '../lib/storage.js'

export default function Shuttles({ onUserChanged }) {
  const nav = useNavigate()
  const [loading, setLoading] = useState(true)
  const [matches, setMatches] = useState([])

  const prefs = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem(SEARCH_PREFS_KEY) || 'null')
    } catch {
      return null
    }
  }, [])

  useEffect(() => {
    const all = getShuttles()
    // Simulate "AI matching" delay (keeps UI faithful)
    const t = setTimeout(() => {
      const ranked = simpleMatch(prefs, all)
      setMatches(ranked)
      setLoading(false)
    }, 650)
    return () => clearTimeout(t)
  }, [prefs])

  function handleJoin(id) {
    earnPoints(10, 'eco')
    onUserChanged?.()
    window.alert('Request Sent! +10 Points Earned 🌿')
    nav(`/manage/${id}`)
  }

  function handleCreate() {
    nav('/setup')
  }

  return (
    <div id="screen-shuttles" className="screen shuttles-screen active">
      <header className="shuttles-header">
        <div className="header-top">
          <button className="icon-btn dark" onClick={() => nav('/')}><i className="fa-solid fa-arrow-left" /></button>
        </div>
        <h2>
          Similar Shuttles{' '}
          <span className="found-text">
            {!loading ? `(${matches.length} found)` : ''}
          </span>
        </h2>
      </header>

      <div className="shuttles-list" style={{ flexGrow: 1, overflowY: 'auto' }}>
        {loading ? (
          <div style={{ padding: 40, textAlign: 'center' }}>
            <i className="fa-solid fa-circle-notch fa-spin" style={{ fontSize: 32, color: 'var(--primary-color)' }} />
            <p style={{ marginTop: 15 }}>AI is matching you with the best shuttles...</p>
          </div>
        ) : matches.length === 0 ? (
          <div style={{ padding: 20, textAlign: 'center' }}>
            No matches found. Try creating a new shuttle!
          </div>
        ) : (
          matches.map(shuttle => (
            <div className="shuttle-card" key={shuttle.id}>
              <div className="shuttle-header">
                <img src={shuttle.avatar || 'https://via.placeholder.com/50'} alt={shuttle.host} className="avatar" />
                <div className="shuttle-info">
                  <h3>{shuttle.title}</h3>
                  <span className="verified-badge"><i className="fa-solid fa-circle-check" /> {shuttle.badge}</span>
                </div>
                <div className="rating">
                  <i className="fa-solid fa-star" style={{ color: '#f4b400' }} /> 4.9
                </div>
              </div>
              <div className="shuttle-details">
                <div className="detail-row"><i className="fa-solid fa-users" /> {shuttle.occupied}/{shuttle.capacity} Seats Occupied</div>
                <div className="detail-row"><i className="fa-solid fa-location-dot" /> {shuttle.dest} ({shuttle.time})</div>
                <div className="shuttle-score"><i className="fa-solid fa-shuttle-van" /> {shuttle.similarity || 'Match'}</div>
                <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 8 }}>
                  “{shuttle.matchReason || 'Highly compatible ride'}”
                </p>
              </div>
              <div className="shuttle-actions">
                <button className="btn btn-secondary" onClick={() => handleJoin(shuttle.id)}>Request Join</button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="action-footer" style={{ padding: 20, background: 'var(--bg-alt)' }}>
        <p style={{ textAlign: 'center', marginBottom: 10, color: 'var(--text-muted)', fontSize: 13 }}>
          Don&apos;t see a perfect fit?
        </p>
        <button className="btn btn-primary btn-large" onClick={handleCreate}>Create My Own Shuttle Request</button>
      </div>
    </div>
  )
}
