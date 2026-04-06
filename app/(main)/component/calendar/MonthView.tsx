"use client";

import { useSchedule } from "../../ScheduleContext";
import {
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  isSameDay,
  isToday,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import { format } from "date-fns";
import { useState } from "react";

type PropsType = {
  currentDate: Date;
};

const MonthView = ({ currentDate }: PropsType) => {
  const { schedules, updateSchedule, deleteSchedule } = useSchedule();

  const [openId, setOpenId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");

  const start = startOfWeek(startOfMonth(currentDate));
  const end = endOfWeek(endOfMonth(currentDate));
  const calendarCells = eachDayOfInterval({ start, end });

  return (
    <div className="bg-white shadow-lg grid grid-cols-7">
      {calendarCells.map((day, index) => {
        const isCurrentMonth = day.getMonth() === currentDate.getMonth();
        const daySchedules = schedules.filter((s) => isSameDay(s.date, day));

        return (
          <div
            key={day.toString()}
            className={`h-63 p-2 text-center border-l border-t border-black/10 ${
              isCurrentMonth ? "bg-white" : "bg-gray-100 text-gray-400"
            } ${index < 7 ? "border-t-0" : ""} ${index % 7 === 0 ? "border-l-0" : ""}`}
          >
            <span
              className={`inline-block px-2 py-1 ${
                isToday(day) ? "bg-blue-600 text-white rounded-full" : ""
              }`}
            >
              {format(day, day.getDate() === 1 ? "M月d日" : "d")}
            </span>

            {daySchedules.map((s) => (
              <div
                key={s.id}
                className="text-sm bg-blue-100 rounded p-1 mt-3"
              >
                <div
                  className="flex w-full"
                  onClick={() => setOpenId(openId === s.id ? null : s.id)}
                >
                  {editingId === s.id ? (
                    <div className="absolute z-50 text-xl p-15 border-gray-300/50 flex flex-col gap-5 shadow-lg bg-white rounded-2xl">
                      <input
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className="p-5 text-lm shadow-lg"
                      />
                      <button
                        className="bg-gray-100 border-gray-200/50 rounded-3xl hover:bg-gray-300 shadow-lg"
                        onClick={() => {
                          updateSchedule(s.id, editTitle);
                          setEditingId(null);
                        }}
                      >
                        保存
                      </button>
                    </div>
                  ) : (
                    <div className="pl-4 pr-2 flex">
                      {format(new Date(s.startDateTime), "HH:mm")}〜
                      <p className="pl-2">{s.title}</p>
                    </div>
                  )}

                  {openId === s.id && (
                    <div className="absolute z-30 text-3xl pt-5 pl-10 pr-10 pb-20 flex flex-col gap-5 shadow-lg bg-white rounded-2xl">
                      <div className="flex justify-end gap-4">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingId(s.id);
                            setEditTitle(s.title);
                          }}
                        >
                          🖊️
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteSchedule(s.id);
                          }}
                        >
                          🗑️
                        </button>
                      </div>
                      <p className="pl-5 pr-5">
                        {format(new Date(s.startDateTime), "HH:mm")}〜
                        {format(new Date(s.endDateTime), "HH:mm")}
                      </p>
                      {s.title}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
};

export default MonthView;