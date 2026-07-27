"use client";

import { addHours, addMinutes, format, setHours, setMinutes } from "date-fns";
import { useState } from "react";
import { useSchedule } from "../ScheduleContext";
import { useCurrentDate } from "@/lib/useCurrentDate";

const roundUpToFiveMinutes = (value: Date) => {
  const rounded = new Date(value);
  rounded.setSeconds(0, 0);

  const remainder = rounded.getMinutes() % 5;
  if (remainder !== 0) {
    rounded.setMinutes(rounded.getMinutes() + 5 - remainder);
  }

  return rounded;
};

const timeOptions = Array.from({ length: 24 * 12 }, (_, index) => {
  const hours = Math.floor(index / 12);
  const minutes = (index % 12) * 5;

  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
});

const AddSchedule = () => {
  const { addSchedule } = useSchedule();
  const currentDate = useCurrentDate();

  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const [date, setDate] = useState<Date>(currentDate);
  const [startDateTime, setStartDateTime] = useState(() =>
    roundUpToFiveMinutes(addMinutes(currentDate, 15)),
  );
  const [endDateTime, setEndDateTime] = useState(() =>
    addHours(roundUpToFiveMinutes(addMinutes(currentDate, 15)), 1),
  );

  const handleAdd = async () => {
    if (!title) return;

    try {
      setIsSaving(true);

      await addSchedule({
        title,
        date,
        startDateTime,
        endDateTime,
      });

      setTitle("");
      const base = roundUpToFiveMinutes(addMinutes(currentDate, 15));
      setDate(currentDate);
      setStartDateTime(base);
      setEndDateTime(addHours(base, 1));
      setIsOpen(false);
    } catch {
      alert("予定の保存に失敗しました");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <button
        className="flex justify-center items-center text-xl mt-5 mb-5 mr-20 ml-20 p-4 bg-white-700 border border-gray-300/50 rounded-2xl shadow-lg hover:bg-gray-200"
        onClick={() => setIsOpen(!isOpen)}
      >
        <p>＋ 作成</p>
      </button>

      {isOpen && (
        <div className="absolute top-20 left-100 p-15 border-gray-300/50 flex flex-col gap-5 shadow-lg bg-white rounded-2xl">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border-b p-2 mr-2"
            placeholder="予定タイトル"
          />
          <input
            type="date"
            value={format(date, "yyyy-MM-dd")}
            onChange={(e) => {
              const [y, m, d] = e.target.value.split("-").map(Number);
              const nextDate = new Date(y, m - 1, d);
              setDate(nextDate);
              setStartDateTime(
                setMinutes(setHours(nextDate, startDateTime.getHours()), startDateTime.getMinutes()),
              );
              setEndDateTime(
                setMinutes(setHours(nextDate, endDateTime.getHours()), endDateTime.getMinutes()),
              );
            }}
            className="border p-2"
          />
          <div className="flex gap-2">
            <select
              aria-label="開始時刻"
              value={format(startDateTime, "HH:mm")}
              onChange={(e) => {
                const [h, m] = e.target.value.split(":").map(Number);
                const newStart = setMinutes(setHours(date, h), m);

                if (newStart >= endDateTime) {
                  alert("開始時間は終了時間より前にしてください");
                  return;
                }

                setStartDateTime(newStart);
              }}
              className="border p-2"
            >
              {timeOptions.map((time) => (
                <option key={`start-${time}`} value={time}>
                  {time}
                </option>
              ))}
            </select>
            <span>〜</span>
            <select
              aria-label="終了時刻"
              value={format(endDateTime, "HH:mm")}
              onChange={(e) => {
                const [h, m] = e.target.value.split(":").map(Number);
                const newEnd = setMinutes(setHours(date, h), m);

                if (newEnd <= startDateTime) return;

                setEndDateTime(newEnd);
              }}
              className="border p-2"
            >
              {timeOptions.map((time) => (
                <option key={`end-${time}`} value={time}>
                  {time}
                </option>
              ))}
            </select>
          </div>
          <button
            onClick={handleAdd}
            disabled={isSaving}
            className="bg-blue-500 text-white px-3 py-2 rounded"
          >
            {isSaving ? "保存中..." : "追加"}
          </button>
        </div>
      )}
    </>
  );
};

export default AddSchedule;
