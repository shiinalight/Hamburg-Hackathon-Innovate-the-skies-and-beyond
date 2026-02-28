import React from 'react'
import { useNavigate } from 'react-router-dom'
import logoUrl from '../assets/logo.svg'

export default function Home() {
  const nav = useNavigate()

  return (
    <div id="screen-home" className="screen active">
      <div className="hero-section">
        <h1 className="hero-title">Hop on.<br />Roll together.</h1>
        <div className="hero-image-container" style={{ background: 'none', padding: 0 }}>
          <img
            src={logoUrl}
            alt="Matchy Logo"
            style={{ width: '100%', maxWidth: 160, height: 'auto', display: 'block', margin: '0 auto' }}
          />
        </div>
      </div>

      <div className="features-section">
        <h2>Why Shuttle?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon"><i className="fa-solid fa-hand-holding-dollar" /></div>
            <h3>Save Money</h3>
            <p>Split fares up to 50%</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon"><i className="fa-solid fa-leaf" /></div>
            <h3>Reduce Footprint</h3>
            <p>Fewer cars, cleaner air</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon"><i className="fa-solid fa-users" /></div>
            <h3>Meet People</h3>
            <p>Make new connections</p>
          </div>
        </div>
      </div>

      <div className="action-footer">
        <button className="btn btn-primary btn-large" onClick={() => nav('/setup')}>
          Create Shuttle Request <i className="fa-solid fa-chevron-right" />
        </button>
      </div>
    </div>
  )
}
