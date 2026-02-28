// Matchy - LLM, Database, & Gamification Logic

const GEMINI_API_KEY = 'AIzaSyBDetsR1rDEq3J2S1Wyo9pNabcjKWqSQp8';
const DB_KEY = 'matchy_shuttles_v1';
const USER_KEY = 'matchy_user_v1';

let currentShuttleId = null;

// Seed Mock Data if Database is empty
function initDatabase() {
    const existingShuttles = localStorage.getItem(DB_KEY);
    if (!existingShuttles) {
        const mockShuttles = [
            { id: 1, host: "Sophie R.", title: "Sophie's Shuttle", capacity: 4, occupied: 3, dest: "Alexanderplatz", time: "15:45", lang: "English", transport: "Taxi", badge: "Standard Host", avatar: "https://randomuser.me/api/portraits/women/44.jpg" },
            { id: 2, host: "Liam K.", title: "Liam's XL Shuttle", capacity: 6, occupied: 2, dest: "Potsdamer Platz", time: "16:00", lang: "English", transport: "Ride-share", badge: "Pro Host", avatar: "https://randomuser.me/api/portraits/men/32.jpg" },
            { id: 3, host: "Aisha B.", title: "Aisha's Green Shuttle", capacity: 4, occupied: 1, dest: "Alexanderplatz", time: "15:30", lang: "German", transport: "Public Transit", badge: "Eco-Friendly", avatar: "https://randomuser.me/api/portraits/women/68.jpg" },
            { id: 4, host: "Mark J.", title: "Mark's Relaxed Ride", capacity: 4, occupied: 2, dest: "Alexanderplatz", time: "16:30", lang: "English", transport: "Taxi", badge: "Friendly", avatar: "https://randomuser.me/api/portraits/men/12.jpg" },
            { id: 5, host: "Elena S.", title: "Elena's Airport Express", capacity: 4, occupied: 3, dest: "Potsdamer Platz", time: "15:15", lang: "Spanish", transport: "Ride-share", badge: "Verified", avatar: "https://randomuser.me/api/portraits/women/33.jpg" }
        ];
        localStorage.setItem(DB_KEY, JSON.stringify(mockShuttles));
    }

    const existingUser = localStorage.getItem(USER_KEY);
    if (!existingUser) {
        const userData = {
            points: 150,
            rides: 14,
            co2: 120,
            badges: ['seedling']
        };
        localStorage.setItem(USER_KEY, JSON.stringify(userData));
    }
    updateUserUI();
}

// Update User Stats & Badges in UI
function updateUserUI() {
    const userData = localStorage.getItem(USER_KEY);
    if (!userData) return;
    const user = JSON.parse(userData);

    // Nav points
    const pointsSpan = document.querySelector('#user-points span');
    if (pointsSpan) pointsSpan.innerText = `${user.points} pts`;

    // Profile stats
    const rideStat = document.getElementById('stat-rides');
    const co2Stat = document.getElementById('stat-co2');
    if (rideStat) rideStat.innerText = user.rides;
    if (co2Stat) co2Stat.innerText = `${user.co2}kg`;

    // Badges grid
    const badgeGrid = document.getElementById('user-badges');
    if (badgeGrid) {
        const badgeDefinitions = [
            { id: 'seedling', name: 'Seedling', icon: 'fa-seedling' },
            { id: 'driver', name: 'Shuttle Cap', icon: 'fa-shuttle-van' },
            { id: 'sky', name: 'Sky Captain', icon: 'fa-plane' },
            { id: 'eco', name: 'Eco Warrior', icon: 'fa-leaf' },
            { id: 'pro', name: 'Pro Joiner', icon: 'fa-users' }
        ];

        badgeGrid.innerHTML = badgeDefinitions.map(b => {
            const isActive = user.badges.includes(b.id);
            return `
                <div class="badge-item ${isActive ? 'active' : 'locked'}">
                    <i class="fa-solid ${b.icon}"></i>
                    <span>${b.name}</span>
                </div>
            `;
        }).join('');
    }
}

// Earn points function
function earnPoints(amount, badgeId = null) {
    const userData = localStorage.getItem(USER_KEY);
    if (!userData) return;
    const user = JSON.parse(userData);

    user.points += amount;
    if (badgeId && !user.badges.includes(badgeId)) {
        user.badges.push(badgeId);
        showBadgeUnlock(badgeId);
    }
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    updateUserUI();
}

function showBadgeUnlock(id) {
    alert(`🏆 New Badge Unlocked: ${id.toUpperCase()}!`);
}

// Navigation Function
function navigateTo(screenId, params = null) {
    const screens = document.querySelectorAll('.screen');
    screens.forEach(screen => screen.classList.remove('active'));

    const targetScreen = document.getElementById(screenId);
    if (targetScreen) targetScreen.classList.add('active');

    // Update nav active state
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('onclick').includes(screenId)) {
            item.classList.add('active');
        }
    });

    // Control top-nav logo visibility
    const logo = document.querySelector('.top-nav .logo');
    if (logo) {
        if (screenId === 'screen-shuttles') {
            logo.style.visibility = 'hidden';
        } else {
            logo.style.visibility = 'visible';
        }
    }

    // Special handling for management screen (Redirecting)
    if (screenId === 'screen-manage-shuttle') {
        window.location.href = 'manage.html' + (params && params.id ? '?id=' + params.id : '');
        return;
    }

    // If entering Shuttles and it's empty, show all available
    if (screenId === 'screen-shuttles') {
        const list = document.getElementById('llm-shuttle-list');
        if (list && (list.innerHTML.includes('Waiting') || list.innerHTML.trim() === '')) {
            const all = JSON.parse(localStorage.getItem(DB_KEY) || '[]');
            renderShuttles(all.slice(0, 5));
        }
    }

    window.scrollTo(0, 0);
}

// Render the Manage Shuttle screen
function renderManageShuttle(id) {
    const allShuttles = JSON.parse(localStorage.getItem(DB_KEY) || '[]');
    const shuttle = allShuttles.find(s => s.id == id);
    if (!shuttle) return;

    currentShuttleId = id;

    document.getElementById('manage-title').innerText = shuttle.title;
    document.getElementById('manage-dest').innerHTML = `<i class="fa-solid fa-location-dot"></i> ${shuttle.dest}`;
    document.getElementById('manage-flight-val').innerText = shuttle.flight || 'None';
    document.getElementById('manage-transport-val').innerText = shuttle.transport;
    document.getElementById('manage-lang-val').innerText = shuttle.lang || 'English';
    document.getElementById('manage-pref-val').innerText = shuttle.agePref || 'None';
    document.getElementById('manage-count').innerText = shuttle.occupied;
    document.getElementById('manage-cap').innerText = shuttle.capacity;

    // Simulate "other" members if it's not a brand new one
    const membersList = document.getElementById('manage-members-list');
    membersList.innerHTML = `
        <div class="message-item">
            <img src="${shuttle.avatar || 'https://via.placeholder.com/50'}" class="avatar">
            <div class="message-info">
                <h4>${shuttle.host === 'You' ? 'You' : shuttle.host} (Host)</h4>
                <p>Status: Ready to roll</p>
            </div>
        </div>
    `;

    if (shuttle.occupied > 1) {
        const mockMembers = [
            { name: "John D.", avatar: "https://randomuser.me/api/portraits/men/32.jpg" },
            { name: "Sarah W.", avatar: "https://randomuser.me/api/portraits/women/44.jpg" }
        ];
        for (let i = 0; i < shuttle.occupied - 1; i++) {
            const m = mockMembers[i % mockMembers.length];
            membersList.innerHTML += `
                <div class="message-item">
                    <img src="${m.avatar}" class="avatar">
                    <div class="message-info">
                        <h4>${m.name}</h4>
                        <p>Joined just now</p>
                    </div>
                </div>
            `;
        }
    }
}

function editCurrentShuttle() {
    const allShuttles = JSON.parse(localStorage.getItem(DB_KEY) || '[]');
    const shuttle = allShuttles.find(s => s.id == currentShuttleId);
    if (!shuttle) return;

    // Fill setup form with current values
    document.getElementById('input-destination').value = shuttle.dest;
    document.getElementById('input-flight').value = shuttle.flight || '';
    document.getElementById('select-transport').value = shuttle.transport;
    document.getElementById('select-capacity').value = shuttle.capacity;

    navigateTo('screen-setup');
    // Change button text to "Update"
    const setupBtn = document.querySelector('#screen-setup .btn-primary');
    setupBtn.innerText = "Update Shuttle Details";
    setupBtn.onclick = saveShuttleEdit;
}

function saveShuttleEdit() {
    const allShuttles = JSON.parse(localStorage.getItem(DB_KEY) || '[]');
    const idx = allShuttles.findIndex(s => s.id == currentShuttleId);
    if (idx === -1) return;

    allShuttles[idx].dest = document.getElementById('input-destination').value;
    allShuttles[idx].flight = document.getElementById('input-flight').value;
    allShuttles[idx].transport = document.getElementById('select-transport').value;
    allShuttles[idx].capacity = parseInt(document.getElementById('select-capacity').value);
    allShuttles[idx].lang = document.getElementById('select-language').value;
    allShuttles[idx].agePref = document.getElementById('select-age').value;

    if (allShuttles[idx].flight) {
        allShuttles[idx].title = `Flight ${allShuttles[idx].flight} Shuttle`;
    }

    localStorage.setItem(DB_KEY, JSON.stringify(allShuttles));
    alert("Shuttle updated successfully! ✅");

    // Restore original setup button
    const setupBtn = document.querySelector('#screen-setup .btn-primary');
    setupBtn.innerText = "Create Shuttle Request";
    setupBtn.onclick = handleCreateShuttle;

    navigateTo('screen-manage-shuttle', { id: currentShuttleId });
}

// Handle "Find Similar Shuttles"
async function handleFindShuttles() {
    const listContainer = document.getElementById('llm-shuttle-list');
    listContainer.innerHTML = `<div style="padding: 40px; text-align: center;"><i class="fa-solid fa-circle-notch fa-spin" style="font-size: 32px; color: var(--primary-color);"></i><p style="margin-top: 15px;">AI is matching you with the best shuttles...</p></div>`;

    navigateTo('screen-shuttles');

    const prefs = {
        dest: document.getElementById('input-destination').value,
        flight: document.getElementById('input-flight').value,
        lang: document.getElementById('select-language').value,
        transport: document.getElementById('select-transport').value,
        age: document.getElementById('select-age').value,
        capacity: document.getElementById('select-capacity').value
    };

    const allShuttles = JSON.parse(localStorage.getItem(DB_KEY) || '[]');

    try {
        const matches = await callGeminiMatching(prefs, allShuttles);
        renderShuttles(matches);
        if (prefs.flight) earnPoints(5, 'sky');
    } catch (error) {
        console.error("Matching Error:", error);
        listContainer.innerHTML = `<div style="padding: 20px; text-align: center; color: var(--text-danger);"><i class="fa-solid fa-triangle-exclamation"></i><p>Oops! LLM matching failed. Using fallback.</p></div>`;
        renderShuttles(allShuttles.slice(0, 3).map(s => ({ ...s, similarity: "N/A" })));
    }
}

// Call Gemini API
async function callGeminiMatching(prefs, shuttles) {
    const prompt = `
    You are the matching engine for "Matchy", a shuttle-sharing app.
    Return TOP 3 most relevant shuttles as a JSON array of objects with {id, similarity, reason}.
    
    User Preferences:
    - Destination: ${prefs.dest}
    - Flight Number: ${prefs.flight || 'Not specified'}
    - Language: ${prefs.lang}
    - Transport: ${prefs.transport}
    - Seat Capacity Needed: ${prefs.capacity}

    Available Shuttles:
    ${JSON.stringify(shuttles)}

    CRITIERIA:
    1. Flight Number match is absolute highest priority.
    2. Destination match is high priority.
    3. MUST have space.
    `;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }]
        })
    });

    const data = await response.json();
    let textResult = data.candidates[0].content.parts[0].text;
    textResult = textResult.replace(/```json/g, '').replace(/```/g, '').trim();
    const rankedIds = JSON.parse(textResult);

    return rankedIds.map(match => {
        const fullInfo = shuttles.find(s => s.id === match.id);
        return { ...fullInfo, similarity: match.similarity, matchReason: match.reason };
    });
}

// Render Shuttles to UI
function renderShuttles(matches) {
    const listContainer = document.getElementById('llm-shuttle-list');
    listContainer.innerHTML = '';

    if (!matches || matches.length === 0) {
        listContainer.innerHTML = '<div style="padding: 20px; text-align: center;">No matches found. Try creating a new shuttle!</div>';
        return;
    }

    matches.forEach(shuttle => {
        const card = document.createElement('div');
        card.className = 'shuttle-card';
        card.innerHTML = `
            <div class="shuttle-header">
                <img src="${shuttle.avatar || 'https://via.placeholder.com/50'}" alt="${shuttle.host}" class="avatar">
                <div class="shuttle-info">
                    <h3>${shuttle.title}</h3>
                    <span class="verified-badge"><i class="fa-solid fa-circle-check"></i> ${shuttle.badge}</span>
                </div>
                <div class="rating">
                    <i class="fa-solid fa-star" style="color: #f4b400"></i> 4.9
                </div>
            </div>
            <div class="shuttle-details">
                <div class="detail-row"><i class="fa-solid fa-users"></i> ${shuttle.occupied}/${shuttle.capacity} Seats Occupied</div>
                <div class="detail-row"><i class="fa-solid fa-location-dot"></i> ${shuttle.dest} (${shuttle.time})</div>
                <div class="shuttle-score"><i class="fa-solid fa-shuttle-van"></i> ${shuttle.similarity || 'Match'}</div>
                <p style="font-size: 11px; color: var(--text-muted); margin-top: 8px;">"${shuttle.matchReason || 'Highly compatible ride'}"</p>
            </div>
            <div class="shuttle-actions">
                <button class="btn btn-secondary" onclick="handleJoinShuttle(${shuttle.id})">Request Join</button>
            </div>
        `;
        listContainer.appendChild(card);
    });
}

function handleJoinShuttle(id) {
    earnPoints(10, 'eco');
    alert("Request Sent! +10 Points Earned 🌿");
    navigateTo('screen-manage-shuttle', { id: id });
}

// Handle "Create New Shuttle"
function handleCreateShuttle() {
    const dest = document.getElementById('input-destination').value;
    const flight = document.getElementById('input-flight').value;
    const capacity = parseInt(document.getElementById('select-capacity').value);

    const allShuttles = JSON.parse(localStorage.getItem(DB_KEY) || '[]');
    const newId = allShuttles.length + 1;
    const newShuttle = {
        id: newId,
        host: "You",
        title: flight ? `Flight ${flight} Shuttle` : "Your New Shuttle",
        capacity: capacity || 4,
        occupied: 1,
        dest: dest || "Alexanderplatz",
        flight: flight,
        time: "Now",
        lang: document.getElementById('select-language').value,
        transport: document.getElementById('select-transport').value,
        agePref: document.getElementById('select-age').value,
        badge: "New Request",
        avatar: "https://randomuser.me/api/portraits/lego/1.jpg"
    };

    allShuttles.push(newShuttle);
    localStorage.setItem(DB_KEY, JSON.stringify(allShuttles));

    earnPoints(20, 'driver');
    alert(`Shuttle created for ${dest}! +20 Points Earned 🚀`);
    navigateTo('screen-manage-shuttle', { id: newId });
}

// Initialization on Load
document.addEventListener('DOMContentLoaded', () => {
    initDatabase();

    // Check for edit mode
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('edit') === 'true') {
        const editId = localStorage.getItem('matchy_edit_id');
        if (editId) {
            currentShuttleId = editId;
            const all = JSON.parse(localStorage.getItem(DB_KEY) || '[]');
            const s = all.find(x => x.id == editId);
            if (s) {
                // Pre-fill
                document.getElementById('input-destination').value = s.dest;
                document.getElementById('input-flight').value = s.flight || '';
                document.getElementById('select-transport').value = s.transport;
                document.getElementById('select-capacity').value = s.capacity;

                navigateTo('screen-setup');
                const setupBtn = document.querySelector('#screen-setup .btn-primary');
                setupBtn.innerText = "Update Shuttle Details";
                setupBtn.onclick = saveShuttleEdit;
                return;
            }
        }
    }

    navigateTo('screen-home');
});
