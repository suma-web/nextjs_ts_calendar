import {
  startOfMonth,
  startOfWeek,
  addWeeks,
  isValid,
} from "date-fns";

type Ok<T> = { ok: true; value: T };
type Err = { ok: false };

type Result<T> = Ok<T> | Err;

export const parsePositiveInt = (raw: string): number | null => {
  const n = Number(raw);
  if (!Number.isInteger(n) || n <= 0) return null;
  return n;
};

export const parseYearMonth = (
  yearRaw: string,
  monthRaw: string
): Result<{ year: number; month: number }> => {
  const year = parsePositiveInt(yearRaw);
  const month = parsePositiveInt(monthRaw);

  if (!year || !month || month > 12) return { ok: false };

  return { ok: true, value: { year, month } };
};

export const parseCalendarDay = (
  yearRaw: string,
  monthRaw: string,
  dayRaw: string
): Result<Date> => {
  const ym = parseYearMonth(yearRaw, monthRaw);
  const day = parsePositiveInt(dayRaw);

  if (!ym.ok || !day) return { ok: false };

  const date = new Date(ym.value.year, ym.value.month - 1, day);

  if (!isValid(date)) return { ok: false };

  return { ok: true, value: date };
};

export const parseMonthFirstDay = (
  yearRaw: string,
  monthRaw: string
): Result<Date> => {
  const ym = parseYearMonth(yearRaw, monthRaw);
  if (!ym.ok) return { ok: false };

  const date = new Date(ym.value.year, ym.value.month - 1, 1);

  if (!isValid(date)) return { ok: false };

  return { ok: true, value: date };
};

export const parseWeekStartFromRoute = (
  yearRaw: string,
  monthRaw: string,
  weekRaw: string
): Result<Date> => {
  const ym = parseYearMonth(yearRaw, monthRaw);
  const week = parsePositiveInt(weekRaw);

  if (!ym.ok || !week) return { ok: false };

  const baseDate = new Date(ym.value.year, ym.value.month - 1, 1);

  const monthStart = startOfMonth(baseDate);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });

  const weekStart = addWeeks(calendarStart, week - 1);

  if (!isValid(weekStart)) return { ok: false };

  return { ok: true, value: weekStart };
};