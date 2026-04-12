/**
 * Formats an ISO datetime string into a human-readable show time.
 * @param datetime - ISO 8601 string from the API (e.g. "2026-04-15T14:30:00Z")
 * @returns e.g. "Apr 15, 2026 · 2:30 PM"
 */
export function formatShowtime(datetime: string): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(new Date(datetime));
}

/**
 * Formats an ISO datetime string as a short date.
 * @returns e.g. "Apr 15, 2026"
 */
export function formatDate(datetime: string): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(datetime));
}

/**
 * Returns only the time portion of an ISO datetime string.
 * @returns e.g. "2:30 PM"
 */
export function formatTime(datetime: string): string {
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(new Date(datetime));
}

/**
 * Returns true when the show's start time is in the past.
 * @param datetime - ISO 8601 string
 */
export function isShowExpired(datetime: string): boolean {
  return new Date(datetime).getTime() < Date.now();
}

/**
 * Returns a human-friendly relative time string.
 * @returns e.g. "in 3 days" or "2 hours ago"
 */
export function getRelativeTime(datetime: string): string {
  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
  const diffMs = new Date(datetime).getTime() - Date.now();
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));
  const diffHours = Math.round(diffMs / (1000 * 60 * 60));
  const diffMinutes = Math.round(diffMs / (1000 * 60));

  if (Math.abs(diffDays) >= 1) return rtf.format(diffDays, "day");
  if (Math.abs(diffHours) >= 1) return rtf.format(diffHours, "hour");
  return rtf.format(diffMinutes, "minute");
}
