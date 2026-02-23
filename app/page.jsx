'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import ChatMessage from '@/components/ChatMessage';
import NicknameModal from '@/components/NicknameModal';
import { subscribeToChatChannel, initPusher } from '@/lib/pusher';

export default function Page() {
  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [username, setUsername] = useState('');
  const [showNicknameModal, setShowNicknameModal] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  // Initialize username from localStorage and subscribe to Pusher
  useEffect(() => {
    const savedUsername = localStorage.getItem('chatUsername');

    if (savedUsername) {
      setUsername(savedUsername);
      setShowNicknameModal(false);
      fetchMessages();
      
      // Subscribe to real-time chat updates
      try {
        const pusher = initPusher();
        
        // Monitor connection state
        pusher.connection.bind('state_change', (change) => {
          setConnectionStatus(change.current);
          if (change.current === 'connected') {
            setIsConnected(true);
            setError(null); // Clear error when reconnected
          } else {
            setIsConnected(false);
          }
        });

        pusher.connection.bind('error', (error) => {
          // Don't show transient timeout errors (code 1006) - Pusher auto-recovers
          if (error?.code === 1006 || error?.data?.code === 1006) {
            console.warn('Temporary WebSocket disconnection, reconnecting...');
            return;
          }
          
          // Only show persistent errors
          setConnectionStatus('error');
          setError(`WebSocket error: ${error?.message || 'Unknown error'}`);
          setIsConnected(false);
        });

        const unsubscribe = subscribeToChatChannel((newMessage) => {
          setMessages((prev) => {
            return [newMessage, ...prev];
          });
        });

        // Return cleanup function
        return () => {
          if (unsubscribe) unsubscribe();
          if (pusher?.cleanup) pusher.cleanup();
          // Unbind error handlers to prevent memory leaks
          pusher.connection.unbind('state_change');
          pusher.connection.unbind('error');
        };
      } catch (err) {
        setError("WebSocket connection failed. Check your Soketi credentials.");
        setConnectionStatus('error');
        setIsConnected(false);
        return () => {}; // Return empty cleanup if error
      }
    }
  }, []);

  const handleNicknameSet = (nickname) => {
    localStorage.setItem('chatUsername', nickname);
    setUsername(nickname);
    setShowNicknameModal(false);
    fetchMessages();
    
    // Pusher subscription will be triggered by useEffect
    // when nickname state is saved to localStorage
  };

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/chat');
      setMessages(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to load messages');
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
      
      // Message will be received via Pusher, so we don't add it manually
      setContent('');
      setError(null);
    } catch (err) {
      setError('Failed to send message');
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
          <div className="connection-status">
            <div className={`status-indicator ${isConnected ? 'connected' : 'disconnected'}`}></div>
            <span>{isConnected ? 'Connected' : 'Connecting...'}</span>
          </div>
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

