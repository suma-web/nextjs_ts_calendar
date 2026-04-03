import WeekView from "@/app/(main)/component/calendar/WeekView";
import { Schedule } from "@/types/schedule";
import {
  startOfMonth,
  startOfWeek,
  addDays,
  addWeeks,
  isValid,
} from "date-fns";

type Props = {
  params: Promise<{
    year: string;
    month: string;
    week: string;
  }>;
};

export default async function Page({ params }: Props) {
  const { year, month, week } = await params;

  const y = Number(year);
  const m = Number(month);
  const w = Number(week);

  if (!y || !m || !w || isNaN(y) || isNaN(m) || isNaN(w)) {
    return <div>Invalid params</div>;
  }

  const baseDate = new Date(y, m - 1, 1);

  const monthStart = startOfMonth(baseDate);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });

  const weekStart = addWeeks(calendarStart, w - 1);

  if (!isValid(weekStart)) {
    return <div>Invalid weekStart</div>;
  }

  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const schedules: Schedule[] = [];

  return <WeekView currentDate={weekStart} />;
}