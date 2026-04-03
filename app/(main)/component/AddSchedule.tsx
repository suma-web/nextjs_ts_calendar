"use client";

import { addHours, addMinutes, format } from "date-fns";
import { useState, useEffect } from "react";
import { useSchedule } from "../ScheduleContext";
import { useCurrentDate } from "@/lib/useCurrentDate";
import { v4 as uuidv4 } from "uuid";

const AddSchedule = () => {
  const { addSchedule } = useSchedule();
  const currentDate = useCurrentDate();

  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState<Date>(currentDate);
  const [startTime, setStartTime] = useState<Date>(currentDate);
  const [endTime, setEndTime] = useState<Date>(currentDate);

  useEffect(() => {
    const base = addMinutes(currentDate, 15);

    setDate(currentDate);
    setStartTime(base);
    setEndTime(addHours(base, 1));
  }, [currentDate]);

  const handleAdd = () => {
    if (!title) return;

    addSchedule({
      id: uuidv4(),
      title,
      date,
      startTime,
      endTime,
    });

    setTitle("");
    const base = addMinutes(currentDate, 15);
    setDate(currentDate);
    setStartTime(base);
    setEndTime(addHours(base, 1));
    setIsOpen(false);
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
              setDate(new Date(y, m - 1, d));
            }}
            className="border p-2"
          />
          <div className="flex gap-2">
            <input
              type="time"
              value={format(startTime, "HH:mm")}
              onChange={(e) => {
                const [h, m] = e.target.value.split(":").map(Number);
                const newDate = new Date(date);
                newDate.setHours(h, m);
                setStartTime(newDate);
              }}
              className="border p-2"
            />
            <span>〜</span>
            <input
              type="time"
              value={format(endTime, "HH:mm")}
              onChange={(e) => {
                const [h, m] = e.target.value.split(":").map(Number);
                const newDate = new Date(date);
                newDate.setHours(h, m);

                if (newDate < startTime) return;
                setEndTime(newDate);
              }}
              className="border p-2"
            />
          </div>
          <button
            onClick={handleAdd}
            className="bg-blue-500 text-white px-3 py-2 rounded"
          >
            追加
          </button>
        </div>
      )}
    </>
  );
};

export default AddSchedule;