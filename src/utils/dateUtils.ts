import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  isSameDay as sameDay,
  isSameMonth as sameMonth,
} from "date-fns";

export function getMonthDays(date: Date): Date[] {
  const start = startOfWeek(startOfMonth(date), { weekStartsOn: 0 });
  const end = endOfWeek(endOfMonth(date), { weekStartsOn: 0 });
  return eachDayOfInterval({ start, end });
}

export function formatDay(date: Date) {
  return format(date, "d");
}

export function formatMonthYear(date: Date) {
  return format(date, "MMMM yyyy");
}

export function isSameDay(d1: Date, d2: Date) {
  return sameDay(d1, d2);
}

export function isSameMonth(d1: Date, d2: Date) {
  return sameMonth(d1, d2);
}