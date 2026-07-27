"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
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

  const addSchedule = useCallback(async (schedule: ScheduleInput) => {
    const optimisticId = `optimistic-${crypto.randomUUID()}`;
    const optimisticSchedule: Schedule = {
      id: optimisticId,
      date: schedule.date,
      title: schedule.title.trim(),
      startDateTime: schedule.startDateTime,
      endDateTime: schedule.endDateTime,
    };

    setSchedules((prev) => [...prev, optimisticSchedule]);

    try {
      const response = await fetch("/api/schedules", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: optimisticSchedule.title,
          date: optimisticSchedule.date.toISOString(),
          startTime: optimisticSchedule.startDateTime.toISOString(),
          endTime: optimisticSchedule.endDateTime.toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error("failed to save schedule");
      }

      const createdSchedule = normalizeSchedule(await response.json());

      setSchedules((prev) =>
        prev.map((item) =>
          item.id === optimisticId ? createdSchedule : item
        )
      );
    } catch (error) {
      setSchedules((prev) =>
        prev.filter((item) => item.id !== optimisticId)
      );
      throw error;
    }
  }, []);

  const updateSchedule = useCallback(async (id: string, title: string) => {
    let previousTitle: string | undefined;
    const nextTitle = title.trim();

    setSchedules((prev) =>
      prev.map((schedule) => {
        if (schedule.id !== id) {
          return schedule;
        }

        previousTitle = schedule.title;
        return { ...schedule, title: nextTitle };
      })
    );

    try {
      const response = await fetch("/api/schedules", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, title: nextTitle }),
      });

      if (!response.ok) {
        throw new Error("failed to update schedule");
      }
    } catch (error) {
      if (previousTitle !== undefined) {
        setSchedules((prev) =>
          prev.map((schedule) =>
            schedule.id === id
              ? { ...schedule, title: previousTitle as string }
              : schedule
          )
        );
      }
      throw error;
    }
  }, []);

  const deleteSchedule = useCallback(async (id: string) => {
    let removedSchedule: Schedule | undefined;
    let removedIndex = -1;

    setSchedules((prev) => {
      removedIndex = prev.findIndex((schedule) => schedule.id === id);
      removedSchedule = prev[removedIndex];

      return prev.filter((schedule) => schedule.id !== id);
    });

    try {
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
    } catch (error) {
      if (removedSchedule) {
        setSchedules((prev) => {
          const restored = [...prev];
          restored.splice(
            Math.min(Math.max(removedIndex, 0), restored.length),
            0,
            removedSchedule as Schedule,
          );
          return restored;
        });
      }
      throw error;
    }
  }, []);

  const value = useMemo(
    () => ({ schedules, addSchedule, updateSchedule, deleteSchedule }),
    [schedules, addSchedule, updateSchedule, deleteSchedule],
  );

  return (
    <ScheduleContext.Provider value={value}>
      {children}
    </ScheduleContext.Provider>
  );
};

export const useSchedule = () => {
  const context = useContext(ScheduleContext);
  if (!context) throw new Error("useSchedule must be used within Provider");
  return context;
}; 
