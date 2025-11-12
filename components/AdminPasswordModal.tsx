'use client';

import { useState, useEffect } from 'react';

interface AdminPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AdminPasswordModal({ isOpen, onClose, onSuccess }: AdminPasswordModalProps) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [isBlocked, setIsBlocked] = useState(false);

  const correctPassword = '2025';
  const maxAttempts = 3;
  const blockDuration = 30000; // 30초

  useEffect(() => {
    if (isOpen) {
      setPassword('');
      setError('');
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isBlocked) {
      setError('너무 많은 시도로 인해 30초간 차단되었습니다.');
      return;
    }

    if (password === correctPassword) {
      setError('');
      setAttempts(0);
      setPassword('');
      onSuccess();
      onClose();
    } else {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      setPassword('');
      
      if (newAttempts >= maxAttempts) {
        setIsBlocked(true);
        setError(`${maxAttempts}회 실패로 30초간 차단됩니다.`);
        
        setTimeout(() => {
          setIsBlocked(false);
          setAttempts(0);
          setError('');
        }, blockDuration);
      } else {
        setError(`비밀번호가 틀렸습니다. (${newAttempts}/${maxAttempts})`);
      }
    }
  };

  const handleKeyPress = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  useEffect(() => {
    if (isOpen) {
      window.addEventListener('keydown', handleKeyPress);
      return () => window.removeEventListener('keydown', handleKeyPress);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 shadow-xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-calmBrown flex items-center gap-2">
            🔒 관리자 인증
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              관리자 비밀번호를 입력하세요
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isBlocked}
              placeholder="비밀번호 입력"
              className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-softOrange focus:border-transparent transition-all ${
                error ? 'border-red-500' : 'border-gray-300'
              } ${isBlocked ? 'bg-gray-100 cursor-not-allowed' : ''}`}
              autoFocus
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={isBlocked || !password.trim()}
              className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
                isBlocked || !password.trim()
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-calmBrown text-white hover:bg-opacity-90'
              }`}
            >
              {isBlocked ? '차단됨' : '확인'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 px-4 border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-all"
            >
              취소
            </button>
          </div>
        </form>

        <div className="mt-6 text-xs text-gray-500 text-center">
          연속 {maxAttempts}회 실패 시 30초간 차단됩니다
        </div>
      </div>
    </div>
  );
}