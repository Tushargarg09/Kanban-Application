import React, { useState } from 'react';
import { LogOut, Settings, User as UserIcon, Sun, Moon } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { SettingsModal } from '../Settings/SettingsModal';

export const Header = ({ user, onLogout }) => {
  const { isDark, toggleTheme } = useTheme();
  const [showSettings, setShowSettings] = useState(false);

  const handleUpdateProfile = (profileData) => {
    // Update user profile in localStorage
    const users = JSON.parse(localStorage.getItem('kanban_users') || '[]');
    const updatedUsers = users.map(u => 
      u.id === user.id ? { ...u, ...profileData } : u
    );
    localStorage.setItem('kanban_users', JSON.stringify(updatedUsers));
    
    const updatedUser = { ...user, ...profileData };
    localStorage.setItem('kanban_user', JSON.stringify(updatedUser));
    
    window.location.reload();
  };

  return (
    <>
      <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold text-lg">
                {user.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <h2 className="font-semibold text-gray-800 dark:text-gray-200">Welcome back, {user.name}</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">{user.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={toggleTheme}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
              title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDark ? (
                <Sun className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              ) : (
                <Moon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              )}
            </button>
            <button 
              onClick={() => setShowSettings(true)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
              title="Settings"
            >
              <Settings className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
            <button
              onClick={onLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <SettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        user={user}
        onUpdateProfile={handleUpdateProfile}
      />
    </>
  );
};