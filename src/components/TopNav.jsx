import React from 'react'
import { NavLink } from 'react-router-dom'

export default function TopNav({ user, hideLogo }) {
  return (
    <nav className="top-nav" id="main-nav">
      <div className="logo" style={{ visibility: hideLogo ? 'hidden' : 'visible' }}>
        <i className="fa-solid fa-shuttle-van" />
        <span>Matchy</span>
      </div>

      <div className="nav-links">
        <NavLink to="/" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>Home</NavLink>
        <NavLink to="/shuttles" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>Shuttles</NavLink>
        <NavLink to="/manage" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>My Ride</NavLink>
        <NavLink to="/messages" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
        >
          Messages <span className="badge">2</span>
        </NavLink>
        <NavLink to="/profile" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>Profile</NavLink>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div className="points-display" id="user-points">
          <i className="fa-solid fa-star" />
          <span>{user?.points ?? 150} pts</span>
        </div>
        <button className="icon-btn" aria-label="Notifications">
          <i className="fa-regular fa-bell" />
        </button>
      </div>
    </nav>
  )
}
