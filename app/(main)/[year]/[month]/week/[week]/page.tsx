import WeekView from "@/app/(main)/component/calendar/WeekView";
import { parseWeekStartFromRoute } from "@/lib/date/parse";
import { Schedule } from "@/types/schedule";

type Props = {
  params: Promise<{
    year: string;
    month: string;
    week: string;
  }>;
};

export default async function Page({ params }: Props) {
  const { year, month, week } = await params;
  const result = parseWeekStartFromRoute(year, month, week);

  if (!result.ok) {
    return <div>Invalid params</div>;
  }

  const weekStart = result.value;
  const schedules: Schedule[] = [];

  return <WeekView currentDate={weekStart} />;
}
