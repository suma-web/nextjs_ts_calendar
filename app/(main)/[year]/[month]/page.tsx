import { createDate } from "@/lib/date";
import MonthView from "../../component/calendar/MonthView";
import { Schedule } from "@/types/schedule";

type Props = {
  params: Promise<{
    year: string;
    month: string;
  }>;
};

export default async function MonthPage({ params }: Props) {
  const { year, month } = await params;

  const date = createDate(year, month);

  const schedules: Schedule[] = [];

  return <MonthView currentDate={date} />;
}