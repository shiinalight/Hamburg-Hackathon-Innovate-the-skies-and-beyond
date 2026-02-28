export const DB_KEY = 'matchy_shuttles_v1'
export const USER_KEY = 'matchy_user_v1'
export const SEARCH_PREFS_KEY = 'matchy_search_prefs'

export function initDatabase() {
  const existingShuttles = localStorage.getItem(DB_KEY)
  if (!existingShuttles) {
    const mockShuttles = [
      {
        id: 1,
        host: 'Sophie R.',
        title: "Sophie's Shuttle",
        capacity: 4,
        occupied: 3,
        dest: 'Alexanderplatz',
        time: '15:45',
        lang: 'English',
        transport: 'Taxi',
        badge: 'Standard Host',
        avatar: 'https://randomuser.me/api/portraits/women/44.jpg'
      },
      {
        id: 2,
        host: 'Liam K.',
        title: "Liam's XL Shuttle",
        capacity: 6,
        occupied: 2,
        dest: 'Potsdamer Platz',
        time: '16:00',
        lang: 'English',
        transport: 'Ride-share',
        badge: 'Pro Host',
        avatar: 'https://randomuser.me/api/portraits/men/32.jpg'
      },
      {
        id: 3,
        host: 'Aisha B.',
        title: "Aisha's Green Shuttle",
        capacity: 4,
        occupied: 1,
        dest: 'Alexanderplatz',
        time: '15:30',
        lang: 'German',
        transport: 'Public Transit',
        badge: 'Eco-Friendly',
        avatar: 'https://randomuser.me/api/portraits/women/68.jpg'
      },
      {
        id: 4,
        host: 'Mark J.',
        title: "Mark's Relaxed Ride",
        capacity: 4,
        occupied: 2,
        dest: 'Alexanderplatz',
        time: '16:30',
        lang: 'English',
        transport: 'Taxi',
        badge: 'Friendly',
        avatar: 'https://randomuser.me/api/portraits/men/12.jpg'
      },
      {
        id: 5,
        host: 'Elena S.',
        title: "Elena's Airport Express",
        capacity: 4,
        occupied: 3,
        dest: 'Potsdamer Platz',
        time: '15:15',
        lang: 'Spanish',
        transport: 'Ride-share',
        badge: 'Verified',
        avatar: 'https://randomuser.me/api/portraits/women/33.jpg'
      }
    ]
    localStorage.setItem(DB_KEY, JSON.stringify(mockShuttles))
  }

  const existingUser = localStorage.getItem(USER_KEY)
  if (!existingUser) {
    const userData = {
      points: 150,
      rides: 14,
      co2: 120,
      badges: ['seedling']
    }
    localStorage.setItem(USER_KEY, JSON.stringify(userData))
  }
}

export function getUser() {
  const raw = localStorage.getItem(USER_KEY)
  return raw ? JSON.parse(raw) : null
}

export function setUser(user) {
  localStorage.setItem(USER_KEY, JSON.stringify(user))
}

export function earnPoints(amount, badgeId = null) {
  const user = getUser()
  if (!user) return user
  user.points += amount
  if (badgeId && !user.badges.includes(badgeId)) user.badges.push(badgeId)
  setUser(user)
  return user
}

export function getShuttles() {
  const raw = localStorage.getItem(DB_KEY)
  return raw ? JSON.parse(raw) : []
}

export function setShuttles(shuttles) {
  localStorage.setItem(DB_KEY, JSON.stringify(shuttles))
}

export function createShuttle({ dest, flight, capacity, lang, transport, agePref }) {
  const all = getShuttles()
  const newId = all.length ? Math.max(...all.map(s => Number(s.id))) + 1 : 1
  const shuttle = {
    id: newId,
    host: 'You',
    title: flight ? `Flight ${flight} Shuttle` : 'Your New Shuttle',
    capacity: Number(capacity) || 4,
    occupied: 1,
    dest: dest || 'Alexanderplatz',
    flight: flight || '',
    time: 'Now',
    lang: lang || 'English',
    transport: transport || 'Taxi',
    agePref: agePref || '25-35',
    badge: 'New Request',
    avatar: 'https://randomuser.me/api/portraits/lego/1.jpg'
  }
  all.push(shuttle)
  setShuttles(all)
  return shuttle
}

export function updateShuttle(id, patch) {
  const all = getShuttles()
  const idx = all.findIndex(s => String(s.id) === String(id))
  if (idx === -1) return null
  const next = { ...all[idx], ...patch }
  if (next.flight) next.title = `Flight ${next.flight} Shuttle`
  all[idx] = next
  setShuttles(all)
  return next
}

export function simpleMatch(prefs, shuttles) {
  // Deterministic matching: flight match > dest match > has space > same transport/lang
  const p = {
    dest: (prefs?.dest || '').trim().toLowerCase(),
    flight: (prefs?.flight || '').trim().toLowerCase(),
    lang: prefs?.lang || 'English',
    transport: prefs?.transport || 'Taxi',
    capacity: Number(prefs?.capacity || 4)
  }

  const scored = shuttles
    .filter(s => (Number(s.capacity) - Number(s.occupied)) > 0)
    .map(s => {
      let score = 0
      let reasons = []
      const flight = (s.flight || '').trim().toLowerCase()
      const dest = (s.dest || '').trim().toLowerCase()

      if (p.flight && flight && p.flight === flight) {
        score += 100
        reasons.push('Same flight number')
      }
      if (p.dest && dest && p.dest === dest) {
        score += 40
        reasons.push('Same destination')
      }
      if (s.transport === p.transport) {
        score += 10
        reasons.push('Same transport')
      }
      if (s.lang === p.lang) {
        score += 6
        reasons.push('Same language')
      }
      if (Number(s.capacity) >= p.capacity) {
        score += 4
        reasons.push('Capacity fits')
      }

      const similarity = score >= 100 ? 'Perfect' : score >= 45 ? 'Great' : score >= 20 ? 'Good' : 'Match'
      const matchReason = reasons.length ? reasons.slice(0, 2).join(' • ') : 'Highly compatible ride'
      return { ...s, similarity, matchReason, _score: score }
    })
    .sort((a, b) => b._score - a._score)

  return scored
}
