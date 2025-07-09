import React, { useState } from 'react';
import { LoginForm } from './LoginForm';
import { RegisterForm } from './RegisterForm';

export const AuthPage = ({ onLogin, onRegister }) => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-emerald-50 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900 flex items-center justify-center p-4 relative">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 via-purple-400/20 to-emerald-400/20 dark:from-blue-600/10 dark:via-purple-600/10 dark:to-emerald-600/10"></div>
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-emerald-50 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900"></div>
      <div className="relative z-10">
        {isLogin ? (
          <LoginForm 
            onLogin={onLogin}
            onToggleMode={() => setIsLogin(false)}
          />
        ) : (
          <RegisterForm 
            onRegister={onRegister}
            onToggleMode={() => setIsLogin(true)}
          />
        )}
      </div>
    </div>
  );
};