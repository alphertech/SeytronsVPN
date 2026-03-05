// ============================================
// SEYTRONS VPN - API Connection Bridge
// Connects UI to Python Backend
// ============================================

const API = {
    baseUrl: 'http://localhost:5000/api',
    
    // ========== VPN CONNECTION ==========
    async getStatus() {
        try {
            const response = await fetch(`${this.baseUrl}/vpn/status`);
            return await response.json();
        } catch (error) {
            console.error('Failed to get status:', error);
            return { connected: false };
        }
    },
    
    async connect(serverId) {
        try {
            const response = await fetch(`${this.baseUrl}/vpn/connect`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    server_id: serverId,
                    protocol: AppState?.settings?.protocol || 'WireGuard'
                })
            });
            return await response.json();
        } catch (error) {
            console.error('Connection failed:', error);
            return { success: false, message: 'Cannot connect to VPN server' };
        }
    },
    
    async disconnect() {
        try {
            const response = await fetch(`${this.baseUrl}/vpn/disconnect`, {
                method: 'POST'
            });
            return await response.json();
        } catch (error) {
            console.error('Disconnect failed:', error);
            return { success: false };
        }
    },
    
    // ========== SERVERS ==========
    async getServers() {
        try {
            const response = await fetch(`${this.baseUrl}/servers/list`);
            const servers = await response.json();
            return servers;
        } catch (error) {
            console.error('Failed to load servers:', error);
            return [];
        }
    },
    
    async refreshPings() {
        try {
            const response = await fetch(`${this.baseUrl}/servers/ping`);
            return await response.json();
        } catch (error) {
            console.error('Failed to refresh pings:', error);
            return {};
        }
    },
    
    async toggleFavorite(serverId, isFavorite) {
        try {
            await fetch(`${this.baseUrl}/servers/favorite`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    server_id: serverId, 
                    favorite: isFavorite 
                })
            });
        } catch (error) {
            console.error('Failed to save favorite:', error);
        }
    },
    
    // ========== STATISTICS ==========
    async getUsage(period = 'today') {
        try {
            const response = await fetch(`${this.baseUrl}/stats/usage?period=${period}`);
            return await response.json();
        } catch (error) {
            console.error('Failed to load stats:', error);
            return { days: [], data: [] };
        }
    },
    
    async getHistory(limit = 10) {
        try {
            const response = await fetch(`${this.baseUrl}/stats/history?limit=${limit}`);
            return await response.json();
        } catch (error) {
            console.error('Failed to load history:', error);
            return [];
        }
    },
    
    // ========== SETTINGS ==========
    async saveSettings(settings) {
        try {
            await fetch(`${this.baseUrl}/settings/save`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(settings)
            });
        } catch (error) {
            console.error('Failed to save settings:', error);
        }
    },
    
    async loadSettings() {
        try {
            const response = await fetch(`${this.baseUrl}/settings/load`);
            return await response.json();
        } catch (error) {
            console.error('Failed to load settings:', error);
            return null;
        }
    }
};

// ========== OVERRIDE THE SIMULATION FUNCTIONS ==========

// Store original functions
const originalConnect = window.connectToServer;
const originalDisconnect = window.disconnectVPN;

// Override connect function
window.connectToServer = async function(serverId) {
    if (AppState.connection.isConnecting) return;
    
    // Show connecting modal
    document.getElementById('connectingModal').classList.add('active');
    
    // Call actual Python backend
    const result = await API.connect(serverId);
    
    if (result.success) {
        // Update AppState
        AppState.connection.isConnected = true;
        AppState.connection.currentServer = AppState.servers.find(s => s.id === serverId);
        AppState.connection.ipAddress = result.ip;
        AppState.connection.startTime = Date.now();
        
        // Update UI
        document.getElementById('connectingModal').classList.remove('active');
        updateConnectionUI('connected', AppState.connection.currentServer);
        
        // Start timer
        if (window.startConnectionTimer) startConnectionTimer();
        
        // Show notification
        if (window.showNotification) {
            showNotification('Connected', `Connected to ${AppState.connection.currentServer?.city}, ${AppState.connection.currentServer?.country}`, 'success');
        }
    } else {
        document.getElementById('connectingModal').classList.remove('active');
        if (window.showNotification) {
            showNotification('Connection Failed', result.message || 'Could not connect to server', 'error');
        }
    }
};

// Override disconnect
window.disconnectVPN = async function() {
    const result = await API.disconnect();
    
    if (result.success) {
        AppState.connection.isConnected = false;
        AppState.connection.currentServer = null;
        AppState.connection.ipAddress = null;
        AppState.connection.startTime = null;
        
        updateConnectionUI('disconnected');
        
        if (window.stopConnectionTimer) stopConnectionTimer();
        
        if (window.showNotification) {
            showNotification('Disconnected', 'VPN connection ended', 'info');
        }
    }
};

// Load real data when app starts
document.addEventListener('DOMContentLoaded', async () => {
    console.log('API Bridge loaded - connecting to Python backend...');
    
    // Check if backend is reachable
    try {
        const status = await API.getStatus();
        console.log('Backend connection successful', status);
    } catch (error) {
        console.warn('Backend not reachable - using simulation mode');
        return; // Keep using simulation
    }
    
    // Load servers from backend
    const servers = await API.getServers();
    if (servers && servers.length > 0) {
        AppState.servers = servers;
        
        // Re-render server lists
        if (window.renderServerList) renderServerList(servers);
        if (window.renderPopularServers) renderPopularServers();
    }
    
    // Load settings
    const settings = await API.loadSettings();
    if (settings) {
        AppState.settings = { ...AppState.settings, ...settings };
        if (window.updateSettingsUI) updateSettingsUI();
    }
    
    // Check current connection status
    const status = await API.getStatus();
    if (status?.connected) {
        AppState.connection.isConnected = true;
        AppState.connection.currentServer = AppState.servers.find(s => s.id === status.server);
        AppState.connection.ipAddress = status.ip;
        AppState.connection.startTime = status.start_time * 1000;
        AppState.connection.bytesDownloaded = status.bytes_in || 0;
        AppState.connection.bytesUploaded = status.bytes_out || 0;
        
        updateConnectionUI('connected', AppState.connection.currentServer);
        if (window.startConnectionTimer) startConnectionTimer();
    }
    
    // Auto-refresh ping times every 30 seconds
    setInterval(async () => {
        if (document.getElementById('servers')?.classList.contains('active')) {
            const pings = await API.refreshPings();
            if (pings && AppState.servers) {
                AppState.servers.forEach(server => {
                    if (pings[server.id]) {
                        server.ping = Math.round(pings[server.id]);
                    }
                });
                if (window.renderServerList) renderServerList(AppState.servers);
            }
        }
    }, 30000);
});