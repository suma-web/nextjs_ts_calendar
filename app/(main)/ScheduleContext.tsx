"use client";

import { createContext, useContext, useState } from "react";
import { Schedule } from "@/types/schedule";

type ContextType = {
  schedules: Schedule[];
  addSchedule: (schedule: Schedule) => void;
  updateSchedule: (id: string, title: string) => void;
  deleteSchedule: (id: string) => void;
};

const ScheduleContext = createContext<ContextType | null>(null);

export const ScheduleProvider = ({ children }: { children: React.ReactNode }) => {
  const [schedules, setSchedules] = useState<Schedule[]>([]);

  const addSchedule = (schedule: Schedule) => {
    setSchedules((prev) => [...prev, schedule]);
  };

  const updateSchedule = (id: string, title: string) => {
    setSchedules((prev) =>
      prev.map((s) =>
        s.id === id ? { ...s, title } : s
      )
    );
  };

  const deleteSchedule = (id: string) => {
    setSchedules((prev) =>
      prev.filter((s) => s.id !== id)
    );
  };

  return (
    <ScheduleContext.Provider
      value={{ schedules, addSchedule, updateSchedule, deleteSchedule }}
    >
      {children}
    </ScheduleContext.Provider>
  );
};

export const useSchedule = () => {
  const context = useContext(ScheduleContext);
  if (!context) throw new Error("useSchedule must be used within Provider");
  return context;
}; 