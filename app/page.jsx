'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import ChatMessage from '@/components/ChatMessage';
import NicknameModal from '@/components/NicknameModal';

export default function Page() {
  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [username, setUsername] = useState('');
  const [showNicknameModal, setShowNicknameModal] = useState(true);

  // Initialize username from localStorage
  useEffect(() => {
    const savedUsername = localStorage.getItem('chatUsername');
    if (savedUsername) {
      setUsername(savedUsername);
      setShowNicknameModal(false);
      fetchMessages();
    }
  }, []);

  const handleNicknameSet = (nickname) => {
    localStorage.setItem('chatUsername', nickname);
    setUsername(nickname);
    setShowNicknameModal(false);
    fetchMessages();
  };

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/chat');
      setMessages(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to load messages');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!content.trim()) {
      setError('Message cannot be empty');
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post('/api/chat', {
        username: username,
        content: content,
        status: '',
      });

      // Add new message to the top of the list
      setMessages([response.data, ...messages]);
      setContent('');
      setError(null);
    } catch (err) {
      setError('Failed to send message');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChangeNickname = () => {
    setShowNicknameModal(true);
  };

  if (showNicknameModal) {
    return <NicknameModal onConfirm={handleNicknameSet} />;
  }

  // Get user avatar initial
  const userInitial = username ? username.charAt(0).toUpperCase() : '?';

  return (
    <div className="chat-wrapper">
      <div className="chat-header">
        <h1>Global Chat</h1>
        <p>Real-time conversations</p>
        <div className="chat-header-controls">
          <div className="user-info">
            <div className="user-avatar">{userInitial}</div>
            <span>{username}</span>
          </div>
          <button
            onClick={handleChangeNickname}
            className="change-nickname-btn"
          >
            Change
          </button>
        </div>
      </div>

      <form className="message-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Type a message..."
            disabled={loading}
            rows="2"
            required
          />
        </div>
        <button type="submit" disabled={loading} className="submit-btn">
          {loading ? 'Sending...' : 'Send'}
        </button>
      </form>

      {error && <div className="error-message">{error}</div>}

      <div className="messages-section">
        <h2>Messages ({messages.length})</h2>
        {messages.length === 0 ? (
          <div className="no-messages">
            <p>No messages yet. Start the conversation!</p>
          </div>
        ) : (
          <div className="messages-list">
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

