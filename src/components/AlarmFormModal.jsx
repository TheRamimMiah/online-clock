import { useState } from "react";
import { BellRing, Clock3, Volume2 } from "lucide-react";

import Modal from "./Modal.jsx";
import { WEEKDAYS } from "../data/timezones.js";
import { getSuggestedAlarmTime } from "../lib/format.js";
import { playBeep, unlockAudio } from "../lib/sound.js";

export default function AlarmFormModal({
  onClose,
  onSave,
  theme,
  initialTime,
}) {
  const [time, setTime] = useState(initialTime || getSuggestedAlarmTime());

  const [label, setLabel] = useState("");
  const [days, setDays] = useState([]);
  const [error, setError] = useState("");

  const dark = theme === "dark";

  const toggleDay = (value) => {
    setDays((current) =>
      current.includes(value)
        ? current.filter((day) => day !== value)
        : [...current, value].sort(),
    );
  };

  const submit = (event) => {
    event.preventDefault();

    if (!time) {
      setError("Choose a time for your alarm.");
      return;
    }

    unlockAudio();

    onSave({
      time,
      label: label.trim(),
      days,
      enabled: true,
      lastFiredDate: null,
    });

    onClose();
  };

  const inputClass = `w-full rounded-xl border px-3 py-3 text-sm outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-500/15 ${
    dark
      ? "border-neutral-800 bg-neutral-900 text-neutral-100 placeholder:text-neutral-600"
      : "border-neutral-200 bg-neutral-50 text-neutral-900 placeholder:text-neutral-400"
  }`;

  return (
    <Modal
      title="Create an alarm"
      subtitle="Choose when you want the alarm to ring."
      onClose={onClose}
      theme={theme}
    >
      <form onSubmit={submit} className="space-y-5">
        <div>
          <label
            htmlFor="alarm-time"
            className={`mb-2 flex items-center gap-2 text-sm font-semibold ${
              dark ? "text-neutral-300" : "text-neutral-700"
            }`}
          >
            <Clock3 size={16} />
            Alarm time
          </label>

          <input
            id="alarm-time"
            type="time"
            value={time}
            onChange={(event) => setTime(event.target.value)}
            required
            className={`${inputClass} text-lg`}
          />
        </div>

        <div>
          <label
            htmlFor="alarm-label"
            className={`mb-2 block text-sm font-semibold ${
              dark ? "text-neutral-300" : "text-neutral-700"
            }`}
          >
            Label{" "}
            <span className="font-normal text-neutral-500">(optional)</span>
          </label>

          <input
            id="alarm-label"
            type="text"
            maxLength={48}
            value={label}
            onChange={(event) => setLabel(event.target.value)}
            placeholder="e.g. Study session, Wake up"
            className={inputClass}
          />
        </div>

        <div>
          <p
            className={`mb-2 text-sm font-semibold ${
              dark ? "text-neutral-300" : "text-neutral-700"
            }`}
          >
            Repeat
          </p>

          <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
            {WEEKDAYS.map((day) => {
              const selected = days.includes(day.value);

              return (
                <button
                  key={day.value}
                  type="button"
                  title={day.label}
                  aria-pressed={selected}
                  onClick={() => toggleDay(day.value)}
                  className={`aspect-square rounded-full text-xs font-semibold transition ${
                    selected
                      ? "bg-amber-500 text-neutral-950"
                      : dark
                        ? "bg-neutral-900 text-neutral-500 hover:bg-neutral-800"
                        : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                  }`}
                >
                  {day.short}
                </button>
              );
            })}
          </div>

          <p
            className={`mt-2 text-xs ${
              dark ? "text-neutral-500" : "text-neutral-500"
            }`}
          >
            {days.length
              ? "Repeats on selected days."
              : "One-time alarm (does not repeat)."}
          </p>
        </div>

        {error && (
          <p role="alert" className="text-sm text-red-500">
            {error}
          </p>
        )}

        <div
          className={`flex flex-wrap items-center justify-between gap-3 rounded-xl border p-3 ${
            dark
              ? "border-neutral-800 bg-neutral-900/70"
              : "border-neutral-200 bg-neutral-50"
          }`}
        >
          <div className="flex items-center gap-2 text-xs text-neutral-500">
            <BellRing size={16} />
            Sound plays in this browser tab
          </div>

          <button
            type="button"
            onClick={() =>
              playBeep({
                repeat: 2,
                frequency: 740,
                duration: 0.15,
              })
            }
            className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold ${
              dark
                ? "bg-neutral-800 text-neutral-200 hover:bg-neutral-700"
                : "bg-white text-neutral-700 hover:bg-neutral-100"
            }`}
          >
            <Volume2 size={14} />
            Test sound
          </button>
        </div>

        <div className="flex gap-3 pt-1">
          <button
            type="button"
            onClick={onClose}
            className={`flex-1 rounded-xl border px-4 py-3 text-sm font-semibold transition ${
              dark
                ? "border-neutral-800 text-neutral-300 hover:bg-neutral-900"
                : "border-neutral-200 text-neutral-600 hover:bg-neutral-50"
            }`}
          >
            Cancel
          </button>

          <button
            type="submit"
            className="flex-1 rounded-xl bg-amber-500 px-4 py-3 text-sm font-semibold text-neutral-950 transition hover:bg-amber-400"
          >
            Save alarm
          </button>
        </div>
      </form>
    </Modal>
  );
}
