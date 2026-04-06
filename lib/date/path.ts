export const buildMonthPath = (date: Date): string => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  return `/${y}/${m}`;
};

export const buildDayPath = (date: Date): string => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `/${y}/${m}/${d}`;
};

import { getWeekOfMonth } from "date-fns";

export const buildWeekPath = (date: Date): string => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const w = getWeekOfMonth(date, { weekStartsOn: 1 });

  return `/${y}/${m}/week/${w}`;
};