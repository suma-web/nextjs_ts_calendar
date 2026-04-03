import DayView from "@/app/(main)/component/calendar/DayView";
import { isValid } from "date-fns";

type Props = {
  params: Promise<{
    year: string;
    month: string;
    day: string;
  }>;
};

export default async function Page({ params }: Props) {
  const { year, month, day } = await params;

  const y = Number(year);
  const m = Number(month);
  const d = Number(day);

  if (!y || !m || !d || isNaN(y) || isNaN(m) || isNaN(d)) {
    return <div>Invalid params</div>;
  }

  const date = new Date(y, m - 1, d);

  if (!isValid(date)) {
    return <div>Invalid Date</div>;
  }

  return <DayView currentDate={date} />;
} 