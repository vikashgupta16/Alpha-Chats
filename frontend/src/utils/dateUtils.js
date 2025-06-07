// Helper function to format last seen time in a user-friendly way
export const formatLastSeen = (lastSeenDate) => {
  if (!lastSeenDate) return 'Unknown';
  
  const now = new Date();
  const lastSeen = new Date(lastSeenDate);
  const diffInMs = now - lastSeen;
  const diffInMinutes = Math.floor(diffInMs / 60000);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);
  
  // If the difference is invalid (future date), return formatted date
  if (diffInMs < 0) {
    return lastSeen.toLocaleString();
  }
  
  // Less than 1 minute ago
  if (diffInMinutes < 1) {
    return 'Just now';
  }
  
  // Less than 1 hour ago
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes === 1 ? '' : 's'} ago`;
  }
  
  // Less than 24 hours ago
  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours === 1 ? '' : 's'} ago`;
  }
  
  // Less than 7 days ago
  if (diffInDays < 7) {
    return `${diffInDays} day${diffInDays === 1 ? '' : 's'} ago`;
  }
  
  // More than a week ago - show formatted date
  return lastSeen.toLocaleDateString() + ' at ' + lastSeen.toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit' 
  });
};
