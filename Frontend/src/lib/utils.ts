/**
 * Utility functions
 */

/**
 * Get full URL for uploaded images
 * Since we're using Vite proxy, we can use relative URLs
 */
export const getImageUrl = (imagePath: string): string => {
  if (!imagePath) return '';
  // If it's already a full URL, return as is
  if (imagePath.startsWith('http')) return imagePath;
  // Otherwise, use relative URL (proxy will handle it)
  return imagePath;
};

/**
 * Format date to relative time (e.g., "2 hours ago")
 */
export const formatRelativeTime = (date: string | Date): string => {
  const now = new Date();
  const then = typeof date === 'string' ? new Date(date) : date;
  const diffInSeconds = Math.floor((now.getTime() - then.getTime()) / 1000);

  if (diffInSeconds < 60) return 'just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
  
  return then.toLocaleDateString();
};

/**
 * Get user display name
 */
export const getUserDisplayName = (user: { firstName?: string; lastName?: string; username: string }): string => {
  if (user.firstName && user.lastName) {
    return `${user.firstName} ${user.lastName}`;
  }
  return user.username;
};

/**
 * Get user initials for avatar
 */
export const getUserInitials = (user: { firstName?: string; lastName?: string; username: string }): string => {
  if (user.firstName) {
    return user.firstName[0].toUpperCase();
  }
  return user.username[0].toUpperCase();
};

