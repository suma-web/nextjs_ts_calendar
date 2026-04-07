"use client";

import { buildMonthPath } from "@/lib/date/path";
import { useCurrentDate } from "@/lib/useCurrentDate";
import {
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isToday,
  startOfMonth,
  startOfWeek,
  addMonths,
} from "date-fns";
import { useRouter } from "next/navigation";

const DateShowLeft = () => {
  const router = useRouter();

  const currentDate = useCurrentDate();

  const weekDays = ["日", "月", "火", "水", "木", "金", "土"];

  const nowDate = format(currentDate, "yyyy年 M月");

  const days = eachDayOfInterval({
    start: startOfWeek(startOfMonth(currentDate)),
    end: endOfWeek(endOfMonth(currentDate)),
  });

  const handlePrevMonth = () => {
    const newDate = addMonths(currentDate, -1);
    router.push(buildMonthPath(newDate));
  };

  const handleNextMonth = () => {
    const newDate = addMonths(currentDate, 1);
    router.push(buildMonthPath(newDate));
  };

  return (
    <aside className="w-1/10 p-5 min-w-80">
      <div className="flex justify-between m-1">
        {nowDate}
        <div className="flex gap-4">
          <button
            className="hover:bg-gray-300 text-gray-600 rounded-full"
            onClick={handlePrevMonth}
          >
            ＜
          </button>
          <button
            className="hover:bg-gray-300 text-gray-600 rounded-full"
            onClick={handleNextMonth}
          >
            ＞
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 my-4">
        {weekDays.map((wd) => (
          <div key={wd} className="text-center">
            {wd}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2">
        {days.map((day) => {
          const isCurrentMonth = day.getMonth() === currentDate.getMonth();

          return (
            <div
              key={day.toString()}
              className={`rounded-full text-center cursor-pointer ${
                isToday(day)
                  ? "bg-blue-600 text-white"
                  : isCurrentMonth
                    ? "text-black"
                    : "text-gray-300"
              }`}
              onClick={() => {
                router.push(
                  `/${day.getFullYear()}/${String(day.getMonth() + 1).padStart(2, "0")}/${String(day.getDate()).padStart(2, "0")}`,
                );
              }}
            >
              {format(day, "d")}
            </div>
          );
        })}
      </div>
    </aside>
  );
};

export default DateShowLeft;
