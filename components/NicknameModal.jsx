'use client';

import { useState } from 'react';

export default function NicknameModal({ onConfirm }) {
  const [nickname, setNickname] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!nickname.trim()) {
      setError('Please enter a nickname');
      return;
    }

    if (nickname.trim().length < 2) {
      setError('Nickname must be at least 2 characters');
      return;
    }

    if (nickname.trim().length > 30) {
      setError('Nickname must be less than 30 characters');
      return;
    }

    onConfirm(nickname.trim());
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-primary to-secondary flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl p-10 max-w-md w-full transform transition-all">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2">
            Welcome!
          </h2>
          <p className="text-gray-600">Create a nickname to join the conversation</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label htmlFor="nickname" className="block text-gray-800 font-semibold mb-3">
              Choose Your Nickname
            </label>
            <input
              type="text"
              id="nickname"
              value={nickname}
              onChange={(e) => {
                setNickname(e.target.value);
                setError('');
              }}
              placeholder="e.g., Alex, Luna, Dev..."
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary focus:ring-opacity-15 transition-all text-lg font-medium"
              autoFocus
              maxLength="30"
            />
            <div className="flex justify-between items-center mt-2">
              <div className="text-xs text-gray-500">
                {nickname.length}/30 characters
              </div>
              {error && <p className="text-red-600 text-sm font-medium">{error}</p>}
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-xl font-bold text-lg hover:shadow-xl transition-all active:scale-95"
          >
            Start Chatting
          </button>
        </form>

        <p className="text-xs text-gray-500 mt-5 text-center">
          You can change your nickname anytime in the chat room
        </p>
      </div>
    </div>
  );
}
