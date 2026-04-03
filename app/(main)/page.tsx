"use client"

import { useState } from "react";
import { Schedule } from "@/types/schedule";
import MonthView from "./component/calendar/MonthView";
import WeekView from "./component/calendar/WeekView";
import DayView from "./component/calendar/DayView";

export default function CalenderHomePage() {
  const [currentDate] = useState(new Date());
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [viewMode] = useState<"day" | "week" | "month">("month");

  const updateSchedule = (id: string, newTitle: string) => {
    setSchedules((prev) =>
      prev.map((s) => (s.id === id ? { ...s, title: newTitle } : s)),
    );
  };

  const deleteSchedule = (id: string) => {
    setSchedules((prev) => prev.filter((s) => s.id !== id));
  };

  const commonProps = {
    currentDate,
    schedules,
    updateSchedule,
    deleteSchedule,
  };

  return (
    <>
      {viewMode === "day" && <DayView {...commonProps} />}

      {viewMode === "week" && <WeekView {...commonProps} />}

      {viewMode === "month" && <MonthView {...commonProps} />}
    </>
  );
}