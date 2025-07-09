import React, { useState } from 'react';
import { X, User, Bell, Palette, Database, Shield, Download, Upload } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

export const SettingsModal = ({ isOpen, onClose, user, onUpdateProfile }) => {
  const { isDark, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState('profile');
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    bio: user?.bio || '',
    avatar: user?.avatar || ''
  });
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    pushNotifications: false,
    dueDateReminders: true,
    taskAssignments: true
  });

  if (!isOpen) return null;

  const handleProfileSave = () => {
    onUpdateProfile(profileData);
    onClose();
  };

  const handleExportData = () => {
    const data = {
      boards: JSON.parse(localStorage.getItem(`kanban_boards_${user.id}`) || '[]'),
      lists: JSON.parse(localStorage.getItem(`kanban_lists_${user.id}`) || '[]'),
      cards: JSON.parse(localStorage.getItem(`kanban_cards_${user.id}`) || '[]')
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `kanban-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImportData = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target.result);
          if (data.boards && data.lists && data.cards) {
            localStorage.setItem(`kanban_boards_${user.id}`, JSON.stringify(data.boards));
            localStorage.setItem(`kanban_lists_${user.id}`, JSON.stringify(data.lists));
            localStorage.setItem(`kanban_cards_${user.id}`, JSON.stringify(data.cards));
            alert('Data imported successfully! Please refresh the page to see changes.');
          } else {
            alert('Invalid file format. Please select a valid backup file.');
          }
        } catch (error) {
          alert('Error reading file. Please ensure it\'s a valid JSON backup.');
        }
      };
      reader.readAsText(file);
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'data', label: 'Data', icon: Database },
    { id: 'privacy', label: 'Privacy', icon: Shield }
  ];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-4xl w-full h-[90vh] flex flex-col overflow-hidden">
        <div className="flex h-full">
          {/* Sidebar */}
          <div className="w-64 bg-gray-50 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 flex flex-col">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Settings</h2>
            </div>
            <nav className="p-4 flex-1 overflow-y-auto">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors mb-2 ${
                      activeTab === tab.id
                        ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="flex-1 flex flex-col">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between flex-shrink-0">
              <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">
                {tabs.find(tab => tab.id === activeTab)?.label}
              </h3>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              <div className="p-6">
              {activeTab === 'profile' && (
                <div className="space-y-6">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-20 h-20 bg-gradient-to-br from-teal-500 to-indigo-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold text-2xl">
                        {user.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <h4 className="text-lg font-medium text-gray-800 dark:text-gray-200">{user.name}</h4>
                      <p className="text-gray-600 dark:text-gray-400">{user.email}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={profileData.name}
                        onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={profileData.email}
                        onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Bio
                    </label>
                    <textarea
                      value={profileData.bio}
                      onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      rows={3}
                      placeholder="Tell us about yourself..."
                    />
                  </div>

                  <button
                    onClick={handleProfileSave}
                    className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    Save Changes
                  </button>
                </div>
              )}

              {activeTab === 'notifications' && (
                <div className="space-y-6">
                  <div className="space-y-4">
                    {Object.entries(notifications).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-gray-800 dark:text-gray-200">
                            {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {key === 'emailNotifications' && 'Receive updates via email'}
                            {key === 'pushNotifications' && 'Browser push notifications'}
                            {key === 'dueDateReminders' && 'Get reminded about upcoming due dates'}
                            {key === 'taskAssignments' && 'Notifications when tasks are assigned to you'}
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={value}
                            onChange={(e) => setNotifications({ ...notifications, [key]: e.target.checked })}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'appearance' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-800 dark:text-gray-200">Dark Mode</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Switch between light and dark themes
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isDark}
                        onChange={toggleTheme}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-4">Theme Preview</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-white border border-gray-200 rounded-lg">
                        <div className="w-full h-2 bg-blue-500 rounded mb-2"></div>
                        <div className="space-y-1">
                          <div className="w-3/4 h-2 bg-gray-300 rounded"></div>
                          <div className="w-1/2 h-2 bg-gray-300 rounded"></div>
                        </div>
                        <p className="text-xs text-gray-600 mt-2">Light Theme</p>
                      </div>
                      <div className="p-4 bg-gray-800 border border-gray-700 rounded-lg">
                        <div className="w-full h-2 bg-blue-400 rounded mb-2"></div>
                        <div className="space-y-1">
                          <div className="w-3/4 h-2 bg-gray-600 rounded"></div>
                          <div className="w-1/2 h-2 bg-gray-600 rounded"></div>
                        </div>
                        <p className="text-xs text-gray-400 mt-2">Dark Theme</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'data' && (
                <div className="space-y-6">
                  <div>
                    <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-4">Export Data</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                      Download a backup of all your boards, lists, and cards
                    </p>
                    <button
                      onClick={handleExportData}
                      className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      Export Data
                    </button>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-4">Import Data</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                      Restore your data from a backup file
                    </p>
                    <label className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors cursor-pointer inline-flex">
                      <Upload className="w-4 h-4" />
                      Import Data
                      <input
                        type="file"
                        accept=".json"
                        onChange={handleImportData}
                        className="hidden"
                      />
                    </label>
                  </div>

                  <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                    <h5 className="font-medium text-yellow-800 dark:text-yellow-400 mb-2">⚠️ Important</h5>
                    <p className="text-sm text-yellow-700 dark:text-yellow-300">
                      Importing data will overwrite your current boards, lists, and cards. Make sure to export your current data first if you want to keep it.
                    </p>
                  </div>
                </div>
              )}

              {activeTab === 'privacy' && (
                <div className="space-y-6">
                  <div>
                    <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-4">Data Storage</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                      Your data is stored locally in your browser. No information is sent to external servers.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-4">Clear All Data</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                      This will permanently delete all your boards, lists, cards, and account information.
                    </p>
                    <button
                      onClick={() => {
                        if (window.confirm('Are you sure you want to delete all your data? This action cannot be undone.')) {
                          localStorage.clear();
                          window.location.reload();
                        }
                      }}
                      className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
                    >
                      Clear All Data
                    </button>
                  </div>

                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                    <h5 className="font-medium text-red-800 dark:text-red-400 mb-2">⚠️ Warning</h5>
                    <p className="text-sm text-red-700 dark:text-red-300">
                      Clearing all data is irreversible. Make sure to export your data first if you want to keep it.
                    </p>
                  </div>
                </div>
              )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};