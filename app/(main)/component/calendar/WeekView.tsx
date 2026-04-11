"use client"

import {
  eachDayOfInterval,
  endOfWeek,
  isSameDay,
  isToday,
  startOfWeek,
} from "date-fns";
import { format } from "date-fns";
import { useSchedule } from "../../ScheduleContext";
import { useState } from "react";

type PropsType = {
  currentDate: Date;
};

const WeekView = ({ currentDate }: PropsType) => {
  const { schedules, updateSchedule, deleteSchedule } = useSchedule();
  const start = startOfWeek(currentDate);
  const end = endOfWeek(currentDate);

  const [openId, setOpenId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");

  const days = eachDayOfInterval({ start, end });
  const hours = Array.from({ length: 24 }, (_, i) => i);

  return (
    <div className="flex h-auto bg-white p-5">
      <div className="w-16 border-r mt-5">
        {hours.map((h) => (
          <div key={h} className="h-16 text-xs text-right pr-2">
            {String(h).padStart(2, "0")}:00
          </div>
        ))}
      </div>

      <div className="flex-1 grid grid-cols-7 relative">
        {days.map((day) => {
          const daySchedules = schedules.filter((s) => isSameDay(s.date, day));

          return (
            <div
              key={day.toString()}
              className="border-r border-gray-400 relative flex justify-center items-start"
            >
              <div
                className={`text-center px-3 py-1 ${isToday(day) ? "bg-blue-600 text-white rounded-full" : ""}`}
              >
                {format(day, "d")}
              </div>

              {hours.map((h) => (
                <div key={h} className="h-16 border-t"></div>
              ))}

              {daySchedules.map((s) => {
                const start = new Date(s.startDateTime);
                const end = new Date(s.endDateTime);

                const top =
                  (start.getHours() * 60 + start.getMinutes()) * (64 / 60);

                const height =
                  ((end.getTime() - start.getTime()) / (1000 * 60 * 60)) * 64;

                return (
                  <div
                    key={s.id}
                    className="absolute bg-blue-300 rounded p-1 text-xs left-1 right-1 shadow-lg cursor-pointer"
                    style={{
                      top: `${top + 20}px`,
                      height: `${height}px`,
                    }}
                    onClick={() => setOpenId(openId === s.id ? null : s.id)}
                  >
                    {editingId === s.id ? (
                      <div className="flex flex-col gap-2">
                        <input
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          className="border pl-4 pr-4 text-xl text-center bg-white"
                        />
                        <button
                          className="bg-gray-200 rounded pl-2 pr-2 text-xl"
                          onClick={async (e) => {
                            e.stopPropagation();
                            try {
                              await updateSchedule(s.id, editTitle);
                              setEditingId(null);
                            } catch {
                              alert("予定の更新に失敗しました");
                            }
                          }}
                        >
                          保存
                        </button>
                      </div>
                    ) : (
                      <>
                        <div>
                          {format(start, "HH:mm")}〜{format(end, "HH:mm")}
                        </div>
                        <div>{s.title}</div>
                      </>
                    )}

                    {openId === s.id && !editingId && (
                      <div className="absolute z-30 text-3xl pt-2 pl-5 pr-5 pb-2 flex flex-col gap-5 shadow-lg bg-white rounded-2xl">
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
                            onClick={async (e) => {
                              e.stopPropagation();
                              try {
                                await deleteSchedule(s.id);
                              } catch {
                                alert("予定の削除に失敗しました");
                              }
                            }}
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WeekView;
