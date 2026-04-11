"use client";

import { useSchedule } from "@/app/(main)/ScheduleContext";
import { format, isSameDay, isValid } from "date-fns";
import { useState } from "react";

type PropsType = {
  currentDate: Date;
};

const DayView = ({ currentDate }: PropsType) => {
  const { schedules, updateSchedule, deleteSchedule } = useSchedule();
  const [openId, setOpenId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const daySchedules = schedules.filter((s) => isSameDay(s.date, currentDate));

  if (!isValid(currentDate)) {
    return <div>Invalid Date</div>;
  }

  return (
    <div className="p-2  bg-white">
      <h2 className="pl-4 pr-100">{format(currentDate, "yyyy年M月d日")}</h2>
      <div className="flex">
        <div className="w-10 border-r">
          {hours.map((h) => (
            <div key={h} className="h-16 text-xs text-right pr-2">
              {String(h).padStart(2, "0")}:00
            </div>
          ))}
        </div>

        <div className="flex-3 relative">
          {daySchedules.map((s) => {
            const start = new Date(s.startDateTime);
            const end = new Date(s.endDateTime);

            const top = start.getHours() * 64;
            const height =
              ((end.getTime() - start.getTime()) / (1000 * 60 * 60)) * 64;

            return (
              <div
                key={s.id}
                className="absolute bg-blue-300 rounded p-2 text-xs shadow cursor-pointer"
                style={{
                  top: `${top + 10}px`,
                  height: `${height}px`,
                  left: "10px",
                  right: "10px",
                }}
                onClick={() => setOpenId(openId === s.id ? null : s.id)}
              >
                {editingId === s.id ? (
                  <div className="flex flex-col gap-2">
                    <input
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="border p-4 text-xl text-center bg-white"
                    />
                    <button
                      onClick={async (e) => {
                        e.stopPropagation();
                        try {
                          await updateSchedule(s.id, editTitle);
                          setEditingId(null);
                        } catch {
                          alert("予定の更新に失敗しました");
                        }
                      }}
                      className="border p-1 text-xl bg-gray-300"
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

                {openId === s.id && editingId !== s.id && (
                  <div className="absolute top-0 right-0 bg-white shadow rounded pl-7 pr-7 pt-2 pb-2 z-50 text-xl">
                    <div className="flex gap-5">
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
      </div>
    </div>
  );
};

export default DayView;
