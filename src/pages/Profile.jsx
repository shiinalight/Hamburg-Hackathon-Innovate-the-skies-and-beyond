import React, { useMemo } from 'react'

export default function Profile({ user }) {
  const badges = useMemo(() => {
    const defs = [
      { id: 'seedling', name: 'Seedling', icon: 'fa-seedling' },
      { id: 'driver', name: 'Shuttle Cap', icon: 'fa-shuttle-van' },
      { id: 'sky', name: 'Sky Captain', icon: 'fa-plane' },
      { id: 'eco', name: 'Eco Warrior', icon: 'fa-leaf' },
      { id: 'pro', name: 'Pro Joiner', icon: 'fa-users' }
    ]
    return defs.map(d => ({ ...d, active: Boolean(user?.badges?.includes(d.id)) }))
  }, [user])

  return (
    <div id="screen-profile" className="screen active">
      <header className="app-header">
        <h2>Profile</h2>
      </header>
      <div className="scroll-content">
        <div className="profile-header text-center">
          <img src="https://randomuser.me/api/portraits/women/40.jpg" alt="My Profile" className="avatar-large" />
          <h2>Sarah M.</h2>
          <p className="text-muted">Explorer 🌍 | Member since 2024</p>
        </div>

        <div className="profile-stats">
          <div className="stat">
            <h3 id="stat-rides">{user?.rides ?? 14}</h3>
            <p>Rides Shared</p>
          </div>
          <div className="stat">
            <h3 id="stat-co2">{user?.co2 ?? 120}kg</h3>
            <p>CO2 Saved</p>
          </div>
          <div className="stat">
            <h3>4.9</h3>
            <p>Rating</p>
          </div>
        </div>

        <div className="badges-section">
          <h3>My Badges</h3>
          <div className="badges-grid" id="user-badges">
            {badges.map(b => (
              <div key={b.id} className={`badge-item ${b.active ? 'active' : 'locked'}`}>
                <i className={`fa-solid ${b.icon}`} />
                <span>{b.name}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="profile-menu">
          <button className="menu-item"><i className="fa-solid fa-user-pen" /> Edit Profile</button>
          <button className="menu-item"><i className="fa-solid fa-gear" /> Settings</button>
          <button className="menu-item"><i className="fa-solid fa-circle-question" /> Help &amp; Support</button>
          <button className="menu-item text-danger" onClick={() => window.location.reload()}>
            <i className="fa-solid fa-arrow-right-from-bracket" /> Reset
          </button>
        </div>
      </div>
    </div>
  )
}
