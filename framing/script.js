// App State
const appState = {
    isConnected: false,
    isConnecting: false,
    connectionTime: 0,
    connectionTimer: null,
    currentServer: {
        name: "Kampala, Uganda",
        id: "UG-204",
        ping: 24,
        load: 42,
        location: "uganda"
    },
    user: {
        name: "User1234",
        level: "Premium",
        dataUsed: 65,
        dataTotal: 100
    }
};

// DOM Elements
const sideMenu = document.getElementById('sideMenu');
const appContainer = document.getElementById('appContainer');
const menuToggle = document.getElementById('menuToggle');
const closeMenu = document.getElementById('closeMenu');
const portalCenter = document.getElementById('portalCenter');
const vpnConnectBtn = document.getElementById('vpnConnectBtn');
const connectionTimer = document.getElementById('connectionTimer');
const centerStatus = document.getElementById('centerStatus');
const connectionOverlay = document.getElementById('connectionOverlay');
const overlayTitle = document.getElementById('overlayTitle');
const overlayMessage = document.getElementById('overlayMessage');
const progressFill = document.querySelector('.progress-fill');
const progressText = document.querySelector('.progress-text');
const notificationBtn = document.getElementById('notificationBtn');
const notificationPanel = document.getElementById('notificationPanel');
const closeNotifications = document.getElementById('closeNotifications');
const quickActionBtn = document.getElementById('quickActionBtn');
const quickActionMenu = document.getElementById('quickActionMenu');
const quickConnectBtn = document.getElementById('quickConnect');
const changeServerBtn = document.getElementById('changeServer');
const speedTestBtn = document.getElementById('speedTest');
const footerTime = document.getElementById('footerTime');

// Menu Toggle
menuToggle.addEventListener('click', () => {
    sideMenu.classList.add('active');
    appContainer.classList.add('menu-open');
});

closeMenu.addEventListener('click', () => {
    sideMenu.classList.remove('active');
    appContainer.classList.remove('menu-open');
});

// Close menu when clicking outside
document.addEventListener('click', (e) => {
    if (!sideMenu.contains(e.target) && !menuToggle.contains(e.target)) {
        sideMenu.classList.remove('active');
        appContainer.classList.remove('menu-open');
    }
    
    if (!notificationPanel.contains(e.target) && !notificationBtn.contains(e.target)) {
        notificationPanel.classList.remove('active');
    }
    
    if (!quickActionMenu.contains(e.target) && !quickActionBtn.contains(e.target)) {
        quickActionMenu.classList.remove('active');
    }
});

// VPN Connection Handler
vpnConnectBtn.addEventListener('click', toggleVPNConnection);
portalCenter.addEventListener('click', toggleVPNConnection);

function toggleVPNConnection() {
    if (appState.isConnecting) return;
    
    if (!appState.isConnected) {
        startConnectionProcess();
    } else {
        disconnectVPN();
    }
}

function startConnectionProcess() {
    appState.isConnecting = true;
    portalCenter.className = 'portal-center connecting';
    centerStatus.innerHTML = `
        <span class="status-text">CONNECTING</span>
        <span class="status-sub">Securing connection...</span>
    `;
    vpnConnectBtn.querySelector('.btn-title').textContent = 'Connecting...';
    
    // Show overlay
    overlayTitle.textContent = 'Connecting to VPN';
    overlayMessage.textContent = 'Establishing secure tunnel...';
    connectionOverlay.classList.add('active');
    
    // Simulate connection process
    let progress = 0;
    const connectionInterval = setInterval(() => {
        progress += 2;
        progressFill.style.width = `${progress}%`;
        progressText.textContent = `${progress}%`;
        
        if (progress >= 30) {
            overlayMessage.textContent = 'Authenticating with server...';
        }
        if (progress >= 60) {
            overlayMessage.textContent = 'Encrypting data stream...';
        }
        if (progress >= 90) {
            overlayMessage.textContent = 'Finalizing connection...';
        }
        
        if (progress >= 100) {
            clearInterval(connectionInterval);
            completeConnection();
        }
    }, 50);
}

function completeConnection() {
    appState.isConnected = true;
    appState.isConnecting = false;
    
    // Update UI
    portalCenter.className = 'portal-center connected';
    centerStatus.innerHTML = `
        <span class="status-text">CONNECTED</span>
        <span class="status-sub">Secure ✓</span>
    `;
    vpnConnectBtn.className = 'vpn-btn connect-btn connected';
    vpnConnectBtn.querySelector('.btn-title').textContent = 'Disconnect VPN';
    vpnConnectBtn.querySelector('.btn-sub').textContent = 'Tap to disconnect';
    
    // Update header indicator
    document.querySelector('.indicator-dot').style.background = 'var(--success)';
    
    // Start connection timer
    startConnectionTimer();
    
    // Hide overlay with delay
    setTimeout(() => {
        connectionOverlay.classList.remove('active');
        showNotification('VPN Connected', 'You are now securely connected to the internet.');
    }, 500);
}

function disconnectVPN() {
    appState.isConnected = false;
    
    // Update UI
    portalCenter.className = 'portal-center disconnected';
    centerStatus.innerHTML = `
        <span class="status-text">DISCONNECTED</span>
        <span class="status-sub">Tap to connect</span>
    `;
    vpnConnectBtn.className = 'vpn-btn connect-btn';
    vpnConnectBtn.querySelector('.btn-title').textContent = 'Connect VPN';
    vpnConnectBtn.querySelector('.btn-sub').textContent = 'Tap to secure connection';
    
    // Update header indicator
    document.querySelector('.indicator-dot').style.background = 'var(--danger)';
    
    // Stop connection timer
    stopConnectionTimer();
    
    showNotification('VPN Disconnected', 'Your connection is now unsecured.');
}

function startConnectionTimer() {
    appState.connectionTime = 0;
    connectionTimer.textContent = '00:00:00';
    
    appState.connectionTimer = setInterval(() => {
        appState.connectionTime++;
        
        const hours = Math.floor(appState.connectionTime / 3600);
        const minutes = Math.floor((appState.connectionTime % 3600) / 60);
        const seconds = appState.connectionTime % 60;
        
        connectionTimer.textContent = 
            `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }, 1000);
}

function stopConnectionTimer() {
    if (appState.connectionTimer) {
        clearInterval(appState.connectionTimer);
        appState.connectionTimer = null;
    }
}

// Notifications
notificationBtn.addEventListener('click', () => {
    notificationPanel.classList.add('active');
});

closeNotifications.addEventListener('click', () => {
    notificationPanel.classList.remove('active');
});

function showNotification(title, message) {
    // Update badge
    const badge = document.querySelector('.notification-badge');
    const count = parseInt(badge.textContent) + 1;
    badge.textContent = count;
    
    // Add to notification list
    const notificationList = document.querySelector('.notification-list');
    const notification = document.createElement('div');
    notification.className = 'notification-item unread';
    notification.innerHTML = `
        <div class="notification-icon">
            <i class="fas fa-info-circle"></i>
        </div>
        <div class="notification-content">
            <p>${title}</p>
            <span>Just now</span>
        </div>
    `;
    notificationList.insertBefore(notification, notificationList.firstChild);
}

// Quick Actions
quickActionBtn.addEventListener('click', (e) => {
    e.preventDefault();
    quickActionMenu.classList.toggle('active');
});

quickConnectBtn.addEventListener('click', () => {
    if (!appState.isConnected) {
        toggleVPNConnection();
    }
    quickActionMenu.classList.remove('active');
});

changeServerBtn.addEventListener('click', () => {
    const servers = [
        { name: "Germany", ping: 42, id: "DE-105" },
        { name: "USA", ping: 68, id: "US-309" },
        { name: "Japan", ping: 125, id: "JP-204" },
        { name: "Singapore", ping: 89, id: "SG-107" }
    ];
    
    const server = servers[Math.floor(Math.random() * servers.length)];
    appState.currentServer = {
        ...server,
        load: Math.floor(Math.random() * 50) + 20
    };
    
    updateServerDisplay();
    showNotification('Server Changed', `Connected to ${server.name} server`);
    quickActionMenu.classList.remove('active');
});

speedTestBtn.addEventListener('click', () => {
    // Simulate speed test
    const downloadSpeed = Math.floor(Math.random() * 200) + 100;
    const uploadSpeed = Math.floor(Math.random() * 50) + 20;
    
    showNotification('Speed Test Complete', 
        `Download: ${downloadSpeed} Mbps | Upload: ${uploadSpeed} Mbps`);
    quickActionMenu.classList.remove('active');
});

function updateServerDisplay() {
    document.querySelector('.server-text h3').textContent = appState.currentServer.name;
    document.querySelector('.server-text p').textContent = 
        `Server: ${appState.currentServer.id} • ${appState.currentServer.load}% load`;
    document.querySelector('.load-indicator span').textContent = 
        `${appState.currentServer.load}% load`;
}

// Time and Date
function updateTime() {
    const now = new Date();
    
    // Update footer time
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    footerTime.textContent = `${hours}:${minutes}`;
    
    // Update connection timer if connected
    if (appState.isConnected) {
        const elapsed = Math.floor((Date.now() - appState.connectionStartTime) / 1000);
        const hours = Math.floor(elapsed / 3600);
        const minutes = Math.floor((elapsed % 3600) / 60);
        const seconds = elapsed % 60;
        connectionTimer.textContent = 
            `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }
}

// Feature Toggles
document.querySelectorAll('.switch input').forEach(toggle => {
    toggle.addEventListener('change', function() {
        const featureName = this.closest('.feature-card').querySelector('h4').textContent;
        const status = this.checked ? 'enabled' : 'disabled';
        showNotification('Feature Updated', `${featureName} ${status}`);
    });
});

// Mobile App Simulation
function simulateMobileApp() {
    // Add touch gestures
    let startX, startY;
    
    document.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
    });
    
    document.addEventListener('touchend', (e) => {
        const endX = e.changedTouches[0].clientX;
        const endY = e.changedTouches[0].clientY;
        const diffX = startX - endX;
        const diffY = startY - endY;
        
        // Swipe left to open menu (from left edge)
        if (startX < 50 && diffX < -100 && Math.abs(diffY) < 50) {
            sideMenu.classList.add('active');
            appContainer.classList.add('menu-open');
        }
        
        // Swipe right to close menu
        if (diffX > 100 && Math.abs(diffY) < 50) {
            sideMenu.classList.remove('active');
            appContainer.classList.remove('menu-open');
        }
    });
}

// Initialize App
function initApp() {
    updateTime();
    setInterval(updateTime, 1000);
    
    simulateMobileApp();
    
    // Set initial state
    portalCenter.className = 'portal-center disconnected';
    centerStatus.innerHTML = `
        <span class="status-text">SECURE</span>
        <span class="status-sub">Tap to Connect</span>
    `;
    
    // Add click animation to buttons
    document.querySelectorAll('button, .portal-center, .nav-item').forEach(element => {
        element.addEventListener('click', function(e) {
            // Create ripple effect
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.3);
                transform: scale(0);
                animation: ripple 0.6s linear;
                width: ${size}px;
                height: ${size}px;
                top: ${y}px;
                left: ${x}px;
            `;
            
            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);
            
            setTimeout(() => ripple.remove(), 600);
        });
    });
    
    // Add CSS for ripple animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
}

// Start the app
document.addEventListener('DOMContentLoaded', initApp);