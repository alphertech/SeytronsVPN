// ========== GLOBAL APP STATE ==========
window.AppState = window.AppState || {
    connection: {
        isConnected: false,
        isConnecting: false,
        currentServer: null,
        startTime: null,
        bytesDownloaded: 0,
        bytesUploaded: 0,
        ipAddress: null
    },
    settings: {
        protocol: 'WireGuard',
        killSwitch: true,
        darkMode: true
    },
    servers: []
};

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
            splashStatus.textContent = window.i18n ? window.i18n.translate('splash.initializing') : 'Initializing...';
        } else if (progress <= 60) {
            splashStatus.textContent = window.i18n ? window.i18n.translate('splash.loading_servers') : 'Loading servers...';
        } else if (progress <= 90) {
            splashStatus.textContent = window.i18n ? window.i18n.translate('splash.almost_ready') : 'Almost ready...';
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

// ========== AUTHENTICATION FUNCTIONS ==========

// Show auth screen (call this when app starts)
function showAuthScreen() {
    const authScreen = document.getElementById('authScreen');
    const mainApp = document.getElementById('mainApp');
    const onboarding = document.getElementById('onboardingScreen');
    
    // Hide other screens
    if (onboarding) onboarding.classList.add('hidden');
    if (mainApp) mainApp.classList.remove('visible');
    
    // Show auth screen
    authScreen.classList.add('active');
}

// Hide auth screen (after successful login)
function hideAuthScreen() {
    const authScreen = document.getElementById('authScreen');
    const mainApp = document.getElementById('mainApp');
    
    authScreen.classList.remove('active');
    mainApp.classList.add('visible');
    
    // Track login
    if (window.Analytics) {
        Analytics.trackEvent('auth', 'login_success');
    }
}

// Toggle between Login and Register
function initAuthTabs() {
    const loginTab = document.getElementById('loginTab');
    const registerTab = document.getElementById('registerTab');
    const loginSection = document.getElementById('loginSection');
    const registerSection = document.getElementById('registerSection');
    
    loginTab.addEventListener('click', () => {
        loginTab.classList.add('active');
        registerTab.classList.remove('active');
        loginSection.classList.add('active');
        registerSection.classList.remove('active');
    });
    
    registerTab.addEventListener('click', () => {
        registerTab.classList.add('active');
        loginTab.classList.remove('active');
        registerSection.classList.add('active');
        loginSection.classList.remove('active');
    });
}

// Toggle password visibility
window.togglePassword = function(inputId) {
    const input = document.getElementById(inputId);
    const icon = event.currentTarget.querySelector('i');
    
    if (input.type === 'password') {
        input.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        input.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    }
};

// Login Handler
function initLogin() {
    const loginForm = document.getElementById('loginForm');
    const loginBtn = document.getElementById('loginBtn');
    
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        const remember = document.getElementById('rememberMe').checked;
        
        if (!email || !password) {
            showNotification('Error', 'Please fill in all fields', 'error');
            return;
        }
        
        // Show loading state
        loginBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Logging in...';
        loginBtn.disabled = true;
        
        try {
            // Try to connect to Python backend first
            let success = false;
            let userData = null;
            
            try {
                const response = await fetch('http://localhost:5000/api/auth/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password, remember })
                });
                
                const result = await response.json();
                success = result.success;
                userData = result.user;
            } catch (error) {
                console.log('Backend not reachable, using mock login');
                // Mock login for testing
                success = true;
                userData = {
                    name: email.split('@')[0] || 'User',
                    email: email,
                    plan: 'Premium',
                    memberSince: 'Jan 2025'
                };
            }
            
            if (success) {
                // Save user data
                if (window.AppState) {
                    AppState.user = userData;
                }
                
                // Save to localStorage if remember me
                if (remember) {
                    localStorage.setItem('user_email', email);
                }
                
                // Show success message
                showNotification('Welcome!', `Logged in as ${userData.name}`, 'success');
                
                // Hide auth screen
                hideAuthScreen();
                
                // Update profile UI
                updateProfileUI();
            } else {
                showNotification('Login Failed', 'Invalid email or password', 'error');
            }
        } catch (error) {
            showNotification('Error', 'Connection failed', 'error');
        } finally {
            // Reset button
            loginBtn.innerHTML = 'Login';
            loginBtn.disabled = false;
        }
    });
}

// Register Handler
function initRegister() {
    const registerForm = document.getElementById('registerForm');
    const registerBtn = document.getElementById('registerBtn');
    
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const name = document.getElementById('regName').value;
        const email = document.getElementById('regEmail').value;
        const phone = document.getElementById('regPhone').value;
        const password = document.getElementById('regPassword').value;
        const confirmPass = document.getElementById('regConfirmPassword').value;
        const agreeTerms = document.getElementById('agreeTerms').checked;
        
        // Validation
        if (!name || !email || !phone || !password || !confirmPass) {
            showNotification('Error', 'Please fill in all fields', 'error');
            return;
        }
        
        if (password !== confirmPass) {
            showNotification('Error', 'Passwords do not match', 'error');
            return;
        }
        
        if (password.length < 8) {
            showNotification('Error', 'Password must be at least 8 characters', 'error');
            return;
        }
        
        if (!agreeTerms) {
            showNotification('Error', 'You must agree to the terms', 'error');
            return;
        }
        
        // Show loading
        registerBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating account...';
        registerBtn.disabled = true;
        
        try {
            // Try backend first
            let success = false;
            
            try {
                const response = await fetch('http://localhost:5000/api/auth/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name, email, phone, password })
                });
                
                const result = await response.json();
                success = result.success;
            } catch (error) {
                // Mock registration for testing
                success = true;
            }
            
            if (success) {
                showNotification('Success!', 'Account created successfully', 'success');
                
                // Switch to login tab
                document.getElementById('loginTab').click();
                
                // Pre-fill email
                document.getElementById('loginEmail').value = email;
            } else {
                showNotification('Registration Failed', 'Email already exists', 'error');
            }
        } catch (error) {
            showNotification('Error', 'Registration failed', 'error');
        } finally {
            registerBtn.innerHTML = 'Register';
            registerBtn.disabled = false;
        }
    });
}

// Google Login
function initGoogleAuth() {
    const googleLogin = document.getElementById('googleLogin');
    const googleRegister = document.getElementById('googleRegister');
    
    googleLogin.addEventListener('click', () => {
        // In production, this would redirect to Google OAuth
        showNotification('Google Login', 'Redirecting to Google...', 'info');
        
        // Mock success after 1 second
        setTimeout(() => {
            if (window.AppState) {
                AppState.user = {
                    name: 'Google User',
                    email: 'user@gmail.com',
                    plan: 'Premium',
                    memberSince: 'Jan 2025'
                };
            }
            hideAuthScreen();
            showNotification('Welcome!', 'Logged in with Google', 'success');
        }, 1000);
    });
    
    googleRegister.addEventListener('click', () => {
        showNotification('Google Sign Up', 'Redirecting to Google...', 'info');
        
        setTimeout(() => {
            document.getElementById('loginTab').click();
            showNotification('Success!', 'Account created with Google', 'success');
        }, 1000);
    });
}

// Forgot Password Modal
function initForgotPassword() {
    const forgotLink = document.getElementById('forgotPassword');
    const forgotModal = document.getElementById('forgotModal');
    const closeForgot = document.getElementById('closeForgot');
    const sendResetBtn = document.getElementById('sendResetBtn');
    
    forgotLink.addEventListener('click', (e) => {
        e.preventDefault();
        forgotModal.classList.add('active');
    });
    
    closeForgot.addEventListener('click', () => {
        forgotModal.classList.remove('active');
    });
    
    sendResetBtn.addEventListener('click', () => {
        const email = document.getElementById('resetEmail').value;
        
        if (!email) {
            showNotification('Error', 'Please enter your email', 'error');
            return;
        }
        
        showNotification('Reset Link Sent', 'Check your email for instructions', 'success');
        forgotModal.classList.remove('active');
    });
    
    // Close modal when clicking outside
    forgotModal.addEventListener('click', (e) => {
        if (e.target === forgotModal) {
            forgotModal.classList.remove('active');
        }
    });
}

// Update Profile UI after login
function updateProfileUI() {
    if (!window.AppState || !AppState.user) return;
    
    const user = AppState.user;
    
    // Update sidebar
    document.querySelector('.user-info-sidebar h3').textContent = user.name;
    document.querySelector('.user-info-sidebar p').textContent = user.email;
    
    // Update profile screen
    document.querySelector('.profile-card h3').textContent = user.name;
    document.querySelector('.profile-email').textContent = user.email;
    document.querySelector('.profile-plan').textContent = user.plan + ' Member';
    document.querySelector('.member-since').textContent = `Member since ${user.memberSince}`;
    
    // Update plan badge
    document.querySelector('.plan-badge').textContent = user.plan;
}

// Check for saved login
function checkSavedLogin() {
    const savedEmail = localStorage.getItem('user_email');
    if (savedEmail) {
        document.getElementById('loginEmail').value = savedEmail;
        document.getElementById('rememberMe').checked = true;
    }
}

// Initialize all auth functions
function initAuth() {
    initAuthTabs();
    initLogin();
    initRegister();
    initGoogleAuth();
    initForgotPassword();
    checkSavedLogin();
    
    // Show auth screen on app start (you can modify this based on your flow)
    // showAuthScreen();
}

// Call this when you want to show auth (e.g., after onboarding)
document.addEventListener('DOMContentLoaded', () => {
    // ... your existing code ...
    
    // Uncomment to show auth after splash
    // setTimeout(() => {
    //     showAuthScreen();
    // }, 3000);
});

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
        
        // Change button text on last slide (use i18n)
        if (index === slides.length - 1) {
            nextBtn.textContent = window.i18n ? window.i18n.translate('common.done') : 'Get Started';
        } else {
            nextBtn.textContent = window.i18n ? window.i18n.translate('common.next') : 'Next';
        }
    }
    
    // In your existing initOnboarding function, change this part:
nextBtn.addEventListener('click', () => {
    if (currentSlide < slides.length - 1) {
        currentSlide++;
        showSlide(currentSlide);
    } else {
        // Complete onboarding
        localStorage.setItem('onboardingComplete', 'true');
        onboarding.classList.add('hidden');
        
        // Show auth screen instead of main app
        showAuthScreen(); // Add this line
        // mainApp.classList.add('visible'); // Remove or comment this
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
    // If the requested screen is the separate full-page auth overlay, show it
    if (screenId === 'auth' || screenId === 'authScreen') {
        // Hide other .screen elements
        document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));

        // Ensure main app is hidden and show the auth overlay
        const authOverlay = document.getElementById('authScreen');
        const mainApp = document.getElementById('mainApp');
        if (mainApp) mainApp.classList.remove('visible');
        if (authOverlay) authOverlay.classList.add('active');

        // Update document title
        document.title = `SEYTRONS - ${window.i18n ? window.i18n.translate('auth.title') : 'Sign In'}`;
        return;
    }

    // Hide any open auth overlay when navigating to a normal screen
    const authOverlay = document.getElementById('authScreen');
    if (authOverlay) authOverlay.classList.remove('active');

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
        connectionMainStatus.textContent = window.i18n ? window.i18n.translate('dashboard.connecting') : 'Connecting...';
        connectionSubStatus.textContent = window.i18n ? window.i18n.translate('common.loading') : 'Establishing secure tunnel';
        
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
        connectionMainStatus.textContent = window.i18n ? window.i18n.translate('dashboard.connected') : 'Connected';
        connectionSubStatus.textContent = window.i18n ? window.i18n.translate('dashboard.secure') : 'Your data is secure';
        
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
        connectionMainStatus.textContent = window.i18n ? window.i18n.translate('dashboard.disconnected') : 'Disconnected';
        connectionSubStatus.textContent = window.i18n ? window.i18n.translate('dashboard.at_risk') : 'Your data is at risk';
        
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
    
    // Update connecting message (localized)
    if (window.i18n) {
        connectingServer.textContent = window.i18n.translate('modals.connecting.to', { server: country });
    } else {
        connectingServer.textContent = `to ${country}`;
    }
    
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
// Single DOMContentLoaded: initialize i18n then app
document.addEventListener('DOMContentLoaded', async () => {
    // Initialize i18n if available
    if (window.i18n && typeof window.i18n.init === 'function') {
        try { await window.i18n.init(); } catch (e) { console.warn('i18n init failed', e); }
        // Apply translations for static attributes
        try { window.i18n.translateUI(); } catch (e) {}
        // Populate languageSelect in settings
        try { window.i18n.setupLanguageSelector(); } catch (e) {}
        // Listen for language changes to update runtime text
        try { window.i18n.addListener(() => updateDynamicContent()); } catch (e) {}
    }

    // Initialize UI components
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
    initAuth();

    // Common event bindings
    document.getElementById('logoutBtn')?.addEventListener('click', () => {
        localStorage.removeItem('onboardingComplete');
        location.reload();
    });

    document.getElementById('viewAllServers')?.addEventListener('click', () => switchScreen('servers'));
    document.getElementById('viewStatsBtn')?.addEventListener('click', () => switchScreen('stats'));

    document.getElementById('splitTunnelInfo')?.addEventListener('click', () => {
        const premiumModal = document.getElementById('premiumModal');
        premiumModal.classList.add('active');
        setTimeout(() => premiumModal.classList.remove('active'), 3000);
    });

    document.getElementById('closePremiumModal')?.addEventListener('click', () => document.getElementById('premiumModal').classList.remove('active'));

    document.getElementById('upgradeNow')?.addEventListener('click', () => { document.getElementById('premiumModal').classList.remove('active'); switchScreen('subscription'); });

    document.querySelector('.copy-code')?.addEventListener('click', () => {
        const code = document.querySelector('.referral-code span').textContent;
        navigator.clipboard.writeText(code).then(() => {
            addNotification(window.i18n ? window.i18n.translate('common.copied') || 'Copied' : 'Copied', 'Referral code copied to clipboard');
        });
    });

    document.getElementById('searchToggle')?.addEventListener('click', () => {
        const searchBar = document.getElementById('searchBar');
        searchBar.style.display = searchBar.style.display === 'none' ? 'flex' : 'none';
    });

    document.getElementById('filterToggle')?.addEventListener('click', () => {
        const filterChips = document.getElementById('filterChips');
        filterChips.style.display = filterChips.style.display === 'none' ? 'flex' : 'none';
    });

    document.getElementById('exportStats')?.addEventListener('click', () => { addNotification('Export', 'Statistics exported successfully'); });
    document.getElementById('editProfile')?.addEventListener('click', () => { addNotification('Profile', 'Edit profile feature coming soon'); });

    document.querySelectorAll('.select-plan').forEach(btn => btn.addEventListener('click', () => {
        const plan = btn.closest('.plan-card');
        const planName = plan.querySelector('h4').textContent;
        addNotification('Plan Selected', `${planName} plan selected`);
    }));

    console.log('SEYTRONS VPN initialized successfully');
});

// Function to update dynamic content that's not in data-i18n attributes
function updateDynamicContent() {
    // Update server list items
    document.querySelectorAll('.server-item').forEach(item => {
        const connectBtn = item.querySelector('.connect-server-btn');
        if (window.i18n) connectBtn.textContent = window.i18n.translate('servers.connect');
    });
    
    // Update connection timer formatting if needed
    // etc.
}

// Also update some other dynamic texts used in the app
function applyRuntimeTranslations() {
    // Splash
    const splashStatus = document.getElementById('splashStatus');
    if (splashStatus && window.i18n) splashStatus.textContent = window.i18n.translate('splash.initializing');

    // Connection statuses
    const connectionMainStatus = document.getElementById('connectionMainStatus');
    const connectionSubStatus = document.getElementById('connectionSubStatus');
    if (connectionMainStatus && window.i18n) {
        // Only update if current value is one of known states
        const val = connectionMainStatus.textContent || '';
        if (/Connect|Disconnect|Connecting|Connected|Disconnected/i.test(val)) {
            // keep current state but translate keys where possible
            if (val.toLowerCase().includes('connect')) connectionMainStatus.textContent = window.i18n.translate('dashboard.connected');
        }
    }

    // Update any other dynamic texts
    updateDynamicContent();
}

// Ensure runtime translations applied after language load
if (window.i18n) {
    try { window.i18n.addListener(() => { applyRuntimeTranslations(); }); } catch (e) {}
}

// Auth initialization is implemented earlier (tabs, login/register flows)
// The compact duplicate `initAuth()` was removed to avoid ID collisions and
// ensure the overlay auth handlers (initAuthTabs, initLogin, initRegister, etc.)
// are the active implementation.

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js')
            .then(registration => {
                console.log('ServiceWorker registered');
            })
            .catch(err => {
                console.log('ServiceWorker registration failed:', err);
            });
    });
}