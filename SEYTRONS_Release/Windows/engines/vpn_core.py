import time
import random
import threading
import subprocess
import os
import platform

class VPNCore:
    def __init__(self):
        self.connected = False
        self.current_server = None
        self.current_ip = None
        self.start_time = None
        self.bytes_in = 0
        self.bytes_out = 0
        self.protocol = "WireGuard"
        self.process = None
        self._monitoring = False
        
    def is_connected(self):
        return self.connected
    
    def connect(self, server_id, protocol="WireGuard"):
        """Connect to VPN server"""
        if self.connected:
            return False, "Already connected"
        
        self.protocol = protocol
        self.current_server = server_id
        
        # Here you would actually call OpenVPN or WireGuard
        # For now, we'll simulate
        success = self._establish_tunnel(server_id)
        
        if success:
            self.connected = True
            self.current_ip = f"10.8.0.{random.randint(2, 100)}"
            self.start_time = time.time()
            self.bytes_in = 0
            self.bytes_out = 0
            self._start_monitoring()
            return True, f"Connected to {server_id}"
        else:
            return False, "Connection failed"
    
    def disconnect(self):
        """Disconnect from VPN"""
        if not self.connected:
            return False, "Not connected"
        
        # Kill the VPN process
        if self.process:
            self.process.terminate()
            self.process = None
        
        self.connected = False
        self.current_server = None
        self.current_ip = None
        self.start_time = None
        self._monitoring = False
        
        return True, "Disconnected"
    
    def _establish_tunnel(self, server_id):
        """Actually establish VPN tunnel"""
        system = platform.system()
        
        try:
            if self.protocol == "WireGuard":
                # Example: wireguard-quick up wg0
                config_file = f"configs/{server_id}.conf"
                if os.path.exists(config_file):
                    if system == "Windows":
                        self.process = subprocess.Popen(
                            ["wg-quick", "up", config_file],
                            stdout=subprocess.PIPE,
                            stderr=subprocess.PIPE
                        )
                    elif system == "Linux":
                        self.process = subprocess.Popen(
                            ["sudo", "wg-quick", "up", config_file],
                            stdout=subprocess.PIPE,
                            stderr=subprocess.PIPE
                        )
                    return True
                    
            elif self.protocol == "OpenVPN":
                config_file = f"configs/{server_id}.ovpn"
                if os.path.exists(config_file):
                    if system == "Windows":
                        self.process = subprocess.Popen(
                            ["openvpn", "--config", config_file],
                            stdout=subprocess.PIPE,
                            stderr=subprocess.PIPE
                        )
                    elif system == "Linux":
                        self.process = subprocess.Popen(
                            ["sudo", "openvpn", "--config", config_file],
                            stdout=subprocess.PIPE,
                            stderr=subprocess.PIPE
                        )
                    return True
            
            # If no config files, simulate for testing
            return self._simulate_connection(server_id)
            
        except Exception as e:
            print(f"Connection error: {e}")
            return self._simulate_connection(server_id)
    
    def _simulate_connection(self, server_id):
        """Simulate connection for testing"""
        time.sleep(2)  # Simulate connection delay
        return True
    
    def _start_monitoring(self):
        """Monitor data usage"""
        self._monitoring = True
        
        def monitor():
            while self._monitoring and self.connected:
                # Simulate data transfer
                self.bytes_in += random.randint(1000, 10000)
                self.bytes_out += random.randint(500, 5000)
                time.sleep(2)
        
        thread = threading.Thread(target=monitor, daemon=True)
        thread.start()
    
    def get_stats(self):
        """Get current connection stats"""
        if not self.connected:
            return None
        
        duration = time.time() - self.start_time if self.start_time else 0
        
        return {
            'connected': True,
            'server': self.current_server,
            'ip': self.current_ip,
            'duration': duration,
            'bytes_in': self.bytes_in,
            'bytes_out': self.bytes_out,
            'protocol': self.protocol
        }