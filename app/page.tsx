'use client';

import { useState, useEffect } from 'react';
import Hero from '@/components/Hero';
import Introduction from '@/components/Introduction';
import Members from '@/components/Members';
import MeetingRecords from '@/components/MeetingRecords';
import GoalsDashboard from '@/components/GoalsDashboard';
import ContactBoard from '@/components/ContactBoard';
import AdminMode from '@/components/AdminMode';
import AdminPasswordModal from '@/components/AdminPasswordModal';

export default function Home() {
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [showAdminButton, setShowAdminButton] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'A') {
        setShowAdminButton(!showAdminButton);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [showAdminButton]);

  return (
    <main className="min-h-screen relative">
      <Hero />
      <Introduction />
      <Members />
      <MeetingRecords />
      <GoalsDashboard />
      <ContactBoard />

      {showAdminButton && (
        <button
          onClick={() => setShowPasswordModal(true)}
          className="fixed bottom-8 right-8 bg-calmBrown text-white px-6 py-3 rounded-full shadow-lg hover:bg-opacity-90 transition-all z-40 flex items-center gap-2"
        >
          🔒 관리자 모드
        </button>
      )}

      <AdminPasswordModal 
        isOpen={showPasswordModal} 
        onClose={() => setShowPasswordModal(false)}
        onSuccess={() => setIsAdminMode(true)}
      />
      
      <AdminMode isOpen={isAdminMode} onClose={() => setIsAdminMode(false)} />
    </main>
  );
}