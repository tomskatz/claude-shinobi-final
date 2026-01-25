/**
 * Simple date formatting utility
 * Temporary replacement for date-fns
 */

export function formatDistanceToNow(date: Date, options?: { addSuffix?: boolean }): string {
  const now = new Date()
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (seconds < 0) return 'just now'

  const intervals = [
    { label: 'year', seconds: 31536000 },
    { label: 'month', seconds: 2592000 },
    { label: 'day', seconds: 86400 },
    { label: 'hour', seconds: 3600 },
    { label: 'minute', seconds: 60 },
    { label: 'second', seconds: 1 },
  ]

  for (const interval of intervals) {
    const count = Math.floor(seconds / interval.seconds)
    if (count >= 1) {
      const label = count === 1 ? interval.label : `${interval.label}s`
      const result = `${count} ${label}`
      return options?.addSuffix ? `${result} ago` : result
    }
  }

  return 'just now'
}
