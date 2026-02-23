'use client';

export default function ChatMessage({ message }) {
  const isBlocked = message.status === 'BLOCKED';

  // Parse timestamp/date string - handles both ISO strings and millisecond timestamps
  const parseUTCTime = (dateValue) => {
    if (!dateValue) return new Date();
    // If it's a number, treat as milliseconds
    if (typeof dateValue === 'number') return new Date(dateValue);
    // If it's a string, try parsing as ISO or milliseconds
    const parsed = new Date(dateValue);
    return isNaN(parsed.getTime()) ? new Date() : parsed;
  };

  // Get full local time in user's timezone
  const getFullLocalTime = (dateValue) => {
    const date = parseUTCTime(dateValue);
    if (isNaN(date.getTime())) return 'Unknown time';
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

  // Get relative time (e.g., "5m ago") for tooltip
  const getTimeAgo = (dateValue) => {
    const date = parseUTCTime(dateValue);
    if (isNaN(date.getTime())) return '';
    
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return '';
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
        <span className="message-time" title={`${getTimeAgo(message.createdAt)} • ${getFullLocalTime(message.createdAt)}`}>
          {getFullLocalTime(message.createdAt)}
        </span>
      </div>
      <div className="message-content">{message.content}</div>
    </div>
  );
}

