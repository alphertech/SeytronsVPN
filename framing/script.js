// Continue from previous script.js

// ========== SPLASH SCREEN ==========
function initSplashScreen() {
    const splash = document.getElementById('splashScreen');
    const splashStatus = document.getElementById('splashStatus');
    const onboarding = document.getElementById('onboardingScreen');
    const mainApp = document.getElementById('mainApp');
    
    let progress = 0;
    const interval = setInterval(() => {
        progress += 10;
        
        if (progress <= 30) {
            splashStatus.textContent = 'Initializing...';
        } else if (progress <= 60) {
            splashStatus.textContent = 'Loading servers...';
        } else if (progress <= 90) {
            splashStatus.textContent = 'Almost ready...';
        }
        
        if (progress >= 100) {
            clearInterval(interval);
            
            // Check if user has seen onboarding (simulate with localStorage)
            const hasSeenOnboarding = localStorage.getItem('onboardingComplete');
            
            splash.classList.add('hidden');
            
            if (!hasSeenOnboarding) {
                onboarding.classList.remove('hidden');
            } else {
                onboarding.classList.add('hidden');
                mainApp.classList.add('visible');
            }
        }
    }, 300);
}

// ========== ONBOARDING ==========
function initOnboarding() {
    const slides = document.querySelectorAll('.onboarding-slide');
    const dots = document.querySelectorAll('.dot');
    const nextBtn = document.getElementById('nextOnboarding');
    const skipBtn = document.getElementById('skipOnboarding');
    const onboarding = document.getElementById('onboardingScreen');
    const mainApp = document.getElementById('mainApp');
    
    let currentSlide = 0;
    
    function showSlide(index) {
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        
        slides[index].classList.add('active');
        dots[index].classList.add('active');
        
        // Change button text on last slide
        if (index === slides.length - 1) {
            nextBtn.textContent = 'Get Started';
        } else {
            nextBtn.textContent = 'Next';
        }
    }
    
    nextBtn.addEventListener('click', () => {
        if (currentSlide < slides.length - 1) {
            currentSlide++;
            showSlide(currentSlide);
        } else {
            // Complete onboarding
            localStorage.setItem('onboardingComplete', 'true');
            onboarding.classList.add('hidden');
            mainApp.classList.add('visible');
        }
    });
    
    skipBtn.addEventListener('click', () => {
        localStorage.setItem('onboardingComplete', 'true');
        onboarding.classList.add('hidden');
        mainApp.classList.add('visible');
    });
    
    // Auto-advance timer
    let autoAdvance = setInterval(() => {
        if (currentSlide < slides.length - 1 && !onboarding.classList.contains('hidden')) {
            currentSlide++;
            showSlide(currentSlide);
        }
    }, 3000);
    
    // Clear interval when onboarding is hidden
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.target.classList.contains('hidden')) {
                clearInterval(autoAdvance);
            }
        });
    });
    
    observer.observe(onboarding, { attributes: true, attributeFilter: ['class'] });
}

// ========== SIDEBAR ==========
function initSidebar() {
    const menuToggle = document.getElementById('menuToggle');
    const closeSidebar = document.getElementById('closeSidebar');
    const sidebar = document.getElementById('sidebar');
    const navItems = document.querySelectorAll('.sidebar-nav .nav-item');
    
    menuToggle.addEventListener('click', () => {
        sidebar.classList.add('active');
    });
    
    closeSidebar.addEventListener('click', () => {
        sidebar.classList.remove('active');
    });
    
    // Close sidebar when clicking outside
    document.addEventListener('click', (e) => {
        if (!sidebar.contains(e.target) && !menuToggle.contains(e.target)) {
            sidebar.classList.remove('active');
        }
    });
    
    // Handle navigation from sidebar
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const screenId = item.dataset.screen;
            switchScreen(screenId);
            
            // Update active states
            navItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');
            
            // Also update bottom nav
            const bottomNavItems = document.querySelectorAll('.bottom-nav .nav-item');
            bottomNavItems.forEach(bottomItem => {
                if (bottomItem.dataset.screen === screenId) {
                    bottomItem.classList.add('active');
                } else {
                    bottomItem.classList.remove('active');
                }
            });
            
            sidebar.classList.remove('active');
        });
    });
}

// ========== SCREEN NAVIGATION ==========
function switchScreen(screenId) {
    const screens = document.querySelectorAll('.screen');
    screens.forEach(screen => {
        screen.classList.remove('active');
    });
    
    const targetScreen = document.getElementById(screenId);
    if (targetScreen) {
        targetScreen.classList.add('active');
    }
    
    // Update document title
    const screenNames = {
        dashboard: 'Dashboard',
        servers: 'Servers',
        stats: 'Statistics',
        profile: 'Profile',
        subscription: 'Subscription',
        settings: 'Settings',
        splittunnel: 'Split Tunneling',
        support: 'Support'
    };
    
    document.title = `SEYTRONS - ${screenNames[screenId] || 'VPN'}`;
}

function initNavigation() {
    // Bottom navigation
    const bottomNavItems = document.querySelectorAll('.bottom-nav .nav-item');
    bottomNavItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const screenId = item.dataset.screen;
            
            switchScreen(screenId);
            
            // Update active states
            bottomNavItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');
            
            // Update sidebar nav
            const sidebarNavItems = document.querySelectorAll('.sidebar-nav .nav-item');
            sidebarNavItems.forEach(sidebarItem => {
                if (sidebarItem.dataset.screen === screenId) {
                    sidebarItem.classList.add('active');
                } else {
                    sidebarItem.classList.remove('active');
                }
            });
        });
    });
    
    // Back buttons
    const backButtons = document.querySelectorAll('.back-btn');
    backButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetScreen = btn.dataset.back;
            if (targetScreen) {
                switchScreen(targetScreen);
                
                // Update navigation active states
                const activeScreen = targetScreen;
                bottomNavItems.forEach(item => {
                    if (item.dataset.screen === activeScreen) {
                        item.classList.add('active');
                    } else {
                        item.classList.remove('active');
                    }
                });
                
                const sidebarNavItems = document.querySelectorAll('.sidebar-nav .nav-item');
                sidebarNavItems.forEach(item => {
                    if (item.dataset.screen === activeScreen) {
                        item.classList.add('active');
                    } else {
                        item.classList.remove('active');
                    }
                });
            }
        });
    });
}

// ========== VPN CONNECTION ==========
function initVPNConnection() {
    const powerButton = document.getElementById('powerButton');
    const connectionMainStatus = document.getElementById('connectionMainStatus');
    const connectionSubStatus = document.getElementById('connectionSubStatus');
    const connectionTimer = document.getElementById('connectionTimer');
    const connectingModal = document.getElementById('connectingModal');
    const disconnectModal = document.getElementById('disconnectModal');
    const cancelConnection = document.getElementById('cancelConnection');
    const stayConnected = document.getElementById('stayConnected');
    const confirmDisconnect = document.getElementById('confirmDisconnect');
    
    let isConnected = false;
    let isConnecting = false;
    let timerInterval = null;
    let seconds = 0;
    
    function formatTime(secs) {
        const hours = Math.floor(secs / 3600);
        const minutes = Math.floor((secs % 3600) / 60);
        const seconds = secs % 60;
        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }
    
    function startTimer() {
        seconds = 0;
        connectionTimer.textContent = formatTime(seconds);
        timerInterval = setInterval(() => {
            seconds++;
            connectionTimer.textContent = formatTime(seconds);
        }, 1000);
    }
    
    function stopTimer() {
        if (timerInterval) {
            clearInterval(timerInterval);
            timerInterval = null;
        }
        connectionTimer.textContent = '00:00:00';
    }
    
    function connect() {
        isConnecting = true;
        powerButton.classList.remove('disconnected', 'connected');
        powerButton.classList.add('connecting');
        connectionMainStatus.textContent = 'Connecting...';
        connectionSubStatus.textContent = 'Establishing secure tunnel';
        
        connectingModal.classList.add('active');
        
        // Simulate connection process
        setTimeout(() => {
            completeConnection();
        }, 2000);
    }
    
    function completeConnection() {
        isConnected = true;
        isConnecting = false;
        
        powerButton.classList.remove('connecting');
        powerButton.classList.add('connected');
        connectionMainStatus.textContent = 'Connected';
        connectionSubStatus.textContent = 'Your data is secure';
        
        connectingModal.classList.remove('active');
        startTimer();
        
        // Update location card
        document.getElementById('currentIP').textContent = '197.239.42.186';
        
        // Show success notification
        addNotification('Connected', 'VPN connection established successfully');
    }
    
    function disconnect() {
        if (isConnected) {
            disconnectModal.classList.add('active');
        }
    }
    
    function confirmDisconnectAction() {
        isConnected = false;
        isConnecting = false;
        
        powerButton.classList.remove('connected', 'connecting');
        powerButton.classList.add('disconnected');
        connectionMainStatus.textContent = 'Disconnected';
        connectionSubStatus.textContent = 'Your data is at risk';
        
        disconnectModal.classList.remove('active');
        stopTimer();
        
        // Update location card
        document.getElementById('currentIP').textContent = '---.---.---.---';
        
        // Show notification
        addNotification('Disconnected', 'VPN connection ended');
    }
    
    powerButton.addEventListener('click', () => {
        if (isConnecting) return;
        
        if (!isConnected) {
            connect();
        } else {
            disconnect();
        }
    });
    
    cancelConnection.addEventListener('click', () => {
        isConnecting = false;
        powerButton.classList.remove('connecting');
        powerButton.classList.add('disconnected');
        connectionMainStatus.textContent = 'Disconnected';
        connectionSubStatus.textContent = 'Your data is at risk';
        connectingModal.classList.remove('active');
    });
    
    stayConnected.addEventListener('click', () => {
        disconnectModal.classList.remove('active');
    });
    
    confirmDisconnect.addEventListener('click', confirmDisconnectAction);
    
    // Change location button
    document.getElementById('changeLocationBtn').addEventListener('click', () => {
        switchScreen('servers');
        
        // Update navigation
        document.querySelectorAll('.bottom-nav .nav-item').forEach(item => {
            if (item.dataset.screen === 'servers') {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    });
}

// ========== SERVER MANAGEMENT ==========
function initServers() {
    const servers = [
        { country: 'Uganda', city: 'Kampala', flag: 'ug', ping: 24, load: 42, ip: '197.239.42.186', favorite: true },
        { country: 'USA', city: 'New York', flag: 'us', ping: 68, load: 78, ip: '198.51.100.42', favorite: false },
        { country: 'Germany', city: 'Frankfurt', flag: 'de', ping: 42, load: 35, ip: '203.0.113.17', favorite: false },
        { country: 'Japan', city: 'Tokyo', flag: 'jp', ping: 125, load: 56, ip: '192.0.2.84', favorite: true },
        { country: 'Singapore', city: 'Singapore', flag: 'sg', ping: 89, load: 23, ip: '198.51.100.93', favorite: false },
        { country: 'UK', city: 'London', flag: 'gb', ping: 52, load: 61, ip: '203.0.113.156', favorite: false },
        { country: 'Canada', city: 'Toronto', flag: 'ca', ping: 78, load: 44, ip: '192.0.2.231', favorite: false },
        { country: 'Australia', city: 'Sydney', flag: 'au', ping: 210, load: 31, ip: '198.51.100.12', favorite: false },
        { country: 'Brazil', city: 'Sao Paulo', flag: 'br', ping: 185, load: 52, ip: '203.0.113.67', favorite: false },
        { country: 'India', city: 'Mumbai', flag: 'in', ping: 145, load: 47, ip: '192.0.2.45', favorite: false },
        { country: 'South Africa', city: 'Johannesburg', flag: 'za', ping: 198, load: 29, ip: '198.51.100.78', favorite: false },
        { country: 'France', city: 'Paris', flag: 'fr', ping: 58, load: 63, ip: '203.0.113.89', favorite: false }
    ];
    
    // Popular servers for dashboard
    const popularServers = servers.slice(0, 4);
    const popularContainer = document.getElementById('popularServers');
    
    if (popularContainer) {
        popularContainer.innerHTML = popularServers.map(server => `
            <div class="server-card-horizontal" data-country="${server.country}">
                <img src="https://flagcdn.com/w40/${server.flag}.png" alt="${server.country}" class="flag">
                <div class="server-info">
                    <div class="country">${server.city}, ${server.country}</div>
                    <div class="ping">${server.ping} ms</div>
                </div>
            </div>
        `).join('');
        
        // Add click handlers
        document.querySelectorAll('.server-card-horizontal').forEach(card => {
            card.addEventListener('click', () => {
                const country = card.dataset.country;
                connectToServer(country);
            });
        });
    }
    
    // Full server list
    const serverList = document.getElementById('serverList');
    if (serverList) {
        renderServerList(servers);
    }
    
    function renderServerList(serversToRender) {
        serverList.innerHTML = serversToRender.map(server => `
            <div class="server-item" data-country="${server.country}">
                <img src="https://flagcdn.com/w40/${server.flag}.png" alt="${server.country}" class="flag-img">
                <div class="server-details">
                    <div class="server-name">${server.city}, ${server.country}</div>
                    <div class="server-meta">
                        <span class="server-ping">${server.ping} ms</span>
                        <span class="server-load">Load: ${server.load}%</span>
                        <div class="load-bar">
                            <div class="load-fill" style="width: ${server.load}%"></div>
                        </div>
                    </div>
                </div>
                <div class="server-actions">
                    <button class="favorite-btn ${server.favorite ? 'active' : ''}" data-country="${server.country}">
                        <i class="fa${server.favorite ? 's' : 'r'} fa-star"></i>
                    </button>
                    <button class="connect-server-btn" data-country="${server.country}">Connect</button>
                </div>
            </div>
        `).join('');
        
        // Add event listeners
        document.querySelectorAll('.favorite-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                btn.classList.toggle('active');
                const icon = btn.querySelector('i');
                if (btn.classList.contains('active')) {
                    icon.classList.remove('fa-regular');
                    icon.classList.add('fa-solid');
                } else {
                    icon.classList.remove('fa-solid');
                    icon.classList.add('fa-regular');
                }
            });
        });
        
        document.querySelectorAll('.connect-server-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const country = btn.dataset.country;
                connectToServer(country);
            });
        });
    }
    
    // Search functionality
    const searchInput = document.getElementById('serverSearch');
    const clearSearch = document.getElementById('clearSearch');
    const searchBar = document.querySelector('.search-bar');
    
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase();
            
            if (query.length > 0) {
                searchBar.classList.add('has-text');
                const filtered = servers.filter(server => 
                    server.country.toLowerCase().includes(query) || 
                    server.city.toLowerCase().includes(query)
                );
                renderServerList(filtered);
            } else {
                searchBar.classList.remove('has-text');
                renderServerList(servers);
            }
        });
    }
    
    if (clearSearch) {
        clearSearch.addEventListener('click', () => {
            searchInput.value = '';
            searchBar.classList.remove('has-text');
            renderServerList(servers);
        });
    }
    
    // Filter chips
    const chips = document.querySelectorAll('.chip');
    chips.forEach(chip => {
        chip.addEventListener('click', () => {
            chips.forEach(c => c.classList.remove('active'));
            chip.classList.add('active');
            
            const filter = chip.dataset.filter;
            
            if (filter === 'all') {
                renderServerList(servers);
            } else if (filter === 'recommended') {
                const recommended = servers.filter(s => s.ping < 100 && s.load < 50);
                renderServerList(recommended);
            } else if (filter === 'fastest') {
                const fastest = [...servers].sort((a, b) => a.ping - b.ping).slice(0, 5);
                renderServerList(fastest);
            } else if (filter === 'favorites') {
                const favorites = servers.filter(s => s.favorite);
                renderServerList(favorites);
            } else if (filter === 'europe') {
                const european = servers.filter(s => ['Germany', 'UK', 'France'].includes(s.country));
                renderServerList(european);
            } else if (filter === 'asia') {
                const asian = servers.filter(s => ['Japan', 'Singapore', 'India'].includes(s.country));
                renderServerList(asian);
            } else if (filter === 'americas') {
                const american = servers.filter(s => ['USA', 'Canada', 'Brazil'].includes(s.country));
                renderServerList(american);
            }
        });
    });
}

function connectToServer(country) {
    const powerButton = document.getElementById('powerButton');
    const connectionMainStatus = document.getElementById('connectionMainStatus');
    const connectingModal = document.getElementById('connectingModal');
    const connectingServer = document.getElementById('connectingServer');
    
    // Update connecting message
    connectingServer.textContent = `to ${country}`;
    
    // Show connecting modal
    connectingModal.classList.add('active');
    
    // Update UI
    powerButton.classList.remove('disconnected');
    powerButton.classList.add('connecting');
    connectionMainStatus.textContent = 'Connecting...';
    
    // Simulate connection
    setTimeout(() => {
        // Complete connection
        powerButton.classList.remove('connecting');
        powerButton.classList.add('connected');
        connectionMainStatus.textContent = 'Connected';
        connectingModal.classList.remove('active');
        
        // Update location
        document.getElementById('currentLocation').textContent = `${country}`;
        
        // Show notification
        addNotification('Server Changed', `Connected to ${country} server`);
    }, 2000);
}

// ========== STATISTICS ==========
function initStatistics() {
    const chartContainer = document.getElementById('dailyChart');
    if (!chartContainer) return;
    
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const data = [2.4, 3.1, 1.8, 4.2, 2.9, 5.1, 3.7];
    
    const maxData = Math.max(...data);
    
    chartContainer.innerHTML = days.map((day, index) => {
        const height = (data[index] / maxData) * 100;
        return `
            <div class="bar-container">
                <div class="bar" style="height: ${height}%"></div>
                <span class="bar-label">${day}</span>
            </div>
        `;
    }).join('');
    
    // Connection history
    const historyContainer = document.getElementById('connectionHistory');
    if (historyContainer) {
        const history = [
            { location: 'New York, USA', time: '2 hours ago', duration: '45m', data: '1.2 GB' },
            { location: 'Frankfurt, Germany', time: 'Yesterday', duration: '2h 15m', data: '3.4 GB' },
            { location: 'Tokyo, Japan', time: 'Yesterday', duration: '1h 30m', data: '2.1 GB' },
            { location: 'Singapore', time: '2 days ago', duration: '3h', data: '4.5 GB' }
        ];
        
        historyContainer.innerHTML = history.map(item => `
            <div class="history-item">
                <div class="history-icon">
                    <i class="fas fa-server"></i>
                </div>
                <div class="history-info">
                    <div class="history-location">${item.location}</div>
                    <div class="history-time">${item.time}</div>
                </div>
                <div class="history-stats">
                    ${item.duration} • ${item.data}
                </div>
            </div>
        `).join('');
    }
}

// ========== NOTIFICATIONS ==========
function initNotifications() {
    const notificationBtn = document.getElementById('notificationBtn');
    const notificationPanel = document.getElementById('notificationPanel');
    const closeNotifications = document.getElementById('closeNotifications');
    const notificationList = document.getElementById('notificationList');
    
    // Sample notifications
    const notifications = [
        { id: 1, title: 'Security Alert', message: 'New login detected from unknown device', time: '5 min ago', unread: true, icon: 'fa-shield' },
        { id: 2, title: 'Server Update', message: 'Server maintenance completed successfully', time: '2 hours ago', unread: false, icon: 'fa-server' },
        { id: 3, title: 'Welcome', message: 'Thanks for choosing SEYTRONS', time: '1 day ago', unread: false, icon: 'fa-heart' }
    ];
    
    function renderNotifications() {
        notificationList.innerHTML = notifications.map(n => `
            <div class="notification ${n.unread ? 'unread' : ''}">
                <i class="fas ${n.icon}"></i>
                <div class="notification-content">
                    <p>${n.message}</p>
                    <span class="notification-time">${n.time}</span>
                </div>
            </div>
        `).join('');
    }
    
    renderNotifications();
    
    notificationBtn.addEventListener('click', () => {
        notificationPanel.classList.add('active');
        
        // Mark all as read
        notifications.forEach(n => n.unread = false);
        renderNotifications();
        document.querySelector('.notification-dot').style.display = 'none';
    });
    
    closeNotifications.addEventListener('click', () => {
        notificationPanel.classList.remove('active');
    });
    
    // Close when clicking outside
    document.addEventListener('click', (e) => {
        if (!notificationPanel.contains(e.target) && !notificationBtn.contains(e.target)) {
            notificationPanel.classList.remove('active');
        }
    });
}

function addNotification(title, message) {
    const notificationList = document.getElementById('notificationList');
    const notificationDot = document.querySelector('.notification-dot');
    
    const notification = document.createElement('div');
    notification.className = 'notification unread';
    notification.innerHTML = `
        <i class="fas fa-info-circle"></i>
        <div class="notification-content">
            <p>${title}${message ? ': ' + message : ''}</p>
            <span class="notification-time">Just now</span>
        </div>
    `;
    
    notificationList.insertBefore(notification, notificationList.firstChild);
    notificationDot.style.display = 'block';
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

// ========== SETTINGS ==========
function initSettings() {
    const toggles = document.querySelectorAll('.switch input');
    toggles.forEach(toggle => {
        toggle.addEventListener('change', (e) => {
            const setting = e.target.closest('.setting-item');
            if (setting) {
                const settingName = setting.querySelector('h4').textContent;
                const state = e.target.checked ? 'enabled' : 'disabled';
                addNotification('Settings', `${settingName} ${state}`);
            }
        });
    });
    
    // Dark mode toggle
    const darkModeToggle = document.getElementById('darkMode');
    if (darkModeToggle) {
        darkModeToggle.addEventListener('change', (e) => {
            if (e.target.checked) {
                document.documentElement.style.setProperty('--bg-dark', '#0F172A');
                document.documentElement.style.setProperty('--bg-surface', '#1E293B');
                document.documentElement.style.setProperty('--bg-card', '#334155');
            } else {
                document.documentElement.style.setProperty('--bg-dark', '#F1F5F9');
                document.documentElement.style.setProperty('--bg-surface', '#FFFFFF');
                document.documentElement.style.setProperty('--bg-card', '#F8FAFC');
                document.documentElement.style.setProperty('--text-light', '#0F172A');
                document.documentElement.style.setProperty('--text-muted', '#64748B');
            }
        });
    }
}

// ========== FAQ SECTION ==========
function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            // Close other items
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                }
            });
            
            item.classList.toggle('active');
        });
    });
}

// ========== RATE APP MODAL ==========
function initRateModal() {
    const stars = document.querySelectorAll('.star-rating i');
    const rateModal = document.getElementById('rateAppModal');
    
    stars.forEach(star => {
        star.addEventListener('click', () => {
            const rating = star.dataset.rating;
            
            stars.forEach((s, index) => {
                if (index < rating) {
                    s.classList.remove('fa-regular');
                    s.classList.add('fa-solid', 'active');
                } else {
                    s.classList.remove('fa-solid', 'active');
                    s.classList.add('fa-regular');
                }
            });
        });
        
        star.addEventListener('mouseover', () => {
            const rating = star.dataset.rating;
            
            stars.forEach((s, index) => {
                if (index < rating) {
                    s.classList.add('hover');
                }
            });
        });
        
        star.addEventListener('mouseout', () => {
            stars.forEach(s => s.classList.remove('hover'));
        });
    });
    
    // Show rate modal after 30 seconds (for demo)
    // setTimeout(() => {
    //     rateModal.classList.add('active');
    // }, 30000);
}

// ========== INITIALIZE ALL ==========
document.addEventListener('DOMContentLoaded', () => {
    initSplashScreen();
    initOnboarding();
    initSidebar();
    initNavigation();
    initVPNConnection();
    initServers();
    initStatistics();
    initNotifications();
    initSettings();
    initFAQ();
    initRateModal();
    
    // Handle logout
    document.getElementById('logoutBtn')?.addEventListener('click', () => {
        localStorage.removeItem('onboardingComplete');
        location.reload();
    });
    
    // View all servers from dashboard
    document.getElementById('viewAllServers')?.addEventListener('click', () => {
        switchScreen('servers');
    });
    
    // View stats from dashboard
    document.getElementById('viewStatsBtn')?.addEventListener('click', () => {
        switchScreen('stats');
    });
    
    // Split tunnel info
    document.getElementById('splitTunnelInfo')?.addEventListener('click', () => {
        const premiumModal = document.getElementById('premiumModal');
        premiumModal.classList.add('active');
        
        setTimeout(() => {
            premiumModal.classList.remove('active');
        }, 3000);
    });
    
    // Close premium modal
    document.getElementById('closePremiumModal')?.addEventListener('click', () => {
        document.getElementById('premiumModal').classList.remove('active');
    });
    
    // Upgrade now
    document.getElementById('upgradeNow')?.addEventListener('click', () => {
        document.getElementById('premiumModal').classList.remove('active');
        switchScreen('subscription');
    });
    
    // Copy referral code
    document.querySelector('.copy-code')?.addEventListener('click', () => {
        const code = document.querySelector('.referral-code span').textContent;
        navigator.clipboard.writeText(code).then(() => {
            addNotification('Copied', 'Referral code copied to clipboard');
        });
    });
    
    // Search toggle in servers screen
    document.getElementById('searchToggle')?.addEventListener('click', () => {
        const searchBar = document.getElementById('searchBar');
        searchBar.style.display = searchBar.style.display === 'none' ? 'flex' : 'none';
    });
    
    // Filter toggle in servers screen
    document.getElementById('filterToggle')?.addEventListener('click', () => {
        const filterChips = document.getElementById('filterChips');
        filterChips.style.display = filterChips.style.display === 'none' ? 'flex' : 'none';
    });
    
    // Export stats
    document.getElementById('exportStats')?.addEventListener('click', () => {
        addNotification('Export', 'Statistics exported successfully');
    });
    
    // Edit profile
    document.getElementById('editProfile')?.addEventListener('click', () => {
        addNotification('Profile', 'Edit profile feature coming soon');
    });
    
    // Select plan buttons
    document.querySelectorAll('.select-plan').forEach(btn => {
        btn.addEventListener('click', () => {
            const plan = btn.closest('.plan-card');
            const planName = plan.querySelector('h4').textContent;
            addNotification('Plan Selected', `${planName} plan selected`);
        });
    });
    
    console.log('SEYTRONS VPN initialized successfully');
});