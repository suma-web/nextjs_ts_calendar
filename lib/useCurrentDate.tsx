"use client";

import { usePathname } from "next/navigation";
import { useMemo } from "react";
import { startOfMonth, startOfWeek, addWeeks } from "date-fns";

export const useCurrentDate = () => {
  const pathname = usePathname();
  const segments = pathname.split("/");

  return useMemo(() => {
    const year = Number(segments[1]);
    const month = Number(segments[2]);

    if (!year || !month || isNaN(year) || isNaN(month)) {
      return new Date();
    }

    if (segments[3] === "week") {
      const week = Number(segments[4]);

      if (isNaN(week)) return new Date();

      const baseDate = new Date(year, month - 1, 1);
      const monthStart = startOfMonth(baseDate);
      const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });

      return addWeeks(calendarStart, week - 1);
    }

    if (segments[3]) {
      const day = Number(segments[3]);

      if (!isNaN(day)) {
        return new Date(year, month - 1, day);
      }
    }

    return new Date(year, month - 1, 1);
  }, [pathname]);
};