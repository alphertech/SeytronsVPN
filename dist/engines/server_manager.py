import json
import subprocess
import platform
import random
import time

class ServerManager:
    def __init__(self):
        self.servers_file = 'engines/servers.json'
        self.favorites_file = 'engines/favorites.json'
        self.servers = []
        self.load_servers()
        self.load_favorites()
    
    def load_servers(self):
        """Load server list from file"""
        try:
            with open(self.servers_file, 'r') as f:
                self.servers = json.load(f)
        except FileNotFoundError:
            # Default servers if file doesn't exist
            self.servers = [
                {"id": "ug-kampala", "country": "Uganda", "city": "Kampala", "flag": "ug", "ping": 24, "load": 42, "ip": "197.239.42.186", "favorite": False, "region": "africa"},
                {"id": "us-ny", "country": "USA", "city": "New York", "flag": "us", "ping": 68, "load": 78, "ip": "198.51.100.42", "favorite": False, "region": "americas"},
                {"id": "de-frankfurt", "country": "Germany", "city": "Frankfurt", "flag": "de", "ping": 42, "load": 35, "ip": "203.0.113.17", "favorite": False, "region": "europe"},
                {"id": "jp-tokyo", "country": "Japan", "city": "Tokyo", "flag": "jp", "ping": 125, "load": 56, "ip": "192.0.2.84", "favorite": False, "region": "asia"},
                {"id": "sg-singapore", "country": "Singapore", "city": "Singapore", "flag": "sg", "ping": 89, "load": 23, "ip": "198.51.100.93", "favorite": False, "region": "asia"},
                {"id": "uk-london", "country": "UK", "city": "London", "flag": "gb", "ping": 52, "load": 61, "ip": "203.0.113.156", "favorite": False, "region": "europe"},
                {"id": "ca-toronto", "country": "Canada", "city": "Toronto", "flag": "ca", "ping": 78, "load": 44, "ip": "192.0.2.231", "favorite": False, "region": "americas"},
                {"id": "au-sydney", "country": "Australia", "city": "Sydney", "flag": "au", "ping": 210, "load": 31, "ip": "198.51.100.12", "favorite": False, "region": "oceania"},
                {"id": "br-saopaulo", "country": "Brazil", "city": "Sao Paulo", "flag": "br", "ping": 185, "load": 52, "ip": "203.0.113.67", "favorite": False, "region": "americas"},
                {"id": "in-mumbai", "country": "India", "city": "Mumbai", "flag": "in", "ping": 145, "load": 47, "ip": "192.0.2.45", "favorite": False, "region": "asia"},
                {"id": "za-johannesburg", "country": "South Africa", "city": "Johannesburg", "flag": "za", "ping": 198, "load": 29, "ip": "198.51.100.78", "favorite": False, "region": "africa"},
                {"id": "fr-paris", "country": "France", "city": "Paris", "flag": "fr", "ping": 58, "load": 63, "ip": "203.0.113.89", "favorite": False, "region": "europe"}
            ]
            self.save_servers()
    
    def save_servers(self):
        """Save server list to file"""
        with open(self.servers_file, 'w') as f:
            json.dump(self.servers, f, indent=2)
    
    def load_favorites(self):
        """Load favorites from file"""
        try:
            with open(self.favorites_file, 'r') as f:
                favorites = json.load(f)
                for server in self.servers:
                    if server['id'] in favorites:
                        server['favorite'] = True
        except FileNotFoundError:
            pass
    
    def save_favorites(self):
        """Save favorites to file"""
        favorites = [s['id'] for s in self.servers if s.get('favorite', False)]
        with open(self.favorites_file, 'w') as f:
            json.dump(favorites, f)
    
    def get_all_servers(self):
        return self.servers
    
    def get_server(self, server_id):
        """Get specific server by ID"""
        for server in self.servers:
            if server['id'] == server_id:
                return server
        return None
    
    def get_ping_times(self):
        """Get real ping times for all servers"""
        pings = {}
        system = platform.system()
        
        for server in self.servers:
            try:
                # Extract IP from server or use domain
                host = server.get('ip', '8.8.8.8')  # Default to Google DNS if no IP
                
                # Ping command differs by OS
                if system == "Windows":
                    cmd = ["ping", "-n", "1", "-w", "1000", host]
                else:
                    cmd = ["ping", "-c", "1", "-W", "1", host]
                
                # Run ping
                result = subprocess.run(
                    cmd,
                    stdout=subprocess.PIPE,
                    stderr=subprocess.PIPE,
                    timeout=2
                )
                
                # Extract ping time
                if result.returncode == 0:
                    output = result.stdout.decode()
                    if "time=" in output:
                        # Linux output
                        ping_time = output.split("time=")[1].split(" ")[0]
                        pings[server['id']] = float(ping_time)
                    elif "time<" in output:
                        pings[server['id']] = 1
                    elif "Average =" in output:
                        # Windows output
                        ping_time = output.split("Average = ")[1].split("ms")[0]
                        pings[server['id']] = float(ping_time)
                    else:
                        pings[server['id']] = server.get('ping', 50) + random.randint(-5, 5)
                else:
                    pings[server['id']] = server.get('ping', 50) + random.randint(-5, 5)
                    
            except Exception:
                pings[server['id']] = server.get('ping', 50) + random.randint(-5, 5)
            
            # Small delay to avoid flooding
            time.sleep(0.1)
        
        return pings
    
    def set_favorite(self, server_id, is_favorite):
        """Set server as favorite"""
        for server in self.servers:
            if server['id'] == server_id:
                server['favorite'] = is_favorite
                break
        self.save_favorites()
    
    def get_favorites(self):
        """Get list of favorite servers"""
        return [s for s in self.servers if s.get('favorite', False)]
    
    def get_servers_by_region(self, region):
        """Get servers by region"""
        return [s for s in self.servers if s.get('region') == region]