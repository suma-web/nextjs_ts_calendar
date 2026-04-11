"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { Schedule } from "@/types/schedule";

type ScheduleInput = {
  date: Date;
  title: string;
  startDateTime: Date;
  endDateTime: Date;
};

type ContextType = {
  schedules: Schedule[];
  addSchedule: (schedule: ScheduleInput) => Promise<void>;
  updateSchedule: (id: string, title: string) => Promise<void>;
  deleteSchedule: (id: string) => Promise<void>;
};

const ScheduleContext = createContext<ContextType | null>(null);

function normalizeSchedule(schedule: {
  id: string;
  date: string | Date;
  title: string;
  startTime: string | Date;
  endTime: string | Date;
}): Schedule {
  return {
    id: schedule.id,
    date: new Date(schedule.date),
    title: schedule.title,
    startDateTime: new Date(schedule.startTime),
    endDateTime: new Date(schedule.endTime),
  };
}

export const ScheduleProvider = ({ children }: { children: React.ReactNode }) => {
  const [schedules, setSchedules] = useState<Schedule[]>([]);

  useEffect(() => {
    let isMounted = true;

    async function loadSchedules() {
      const response = await fetch("/api/schedules");

      if (!response.ok) {
        return;
      }

      const data = await response.json();

      if (!isMounted) {
        return;
      }

      setSchedules(data.map(normalizeSchedule));
    }

    void loadSchedules();

    return () => {
      isMounted = false;
    };
  }, []);

  const addSchedule = async (schedule: ScheduleInput) => {
    const response = await fetch("/api/schedules", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: schedule.title,
        date: schedule.date.toISOString(),
        startTime: schedule.startDateTime.toISOString(),
        endTime: schedule.endDateTime.toISOString(),
      }),
    });

    if (!response.ok) {
      throw new Error("failed to save schedule");
    }

    const createdSchedule = normalizeSchedule(await response.json());

    setSchedules((prev) => [...prev, createdSchedule]);
  };

  const updateSchedule = async (id: string, title: string) => {
    const response = await fetch("/api/schedules", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id, title }),
    });

    if (!response.ok) {
      throw new Error("failed to update schedule");
    }

    setSchedules((prev) =>
      prev.map((s) =>
        s.id === id ? { ...s, title } : s
      )
    );
  };

  const deleteSchedule = async (id: string) => {
    const response = await fetch("/api/schedules", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    });

    if (!response.ok) {
      throw new Error("failed to delete schedule");
    }

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
