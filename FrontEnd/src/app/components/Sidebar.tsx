import React from 'react';
import { Link, useLocation } from 'react-router';
import { LayoutDashboard, ListTodo, BarChart3, FileText, Zap, Dumbbell, UtensilsCrossed, Settings as SettingsIcon } from 'lucide-react';

const navItems = [
  { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/tasks', icon: ListTodo, label: 'Tasks' },
  { path: '/fitness', icon: Dumbbell, label: 'Fitness' },
  { path: '/diet', icon: UtensilsCrossed, label: 'Diet' },
  { path: '/analytics', icon: BarChart3, label: 'Analytics' },
  { path: '/reports', icon: FileText, label: 'Reports' }
];

export function Sidebar() {
  const location = useLocation();
  
  return (
    <aside className="w-64 h-screen bg-sidebar border-r border-sidebar-border flex flex-col fixed left-0 top-0">
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-destructive to-destructive/70 rounded-lg flex items-center justify-center shadow-lg">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-semibold tracking-tight">Consistency Killer</span>
        </div>
      </div>
      
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                isActive 
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground shadow-sm' 
                  : 'text-sidebar-foreground hover:bg-sidebar-accent/50 hover:translate-x-1'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
        
        <div className="pt-4">
          <Link
            to="/settings"
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
              location.pathname === '/settings'
                ? 'bg-sidebar-accent text-sidebar-accent-foreground shadow-sm'
                : 'text-sidebar-foreground hover:bg-sidebar-accent/50 hover:translate-x-1'
            }`}
          >
            <SettingsIcon className="w-5 h-5" />
            <span>Settings</span>
          </Link>
        </div>
      </nav>
      
      <div className="p-4 border-t border-sidebar-border">
        <div className="text-xs text-muted-foreground">
          v2.0.0 - Enhanced Edition
        </div>
      </div>
    </aside>
  );
}