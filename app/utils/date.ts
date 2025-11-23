/**
 * Format a date to relative time (e.g., "2 days ago", "3 months ago")
 * @param dateString - ISO date string
 * @returns Relative time string
 * @example
 * formatRelativeDate('2024-11-20') // "3 days ago"
 */
export function formatRelativeDate(dateString: string): string {
  const now = new Date()
  const date = new Date(dateString)
  const diffMs = now.getTime() - date.getTime()
  const diffSeconds = Math.floor(diffMs / 1000)
  const diffMinutes = Math.floor(diffSeconds / 60)
  const diffHours = Math.floor(diffMinutes / 60)
  const diffDays = Math.floor(diffHours / 24)
  const diffMonths = Math.floor(diffDays / 30)
  const diffYears = Math.floor(diffDays / 365)

  if (diffSeconds < 60) {
    return 'just now'
  } else if (diffMinutes < 60) {
    return `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''} ago`
  } else if (diffHours < 24) {
    return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`
  } else if (diffDays < 30) {
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`
  } else if (diffMonths < 12) {
    return `${diffMonths} month${diffMonths > 1 ? 's' : ''} ago`
  } else {
    return `${diffYears} year${diffYears > 1 ? 's' : ''} ago`
  }
}

/**
 * Format view count with K/M suffixes
 * @param count - View count number
 * @returns Formatted string (e.g., "1.2K", "45M")
 * @example
 * formatViewCount(1234) // "1.2K"
 * formatViewCount(1500000) // "1.5M"
 */
export function formatViewCount(count: number): string {
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1)}M`
  }
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}K`
  }
  return count.toString()
}
