'use client';

import { signOut } from 'next-auth/react';
import { LogOut } from 'lucide-react';
import { useState } from 'react';

export default function LogoutButton() {
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    console.log('🔵 Logout clicked');
    setLoading(true);
    try {
      console.log('🔵 Calling signOut...');
      await signOut({ callbackUrl: '/login' });
      console.log('🔵 signOut returned');
    } catch (err) {
      console.error('🔴 signOut error:', err);
    }
  };

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      className="flex items-center gap-3 px-4 py-3 w-full text-gray-300 hover:bg-[#1a3355] hover:text-white rounded-lg transition-colors disabled:opacity-50"
    >
      <LogOut className="w-5 h-5" />
      <span>{loading ? 'Signing out...' : 'Logout'}</span>
    </button>
  );
}