import { differenceInCalendarWeeks, startOfMonth, startOfWeek } from "date-fns";

export const createDate = (
  year: string,
  month: string,
  day?: string
) => {
  return new Date(
    Number(year),
    Number(month) - 1,
    day ? Number(day) : 1
  );
};

export const getWeekOfMonth = (date: Date) => {
  const startMonth = startOfMonth(date);
  const startWeek = startOfWeek(startMonth, { weekStartsOn: 0 });

  return differenceInCalendarWeeks(date, startWeek) + 1;
};