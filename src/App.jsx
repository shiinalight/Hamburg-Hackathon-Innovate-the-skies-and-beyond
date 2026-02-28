import React, { useEffect, useMemo, useState } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import TopNav from './components/TopNav.jsx'
import Home from './pages/Home.jsx'
import Setup from './pages/Setup.jsx'
import Shuttles from './pages/Shuttles.jsx'
import Manage from './pages/Manage.jsx'
import Messages from './pages/Messages.jsx'
import Profile from './pages/Profile.jsx'
import { getUser, initDatabase } from './lib/storage.js'

export default function App() {
  const location = useLocation()
  const [user, setUser] = useState(null)

  useEffect(() => {
    initDatabase()
    setUser(getUser())

    const onStorage = e => {
      if (e.key === 'matchy_user_v1') setUser(getUser())
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  // Hide logo in top-nav on some pages (mirrors original)
  const hideLogo = useMemo(() => {
    return location.pathname.startsWith('/shuttles') || location.pathname.startsWith('/manage')
  }, [location.pathname])

  return (
    <div className="app-container">
      <TopNav user={user} hideLogo={hideLogo} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/setup" element={<Setup onUserChanged={() => setUser(getUser())} />} />
        <Route path="/shuttles" element={<Shuttles onUserChanged={() => setUser(getUser())} />} />
        <Route path="/manage" element={<Manage onUserChanged={() => setUser(getUser())} />} />
        <Route path="/manage/:id" element={<Manage onUserChanged={() => setUser(getUser())} />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="/profile" element={<Profile user={user} />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  )
}
