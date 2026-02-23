'use client';

export default function ChatMessage({ message }) {
  const isBlocked = message.status === 'BLOCKED';

  // Parse UTC timestamp from server and convert to user's local time
  const parseUTCTime = (isoString) => {
    // ISO string is in UTC, new Date() converts to user's local timezone
    return new Date(isoString);
  };

  // Get full local time for tooltip
  const getFullLocalTime = (isoString) => {
    const date = parseUTCTime(isoString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
      timeZoneName: 'short'
    });
  };

  // Format timestamp to local time - compact version
  const formatTime = (isoString) => {
    const date = parseUTCTime(isoString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  // Get user avatar initial
  const userInitial = message.username ? message.username.charAt(0).toUpperCase() : '?';
  const avatarColor = `hsl(${message.username.charCodeAt(0) * 7 % 360}, 70%, 60%)`;

  if (isBlocked) {
    return (
      <div className="message-item blocked">
        <div className="message-header">
          <div className="message-username">
            <div className="message-avatar" style={{ background: avatarColor }}>
              {userInitial}
            </div>
            <span>{message.username}</span>
          </div>
          <span className="message-time" title={getFullLocalTime(message.createdAt)}>
            {formatTime(message.createdAt)}
          </span>
        </div>
        <div className="message-blocked-content">
          {message.rejectionReason || 'Message blocked'}
        </div>
        {/* <div className="mt-1">
          <span className="message-status blocked">BLOCKED</span>
        </div> */}
      </div>
    );
  }

  return (
    <div className="message-item approved">
      <div className="message-header">
        <div className="message-username">
          <div className="message-avatar" style={{ background: avatarColor }}>
            {userInitial}
          </div>
          <span>{message.username}</span>
        </div>
        <span className="message-time" title={getFullLocalTime(message.createdAt)}>
          {formatTime(message.createdAt)}
        </span>
      </div>
      <div className="message-content">{message.content}</div>
    </div>
  );
}

