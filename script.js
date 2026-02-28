// Navigation Function
function navigateTo(screenId) {
    // Hide all screens
    const screens = document.querySelectorAll('.screen');
    screens.forEach(screen => {
        screen.classList.remove('active');
    });

    // Show target screen
    const targetScreen = document.getElementById(screenId);
    if (targetScreen) {
        targetScreen.classList.add('active');
    }
}

// Add simple interactivity to setup screen options
document.addEventListener('DOMContentLoaded', () => {
    // Time Pillars (Now, Today, Tomorrow)
    const timePills = document.querySelectorAll('.pill-group .pill');
    timePills.forEach(pill => {
        pill.addEventListener('click', function () {
            timePills.forEach(p => p.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // Role Cards
    const roleCards = document.querySelectorAll('.role-card');
    roleCards.forEach(card => {
        card.addEventListener('click', function () {
            roleCards.forEach(c => c.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // Navigation Items
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', function () {
            navItems.forEach(nav => nav.classList.remove('active'));
            this.classList.add('active');
        });
    });
});
