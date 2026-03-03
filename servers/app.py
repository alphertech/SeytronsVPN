from flask import Flask, request, jsonify
from flask_cors import CORS
import subprocess
import json
import time
from datetime import datetime
import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

# Import your VPN engines (we'll create these next)
from engines.vpn_core import VPNCore
from engines.server_manager import ServerManager
from engines.stats_tracker import StatsTracker

app = Flask(__name__)
CORS(app)  # Allow your frontend to connect

# Initialize managers
vpn = VPNCore()
servers = ServerManager()
stats = StatsTracker()

# ========== API ENDPOINTS (matches your UI needs) ==========

@app.route('/api/vpn/status', methods=['GET'])
def get_status():
    """Get current VPN connection status"""
    return jsonify({
        'connected': vpn.is_connected(),
        'server': vpn.current_server,
        'ip': vpn.current_ip,
        'start_time': vpn.start_time,
        'bytes_in': vpn.bytes_in,
        'bytes_out': vpn.bytes_out
    })

@app.route('/api/vpn/connect', methods=['POST'])
def connect_vpn():
    """Connect to VPN server"""
    data = request.json
    server_id = data.get('server_id')
    protocol = data.get('protocol', 'WireGuard')
    
    success, message = vpn.connect(server_id, protocol)
    
    if success:
        # Start tracking stats
        stats.start_session(server_id)
        return jsonify({'success': True, 'message': message, 'ip': vpn.current_ip})
    else:
        return jsonify({'success': False, 'message': message})

@app.route('/api/vpn/disconnect', methods=['POST'])
def disconnect_vpn():
    """Disconnect from VPN"""
    success, message = vpn.disconnect()
    
    if success:
        # End stats tracking
        stats.end_session()
        return jsonify({'success': True, 'message': message})
    else:
        return jsonify({'success': False, 'message': message})

@app.route('/api/servers/list', methods=['GET'])
def get_servers():
    """Get list of all servers"""
    server_list = servers.get_all_servers()
    return jsonify(server_list)

@app.route('/api/servers/ping', methods=['GET'])
def get_server_pings():
    """Get real ping times for all servers"""
    pings = servers.get_ping_times()
    return jsonify(pings)

@app.route('/api/servers/favorite', methods=['POST'])
def favorite_server():
    """Save favorite server"""
    data = request.json
    server_id = data.get('server_id')
    is_favorite = data.get('favorite')
    
    servers.set_favorite(server_id, is_favorite)
    return jsonify({'success': True})

@app.route('/api/stats/usage', methods=['GET'])
def get_usage():
    """Get data usage statistics"""
    period = request.args.get('period', 'today')
    usage_data = stats.get_usage(period)
    return jsonify(usage_data)

@app.route('/api/stats/history', methods=['GET'])
def get_history():
    """Get connection history"""
    limit = request.args.get('limit', 10)
    history = stats.get_connection_history(limit)
    return jsonify(history)

@app.route('/api/settings/save', methods=['POST'])
def save_settings():
    """Save user settings"""
    data = request.json
    # Save to config file
    with open('user_settings.json', 'w') as f:
        json.dump(data, f)
    return jsonify({'success': True})

@app.route('/api/settings/load', methods=['GET'])
def load_settings():
    """Load user settings"""
    try:
        with open('user_settings.json', 'r') as f:
            settings = json.load(f)
    except:
        settings = {
            'protocol': 'WireGuard',
            'killSwitch': True,
            'dnsLeak': True,
            'ipv6Leak': True,
            'adBlocker': False,
            'darkMode': True
        }
    return jsonify(settings)

@app.route('/api/auth/login', methods=['POST'])
def login():
    """User login"""
    data = request.json
    email = data.get('email')
    password = data.get('password')
    
    # Add your authentication logic here
    # For now, return mock data matching your UI
    return jsonify({
        'success': True,
        'user': {
            'name': 'Alex Morgan',
            'email': email,
            'plan': 'Premium',
            'memberSince': 'Jan 2025',
            'devicesUsed': 3,
            'devicesTotal': 5
        }
    })

@app.route('/api/subscription/upgrade', methods=['POST'])
def upgrade_subscription():
    """Upgrade subscription plan"""
    data = request.json
    plan = data.get('plan')
    
    # Add payment processing logic here
    return jsonify({
        'success': True,
        'message': f'Upgraded to {plan} plan',
        'newPlan': plan
    })

if __name__ == '__main__':
    app.run(debug=True, port=5000)