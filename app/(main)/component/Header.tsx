"use client";

import { addDays, addMonths, addWeeks, format } from "date-fns";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useCurrentDate } from "@/lib/useCurrentDate";
import { buildDayPath, buildMonthPath, buildWeekPath } from "@/lib/date/path";

const Header = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const currentDate = useCurrentDate();

  const segments = pathname.split("/");
  const year = segments[1];
  const month = segments[2];
  const thirdSegment = segments[3];

  const viewMode: "day" | "week" | "month" = pathname.includes("/week/")
    ? "week"
    : year && month && thirdSegment
      ? "day"
      : "month";

  const nowDate = format(currentDate, "yyyy年 M月");
  const dateName =
    viewMode === "day" ? "日" : viewMode === "week" ? "週" : "月";

  const goToDate = (date: Date, mode: "day" | "week" | "month") => {
    if (mode === "day") return router.push(buildDayPath(date));
    if (mode === "week") return router.push(buildWeekPath(date));
    return router.push(buildMonthPath(date));
  };

  const handleToday = () => {
    goToDate(new Date(), viewMode);
  };

  const handlePrev = () => {
    if (viewMode === "day") {
      goToDate(addDays(currentDate, -1), "day");
    } else if (viewMode === "week") {
      goToDate(addWeeks(currentDate, -1), "week");
    } else {
      goToDate(addMonths(currentDate, -1), "month");
    }
  };

  const handleNext = () => {
    if (viewMode === "day") {
      goToDate(addDays(currentDate, 1), "day");
    } else if (viewMode === "week") {
      goToDate(addWeeks(currentDate, 1), "week");
    } else {
      goToDate(addMonths(currentDate, 1), "month");
    }
  };

  return (
    <header className="flex justify-between">
      <div className="inline-flex space-x-10">
        <h2 className="px-8 text-xl font-medium flex items-center justify-center">
          Next.jsでカレンダー
        </h2>

        <button
          className="m-5 px-10 bg-white-700 border-1 border-gray-700/50 rounded-3xl hover:bg-gray-200"
          onClick={handleToday}
        >
          今日
        </button>

        <div className="m-3">
          <button
            className="bg-white-300 hover:bg-gray-200 text-gray-800 font-bold py-2 px-2 rounded-l my-3"
            onClick={handlePrev}
          >
            ＜
          </button>
          <button
            className="bg-white-300 hover:bg-gray-200 text-gray-800 font-bold py-2 px-2 rounded-r my-3"
            onClick={handleNext}
          >
            ＞
          </button>
        </div>

        <p className="text-2xl flex items-center justify-center">{nowDate}</p>
      </div>

      <nav className="text-black inline-flex m-3 relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="px-16 rounded hover:bg-gray-200"
        >
          {dateName}
        </button>

        {isOpen && (
          <div className="absolute w-37 right-0 my-20 z-50 bg-white-700 max-h-100 mx-2">
            <div className="flex flex-col bg-white rounded shadow-lg text-center">
              <button
                className="no-underline hover:bg-gray-200 p-3 rounded"
                onClick={() => {
                  setIsOpen(false);
                  goToDate(currentDate, "day");
                }}
              >
                日
              </button>

              <button
                className="no-underline hover:bg-gray-200 p-3 rounded"
                onClick={() => {
                  setIsOpen(false);
                  goToDate(currentDate, "week");
                }}
              >
                週
              </button>

              <button
                className="no-underline hover:bg-gray-200 p-3 rounded"
                onClick={() => {
                  setIsOpen(false);
                  goToDate(currentDate, "month");
                }}
              >
                月
              </button>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
