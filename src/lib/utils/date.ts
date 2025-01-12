import { format, formatDistanceToNow } from "date-fns"

export function formatDate(date: string | Date) {
  return format(new Date(date), "PP")
}

export function formatTime(date: string | Date) {
  return format(new Date(date), "p")
}

export function formatDateTime(date: string | Date) {
  return format(new Date(date), "PPp")
}

export function formatRelativeTime(date: string | Date) {
  return formatDistanceToNow(new Date(date), { addSuffix: true })
}

export function formatDateRange(start: string | Date, end: string | Date) {
  return `${formatDate(start)} - ${formatDate(end)}`
}
