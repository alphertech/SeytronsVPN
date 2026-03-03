// ============================================
// SEYTRONS VPN - Advanced Features Module
// ============================================

// ========== DATA PERSISTENCE & STORAGE ==========
const StorageManager = {
    // Save app state to localStorage
    saveState() {
        const state = {
            user: AppState?.user || null,
            settings: AppState?.settings || null,
            favorites: window.favoriteServers || [],
            connectionHistory: window.connectionHistory || []
        };
        localStorage.setItem('seytron_state', JSON.stringify(state));
    },

    // Load app state from localStorage
    loadState() {
        const saved = localStorage.getItem('seytron_state');
        if (saved) {
            try {
                return JSON.parse(saved);
            } catch (e) {
                console.error('Failed to parse saved state', e);
            }
        }
        return null;
    },

    // Save specific setting
    saveSetting(key, value) {
        const settings = JSON.parse(localStorage.getItem('seytron_settings') || '{}');
        settings[key] = value;
        localStorage.setItem('seytron_settings', JSON.stringify(settings));

        // Update AppState if available
        if (window.AppState?.settings) {
            window.AppState.settings[key] = value;
        }
    },

    // Load specific setting
    loadSetting(key, defaultValue) {
        const settings = JSON.parse(localStorage.getItem('seytron_settings') || '{}');
        return settings[key] !== undefined ? settings[key] : defaultValue;
    },

    // Clear all data (logout)
    clearAllData() {
        const keysToKeep = ['onboardingComplete']; // Keep onboarding flag
        const allKeys = Object.keys(localStorage);

        allKeys.forEach(key => {
            if (!keysToKeep.includes(key)) {
                localStorage.removeItem(key);
            }
        });
    }
};

// ========== ADVANCED CONNECTION SIMULATION ==========
const ConnectionSimulator = {
    servers: [
        { id: 'us-ny', name: 'New York', country: 'USA', load: 45, ping: 68, ip: '198.51.100.42' },
        { id: 'de-fr', name: 'Frankfurt', country: 'Germany', load: 32, ping: 42, ip: '203.0.113.17' },
        { id: 'jp-tk', name: 'Tokyo', country: 'Japan', load: 78, ping: 125, ip: '192.0.2.84' },
        { id: 'sg-sg', name: 'Singapore', country: 'Singapore', load: 23, ping: 89, ip: '198.51.100.93' },
        { id: 'ug-kp', name: 'Kampala', country: 'Uganda', load: 42, ping: 24, ip: '197.239.42.186' }
    ],

    currentConnection: null,
    connectionQuality: null,
    reconnectAttempts: 0,

    // Simulate connection with realistic behavior
    async connect(serverId) {
        const server = this.servers.find(s => s.id === serverId) || this.servers[0];

        return new Promise((resolve, reject) => {
            // Simulate connection phases
            const phases = [
                { name: 'Resolving server...', duration: 500 },
                { name: 'Establishing handshake...', duration: 800 },
                { name: 'Authenticating...', duration: 600 },
                { name: 'Securing tunnel...', duration: 700 },
                { name: 'Connected!', duration: 400 }
            ];

            let phaseIndex = 0;

            const runPhase = () => {
                if (phaseIndex < phases.length) {
                    const phase = phases[phaseIndex];

                    // Update UI through custom event
                    window.dispatchEvent(new CustomEvent('connection-phase', {
                        detail: { phase: phase.name, server: server.name }
                    }));

                    phaseIndex++;
                    setTimeout(runPhase, phase.duration);
                } else {
                    // Connection successful
                    this.currentConnection = {
                        server: server,
                        startTime: Date.now(),
                        bytesTransferred: 0,
                        ipAssigned: server.ip
                    };

                    // Calculate connection quality
                    this.calculateConnectionQuality(server);

                    resolve({
                        success: true,
                        server: server,
                        ip: server.ip,
                        quality: this.connectionQuality
                    });
                }
            };

            // 10% chance of connection failure (for realism)
            if (Math.random() < 0.1 && this.reconnectAttempts < 2) {
                this.reconnectAttempts++;
                reject(new Error('Connection timeout. Retrying...'));
            } else {
                this.reconnectAttempts = 0;
                runPhase();
            }
        });
    },

    disconnect() {
        if (this.currentConnection) {
            const duration = Date.now() - this.currentConnection.startTime;
            const dataUsed = this.currentConnection.bytesTransferred;

            this.currentConnection = null;

            return {
                duration: duration,
                dataUsed: dataUsed
            };
        }
        return null;
    },

    calculateConnectionQuality(server) {
        // Simulate connection quality based on server load and ping
        const baseQuality = 100 - (server.load * 0.3) - (server.ping * 0.2);
        this.connectionQuality = Math.min(100, Math.max(0, Math.round(baseQuality)));

        return this.connectionQuality;
    },

    simulateDataTransfer() {
        if (!this.currentConnection) return;

        // Simulate data transfer (random bytes)
        setInterval(() => {
            if (this.currentConnection) {
                const increment = Math.floor(Math.random() * 100000); // Random bytes
                this.currentConnection.bytesTransferred += increment;

                // Dispatch update event
                window.dispatchEvent(new CustomEvent('data-transferred', {
                    detail: { bytes: this.currentConnection.bytesTransferred }
                }));
            }
        }, 2000);
    }
};

// ========== SPEED TEST MODULE ==========
const SpeedTester = {
    isTesting: false,
    results: { download: 0, upload: 0, ping: 0 },

    async runTest() {
        this.isTesting = true;
        this.notifyStart();

        // Simulate speed test phases
        const phases = [
            { name: 'Testing ping...', duration: 1000 },
            { name: 'Testing download...', duration: 2000 },
            { name: 'Testing upload...', duration: 2000 }
        ];

        for (const phase of phases) {
            window.dispatchEvent(new CustomEvent('speedtest-phase', {
                detail: { phase: phase.name }
            }));
            await this.sleep(phase.duration);
        }

        // Generate realistic results
        this.results = {
            download: Math.floor(50 + Math.random() * 200), // 50-250 Mbps
            upload: Math.floor(20 + Math.random() * 100),   // 20-120 Mbps
            ping: Math.floor(10 + Math.random() * 40)       // 10-50 ms
        };

        this.isTesting = false;

        // Save to history
        this.saveToHistory();

        return this.results;
    },

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    },

    notifyStart() {
        window.dispatchEvent(new CustomEvent('speedtest-start'));
    },

    saveToHistory() {
        const history = JSON.parse(localStorage.getItem('speedtest_history') || '[]');
        history.unshift({
            ...this.results,
            timestamp: new Date().toISOString()
        });

        // Keep only last 10 tests
        if (history.length > 10) history.pop();

        localStorage.setItem('speedtest_history', JSON.stringify(history));
    },

    getHistory() {
        return JSON.parse(localStorage.getItem('speedtest_history') || '[]');
    }
};

// ========== ANALYTICS & TRACKING ==========
const Analytics = {
    events: [],
    sessionStart: Date.now(),

    trackEvent(category, action, label = null, value = null) {
        const event = {
            category,
            action,
            label,
            value,
            timestamp: new Date().toISOString(),
            sessionTime: Date.now() - this.sessionStart
        };

        this.events.push(event);

        // Store in localStorage
        this.saveEvents();

        // Console log in development
        if (window.location.hostname === 'localhost') {
            console.log('[Analytics]', event);
        }
    },

    saveEvents() {
        // Keep only last 100 events
        if (this.events.length > 100) {
            this.events = this.events.slice(-100);
        }
        localStorage.setItem('analytics_events', JSON.stringify(this.events));
    },

    loadEvents() {
        const saved = localStorage.getItem('analytics_events');
        if (saved) {
            try {
                this.events = JSON.parse(saved);
            } catch (e) {
                console.error('Failed to load analytics', e);
            }
        }
    },

    getUsageStats() {
        const connectionEvents = this.events.filter(e =>
            e.category === 'vpn' && (e.action === 'connect' || e.action === 'disconnect')
        );

        return {
            totalConnections: connectionEvents.length,
            avgSessionTime: this.calculateAvgSessionTime(connectionEvents),
            favoriteServer: this.getFavoriteServer(),
            totalDataUsed: this.calculateTotalDataUsed()
        };
    },

    calculateAvgSessionTime(events) {
        // Simplified calculation
        return '15m 30s';
    },

    getFavoriteServer() {
        const serverEvents = this.events.filter(e =>
            e.category === 'server' && e.action === 'connect'
        );

        if (serverEvents.length === 0) return 'None';

        const counts = {};
        serverEvents.forEach(e => {
            counts[e.label] = (counts[e.label] || 0) + 1;
        });

        return Object.keys(counts).reduce((a, b) =>
            counts[a] > counts[b] ? a : b
        );
    },

    calculateTotalDataUsed() {
        // Simulate data calculation
        return '127 GB';
    }
};

// ========== CUSTOM NOTIFICATION SYSTEM ==========
const NotificationCenter = {
    queue: [],
    isShowing: false,

    show(options) {
        const {
            title,
            message,
            type = 'info',
            duration = 5000,
            actions = [],
            persistent = false
        } = options;

        const id = 'notif_' + Date.now() + Math.random().toString(36).substr(2, 9);

        const notification = {
            id,
            title,
            message,
            type,
            duration: persistent ? null : duration,
            actions,
            timestamp: new Date(),
            element: null
        };

        this.queue.push(notification);

        if (!this.isShowing) {
            this.showNext();
        }

        return id;
    },

    showNext() {
        if (this.queue.length === 0) {
            this.isShowing = false;
            return;
        }

        this.isShowing = true;
        const notification = this.queue.shift();

        // Create notification element
        const element = this.createNotificationElement(notification);
        notification.element = element;

        document.body.appendChild(element);

        // Animate in
        setTimeout(() => element.classList.add('show'), 10);

        // Auto remove if not persistent
        if (notification.duration) {
            setTimeout(() => {
                this.dismiss(notification.id);
            }, notification.duration);
        }
    },

    createNotificationElement(notification) {
        const div = document.createElement('div');
        div.className = `custom-notification ${notification.type}`;
        div.id = notification.id;

        const icon = this.getIconForType(notification.type);

        div.innerHTML = `
            <div class="notification-icon">
                <i class="fas ${icon}"></i>
            </div>
            <div class="notification-content-custom">
                <div class="notification-title">${notification.title}</div>
                <div class="notification-message">${notification.message}</div>
            </div>
            <button class="notification-close">
                <i class="fas fa-times"></i>
            </button>
        `;

        // Add actions if any
        if (notification.actions.length > 0) {
            const actionsDiv = document.createElement('div');
            actionsDiv.className = 'notification-actions';

            notification.actions.forEach(action => {
                const btn = document.createElement('button');
                btn.textContent = action.label;
                btn.onclick = () => {
                    action.handler();
                    this.dismiss(notification.id);
                };
                actionsDiv.appendChild(btn);
            });

            div.querySelector('.notification-content-custom').appendChild(actionsDiv);
        }

        // Close button
        div.querySelector('.notification-close').onclick = () => {
            this.dismiss(notification.id);
        };

        return div;
    },

    getIconForType(type) {
        const icons = {
            success: 'fa-check-circle',
            error: 'fa-exclamation-circle',
            warning: 'fa-exclamation-triangle',
            info: 'fa-info-circle',
            vpn: 'fa-shield-halved',
            update: 'fa-download'
        };
        return icons[type] || icons.info;
    },

    dismiss(id) {
        const element = document.getElementById(id);
        if (element) {
            element.classList.remove('show');
            setTimeout(() => {
                element.remove();
                this.showNext();
            }, 300);
        } else {
            this.showNext();
        }
    }
};

// ========== KEYBOARD SHORTCUTS ==========
const KeyboardShortcuts = {
    shortcuts: {
        'c': { action: 'connect', description: 'Connect/Disconnect VPN' },
        's': { action: 'servers', description: 'Open Servers' },
        'h': { action: 'home', description: 'Go to Home' },
        'p': { action: 'profile', description: 'Open Profile' },
        '?': { action: 'help', description: 'Show Help' },
        'Escape': { action: 'close', description: 'Close Modals' }
    },

    init() {
        document.addEventListener('keydown', (e) => {
            // Don't trigger if typing in input
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
                return;
            }

            const key = e.key;
            const shortcut = this.shortcuts[key];

            if (shortcut) {
                e.preventDefault();
                this.executeAction(shortcut.action);
            }
        });
    },

    executeAction(action) {
        switch (action) {
            case 'connect':
                document.getElementById('powerButton')?.click();
                break;
            case 'servers':
                window.switchScreen?.('servers');
                break;
            case 'home':
                window.switchScreen?.('dashboard');
                break;
            case 'profile':
                window.switchScreen?.('profile');
                break;
            case 'help':
                NotificationCenter.show({
                    title: 'Keyboard Shortcuts',
                    message: Object.entries(this.shortcuts)
                        .map(([key, s]) => `${key}: ${s.description}`)
                        .join('\n'),
                    type: 'info',
                    duration: 5000
                });
                break;
            case 'close':
                document.querySelectorAll('.modal.active, .notification-panel.active, .sidebar.active')
                    .forEach(el => el.classList.remove('active'));
                break;
        }
    },

    showHelp() {
        return Object.entries(this.shortcuts)
            .map(([key, s]) => `${key} - ${s.description}`)
            .join('\n');
    }
};

// ========== THEME MANAGER ==========
const ThemeManager = {
    themes: {
        dark: {
            '--bg-dark': '#0F172A',
            '--bg-surface': '#1E293B',
            '--bg-card': '#334155',
            '--text-light': '#F8FAFC',
            '--text-muted': '#94A3B8',
            '--primary': '#3B82F6',
            '--success': '#10B981',
            '--warning': '#F59E0B',
            '--danger': '#EF4444'
        },
        light: {
            '--bg-dark': '#F1F5F9',
            '--bg-surface': '#FFFFFF',
            '--bg-card': '#F8FAFC',
            '--text-light': '#0F172A',
            '--text-muted': '#64748B',
            '--primary': '#2563EB',
            '--success': '#059669',
            '--warning': '#D97706',
            '--danger': '#DC2626'
        },
        midnight: {
            '--bg-dark': '#0B1120',
            '--bg-surface': '#1A2634',
            '--bg-card': '#2A3748',
            '--text-light': '#E2E8F0',
            '--text-muted': '#A0B3D9',
            '--primary': '#5F9EA0',
            '--success': '#2E8B57',
            '--warning': '#CD853F',
            '--danger': '#B22222'
        }
    },

    currentTheme: 'dark',

    applyTheme(themeName) {
        const theme = this.themes[themeName];
        if (!theme) return;

        const root = document.documentElement;
        Object.entries(theme).forEach(([property, value]) => {
            root.style.setProperty(property, value);
        });

        this.currentTheme = themeName;
        localStorage.setItem('seytron_theme', themeName);

        // Update toggle if exists
        const darkModeToggle = document.getElementById('darkMode');
        if (darkModeToggle) {
            darkModeToggle.checked = themeName !== 'light';
        }

        window.dispatchEvent(new CustomEvent('theme-changed', { detail: themeName }));
    },

    toggleTheme() {
        const themes = Object.keys(this.themes);
        const currentIndex = themes.indexOf(this.currentTheme);
        const nextIndex = (currentIndex + 1) % themes.length;
        this.applyTheme(themes[nextIndex]);
    },

    loadSavedTheme() {
        const saved = localStorage.getItem('seytron_theme');
        if (saved && this.themes[saved]) {
            this.applyTheme(saved);
        }
    }
};

// ========== PROGRESSIVE WEB APP (PWA) SUPPORT ==========
const PWAHelper = {
    deferredPrompt: null,

    init() {
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            this.deferredPrompt = e;

            // Show install button if not already installed
            this.showInstallButton();
        });

        window.addEventListener('appinstalled', () => {
            this.deferredPrompt = null;
            NotificationCenter.show({
                title: 'Installed!',
                message: 'SEYTRONS VPN has been installed on your device',
                type: 'success',
                duration: 3000
            });
        });
    },

    showInstallButton() {
        // Create install button if it doesn't exist
        if (!document.getElementById('installPWA')) {
            const btn = document.createElement('button');
            btn.id = 'installPWA';
            btn.className = 'install-pwa-btn';
            btn.innerHTML = '<i class="fas fa-download"></i> Install App';
            btn.onclick = () => this.installPWA();
            document.querySelector('.header-actions')?.appendChild(btn);
        }
    },

    async installPWA() {
        if (!this.deferredPrompt) return;

        this.deferredPrompt.prompt();
        const { outcome } = await this.deferredPrompt.userChoice;

        if (outcome === 'accepted') {
            console.log('User accepted the install prompt');
        }

        this.deferredPrompt = null;
        document.getElementById('installPWA')?.remove();
    }
};

// ========== PERFORMANCE MONITOR ==========
const PerformanceMonitor = {
    metrics: {},
    observers: [],

    startMonitoring() {
        this.trackMemory();
        this.trackFPS();
        this.trackNetworkRequests();
    },

    trackMemory() {
        if (performance.memory) {
            setInterval(() => {
                this.metrics.memory = {
                    used: performance.memory.usedJSHeapSize,
                    total: performance.memory.totalJSHeapSize,
                    limit: performance.memory.jsHeapSizeLimit
                };
            }, 5000);
        }
    },

    trackFPS() {
        let frames = 0;
        let lastTime = performance.now();

        const measureFPS = () => {
            frames++;
            const now = performance.now();
            const delta = now - lastTime;

            if (delta >= 1000) {
                const fps = Math.round((frames * 1000) / delta);
                this.metrics.fps = fps;

                frames = 0;
                lastTime = now;

                // Warn if low FPS
                if (fps < 30) {
                    console.warn('Low FPS detected:', fps);
                }
            }

            requestAnimationFrame(measureFPS);
        };

        requestAnimationFrame(measureFPS);
    },

    trackNetworkRequests() {
        const originalFetch = window.fetch;
        window.fetch = (...args) => {
            const start = performance.now();
            return originalFetch(...args).then(response => {
                const duration = performance.now() - start;
                console.log(`Fetch to ${args[0]} took ${duration}ms`);
                return response;
            });
        };
    },

    getMetrics() {
        return this.metrics;
    }
};

// ========== INITIALIZE ALL FEATURES ==========
document.addEventListener('DOMContentLoaded', () => {
    // Load saved theme
    ThemeManager.loadSavedTheme();

    // Initialize keyboard shortcuts
    KeyboardShortcuts.init();

    // Initialize PWA support
    PWAHelper.init();

    // Load analytics
    Analytics.loadEvents();

    // Track session start
    Analytics.trackEvent('app', 'session_start');

    // Add CSS for custom notifications
    addNotificationStyles();

    console.log('SEYTRONS Advanced Features loaded');
});

// Add CSS for custom notifications
function addNotificationStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .custom-notification {
            position: fixed;
            top: 20px;
            right: 20px;
            min-width: 300px;
            max-width: 400px;
            background: var(--bg-surface, #1E293B);
            color: var(--text-light, #F8FAFC);
            border-radius: 12px;
            padding: 16px;
            box-shadow: 0 10px 25px rgba(0,0,0,0.3);
            display: flex;
            align-items: flex-start;
            gap: 12px;
            z-index: 10000;
            transform: translateX(120%);
            transition: transform 0.3s ease;
            border-left: 4px solid var(--primary, #3B82F6);
        }
        
        .custom-notification.show {
            transform: translateX(0);
        }
        
        .custom-notification.success { border-left-color: var(--success, #10B981); }
        .custom-notification.error { border-left-color: var(--danger, #EF4444); }
        .custom-notification.warning { border-left-color: var(--warning, #F59E0B); }
        .custom-notification.vpn { border-left-color: var(--primary, #3B82F6); }
        
        .notification-icon {
            font-size: 24px;
            color: var(--primary, #3B82F6);
        }
        
        .custom-notification.success .notification-icon { color: var(--success, #10B981); }
        .custom-notification.error .notification-icon { color: var(--danger, #EF4444); }
        .custom-notification.warning .notification-icon { color: var(--warning, #F59E0B); }
        
        .notification-content-custom {
            flex: 1;
        }
        
        .notification-title {
            font-weight: 600;
            margin-bottom: 4px;
        }
        
        .notification-message {
            font-size: 0.9em;
            opacity: 0.9;
        }
        
        .notification-actions {
            display: flex;
            gap: 8px;
            margin-top: 12px;
        }
        
        .notification-actions button {
            background: rgba(59, 130, 246, 0.1);
            border: none;
            padding: 6px 12px;
            border-radius: 6px;
            color: var(--primary, #3B82F6);
            cursor: pointer;
            font-size: 0.9em;
        }
        
        .notification-close {
            background: none;
            border: none;
            color: var(--text-muted, #94A3B8);
            cursor: pointer;
            padding: 4px;
        }
        
        .install-pwa-btn {
            background: var(--primary, #3B82F6);
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 20px;
            font-size: 0.9em;
            cursor: pointer;
            margin-right: 10px;
            display: flex;
            align-items: center;
            gap: 6px;
        }
    `;
    document.head.appendChild(style);
}

// Export for use in other files
window.StorageManager = StorageManager;
window.ConnectionSimulator = ConnectionSimulator;
window.SpeedTester = SpeedTester;
window.Analytics = Analytics;
window.NotificationCenter = NotificationCenter;
window.KeyboardShortcuts = KeyboardShortcuts;
window.ThemeManager = ThemeManager;
window.PWAHelper = PWAHelper;
window.PerformanceMonitor = PerformanceMonitor;