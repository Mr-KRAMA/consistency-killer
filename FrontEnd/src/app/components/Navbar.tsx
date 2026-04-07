import React from 'react';
import { Bell, Settings, User, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';

export function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="h-16 bg-background border-b border-border flex items-center justify-end px-6 gap-4 fixed top-0 right-0 left-64 z-10">
      <button className="p-2 hover:bg-secondary rounded-lg transition-colors">
        <Bell className="w-5 h-5" />
      </button>
      <button className="p-2 hover:bg-secondary rounded-lg transition-colors" onClick={() => navigate('/settings')}>
        <Settings className="w-5 h-5" />
      </button>
      <button className="flex items-center gap-2 px-3 py-2 hover:bg-secondary rounded-lg transition-colors">
        <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
          <User className="w-5 h-5" />
        </div>
        <span className="text-sm">{user?.name || 'User'}</span>
      </button>
      <button onClick={handleLogout} className="p-2 hover:bg-destructive/20 rounded-lg transition-colors" title="Logout">
        <LogOut className="w-5 h-5 text-destructive" />
      </button>
    </header>
  );
}
