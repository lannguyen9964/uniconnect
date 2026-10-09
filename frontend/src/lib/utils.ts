import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
};

export const formatOnlineTime = (date: Date) => {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();

  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffMonths = Math.floor(diffDays / 30);
  const diffYears = Math.floor(diffDays / 365);

  if (diffMins < 60) {
    return `${diffMins}m`; // 5m, 45m
  } else if (diffHours < 24) {
    return `${diffHours}h`; // 3h, 20h
  } else if (diffDays < 30) {
    return `${diffDays}d`; // 1d, 12d
  } else if (diffMonths < 12) {
    return `${diffMonths}m`; // 1m, 2m, 11m
  } else {
    return `${diffYears}y`; // 1y, 2y
  }
};

/** midnight of the day a date falls on, in local time */
const startOfDay = (date: Date) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();

export const formatMessageTime = (date: Date) => {
  const now = new Date();

  // whole days between the two calendar dates, so month and year ends behave
  const daysAgo = Math.round((startOfDay(now) - startOfDay(date)) / 86400000);

  const isToday = daysAgo === 0;
  const isYesterday = daysAgo === 1;

  const timeStr = date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  if (isToday) {
    return timeStr; // e.g. "2:35 PM"
  } else if (isYesterday) {
    return `Yesterday ${timeStr}`; // e.g. "Yesterday 11:10 PM"
  } else if (date.getFullYear() === now.getFullYear()) {
    // e.g. "Sep 22, 9:15 AM"
    return `${date.toLocaleDateString("en-US", { month: "short", day: "numeric" })}, ${timeStr}`;
  } else {
    // e.g. "Dec 15, 2023, 6:40 PM"
    return `${date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}, ${timeStr}`;
  }
};