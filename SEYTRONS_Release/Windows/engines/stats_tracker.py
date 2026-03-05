import json
import time
from datetime import datetime, timedelta
import os

class StatsTracker:
    def __init__(self):
        self.history_file = 'engines/history.json'
        self.current_session = None
        self.daily_usage = {}
        self.load_history()
    
    def load_history(self):
        """Load connection history from file"""
        try:
            with open(self.history_file, 'r') as f:
                data = json.load(f)
                self.history = data.get('sessions', [])
                self.daily_usage = data.get('daily', {})
        except FileNotFoundError:
            self.history = []
            self.daily_usage = self._generate_mock_daily()
    
    def save_history(self):
        """Save history to file"""
        data = {
            'sessions': self.history[-100:],  # Keep last 100 sessions
            'daily': self.daily_usage
        }
        with open(self.history_file, 'w') as f:
            json.dump(data, f, indent=2)
    
    def _generate_mock_daily(self):
        """Generate mock daily usage for testing"""
        daily = {}
        for i in range(6, -1, -1):
            date = (datetime.now() - timedelta(days=i)).strftime('%Y-%m-%d')
            daily[date] = {
                'download': round(random.uniform(0.5, 3.5), 1),
                'upload': round(random.uniform(0.1, 1.0), 1)
            }
        return daily
    
    def start_session(self, server_id):
        """Start tracking a new connection session"""
        self.current_session = {
            'server_id': server_id,
            'start_time': time.time(),
            'bytes_in': 0,
            'bytes_out': 0,
            'peak_speed': 0
        }
    
    def update_session(self, bytes_in, bytes_out):
        """Update current session with data usage"""
        if self.current_session:
            self.current_session['bytes_in'] += bytes_in
            self.current_session['bytes_out'] += bytes_out
            
            # Calculate current speed
            duration = time.time() - self.current_session['start_time']
            if duration > 0:
                speed = (bytes_in + bytes_out) / duration
                if speed > self.current_session.get('peak_speed', 0):
                    self.current_session['peak_speed'] = speed
    
    def end_session(self):
        """End current session and save to history"""
        if self.current_session:
            self.current_session['end_time'] = time.time()
            self.current_session['duration'] = self.current_session['end_time'] - self.current_session['start_time']
            
            # Add to history
            self.history.append(self.current_session)
            
            # Update daily usage
            date = datetime.now().strftime('%Y-%m-%d')
            if date not in self.daily_usage:
                self.daily_usage[date] = {'download': 0, 'upload': 0}
            
            self.daily_usage[date]['download'] += self.current_session['bytes_in'] / (1024 * 1024 * 1024)  # Convert to GB
            self.daily_usage[date]['upload'] += self.current_session['bytes_out'] / (1024 * 1024 * 1024)
            
            self.save_history()
            self.current_session = None
    
    def get_usage(self, period='today'):
        """Get usage statistics for charts"""
        if period == 'today':
            # Last 7 days for chart
            days = []
            data = []
            
            for i in range(6, -1, -1):
                date = (datetime.now() - timedelta(days=i)).strftime('%Y-%m-%d')
                day_name = (datetime.now() - timedelta(days=i)).strftime('%a')
                days.append(day_name)
                
                if date in self.daily_usage:
                    total = self.daily_usage[date]['download'] + self.daily_usage[date]['upload']
                    data.append(round(total, 1))
                else:
                    data.append(0)
            
            return {'days': days, 'data': data}
        
        elif period == 'month':
            # Last 30 days
            days = []
            data = []
            
            for i in range(29, -1, -1):
                date = (datetime.now() - timedelta(days=i)).strftime('%Y-%m-%d')
                if i % 5 == 0:  # Show every 5th day
                    days.append((datetime.now() - timedelta(days=i)).strftime('%d/%m'))
                else:
                    days.append('')
                
                if date in self.daily_usage:
                    total = self.daily_usage[date]['download'] + self.daily_usage[date]['upload']
                    data.append(round(total, 1))
                else:
                    data.append(0)
            
            return {'days': days, 'data': data}
        
        return {'days': [], 'data': []}
    
    def get_connection_history(self, limit=10):
        """Get recent connection history"""
        history = []
        
        for session in self.history[-limit:]:
            # Find server details (you'd get this from ServerManager)
            server_name = session.get('server_id', 'Unknown')
            
            # Format time ago
            start_time = datetime.fromtimestamp(session['start_time'])
            now = datetime.now()
            diff = now - start_time
            
            if diff.days > 0:
                time_ago = f"{diff.days} days ago"
            elif diff.seconds > 3600:
                time_ago = f"{diff.seconds // 3600} hours ago"
            elif diff.seconds > 60:
                time_ago = f"{diff.seconds // 60} minutes ago"
            else:
                time_ago = "Just now"
            
            # Format duration
            duration_seconds = session.get('duration', 0)
            if duration_seconds > 3600:
                duration = f"{duration_seconds // 3600}h {(duration_seconds % 3600) // 60}m"
            elif duration_seconds > 60:
                duration = f"{duration_seconds // 60}m"
            else:
                duration = f"{duration_seconds}s"
            
            # Format data used
            data_gb = (session.get('bytes_in', 0) + session.get('bytes_out', 0)) / (1024 * 1024 * 1024)
            
            history.append({
                'location': server_name.replace('-', ', ').title(),
                'time': time_ago,
                'duration': duration,
                'data': f"{data_gb:.1f} GB"
            })
        
        return history
    
    def get_totals(self):
        """Get total usage statistics"""
        total_download = sum(s.get('bytes_in', 0) for s in self.history)
        total_upload = sum(s.get('bytes_out', 0) for s in self.history)
        total_time = sum(s.get('duration', 0) for s in self.history)
        
        return {
            'download': total_download,
            'upload': total_upload,
            'duration': total_time,
            'download_gb': total_download / (1024 * 1024 * 1024),
            'upload_gb': total_upload / (1024 * 1024 * 1024),
            'duration_str': self._format_duration(total_time)
        }
    
    def _format_duration(self, seconds):
        """Format duration in seconds to readable string"""
        hours = int(seconds // 3600)
        minutes = int((seconds % 3600) // 60)
        
        if hours > 0:
            return f"{hours}h {minutes}m"
        else:
            return f"{minutes}m"

# Add random import for mock data
import random