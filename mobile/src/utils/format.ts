/**
 * Format a Date into a human-readable relative string.
 * e.g. "2 hours ago", "Yesterday", "Jun 28"
 */
export function formatRelativeDate(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHr = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHr / 24);

  if (diffSec < 60) return 'Just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHr < 24) return `${diffHr}h ago`;
  if (diffDay === 1) return 'Yesterday';
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
}

/**
 * Format confidence score as a display string with color hint.
 */
export function confidenceLabel(score: number): { label: string; color: string } {
  if (score >= 95) return { label: 'Excellent', color: '#22C55E' };
  if (score >= 85) return { label: 'Good', color: '#84CC16' };
  if (score >= 70) return { label: 'Fair', color: '#F59E0B' };
  return { label: 'Low', color: '#EF4444' };
}

/**
 * Truncate a string to maxLength with ellipsis.
 */
export function truncate(text: string, maxLength = 40): string {
  return text.length > maxLength ? `${text.slice(0, maxLength)}…` : text;
}
