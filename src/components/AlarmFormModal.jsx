import { useEffect, useRef, useState } from "react";
import {
  BellRing,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Repeat2,
  Volume2,
} from "lucide-react";

import Modal from "./Modal.jsx";
import { WEEKDAYS } from "../data/timezones.js";
import { getSuggestedAlarmTime } from "../lib/format.js";
import {
  ALARM_SOUNDS,
  DEFAULT_ALARM_SOUND,
  startAlarmSound,
  unlockAudio,
} from "../lib/sound.js";

const HOUR_OPTIONS = Array.from({ length: 24 }, (_, hour) => ({
  value: hour,
  label: `${hour % 12 || 12} ${hour >= 12 ? "PM" : "AM"}`,
}));

const MINUTE_OPTIONS = Array.from({ length: 60 }, (_, minute) => minute);

export default function AlarmFormModal({
  onClose,
  onSave,
  theme,
  initialTime,
}) {
  const [time, setTime] = useState(initialTime || getSuggestedAlarmTime());

  const [label, setLabel] = useState("");
  const [days, setDays] = useState([]);
  const [sound, setSound] = useState(DEFAULT_ALARM_SOUND);
  const [repeatSound, setRepeatSound] = useState(true);
  const [soundMenuOpen, setSoundMenuOpen] = useState(false);
  const [hourMenuOpen, setHourMenuOpen] = useState(false);
  const [minuteMenuOpen, setMinuteMenuOpen] = useState(false);
  const [error, setError] = useState("");
  const stopPreviewRef = useRef(null);
  const soundPickerRef = useRef(null);
  const timePickerRef = useRef(null);

  const dark = theme === "dark";
  const selectedSound = ALARM_SOUNDS.find((option) => option.id === sound);
  const [hoursText, minutesText] = time.split(":");
  const hours = Number(hoursText);
  const minutes = Number(minutesText);

  useEffect(() => {
    const closeMenus = (event) => {
      if (!soundPickerRef.current?.contains(event.target)) {
        setSoundMenuOpen(false);
      }

      if (!timePickerRef.current?.contains(event.target)) {
        setHourMenuOpen(false);
        setMinuteMenuOpen(false);
      }
    };

    document.addEventListener("pointerdown", closeMenus);

    return () => {
      document.removeEventListener("pointerdown", closeMenus);
      stopPreviewRef.current?.();
    };
  }, []);

  const toggleDay = (value) => {
    setDays((current) =>
      current.includes(value)
        ? current.filter((day) => day !== value)
        : [...current, value].sort(),
    );
  };

  const selectSound = (nextSound) => {
    stopPreviewRef.current?.();
    setSound(nextSound);
    stopPreviewRef.current = startAlarmSound({
      sound: nextSound,
      repeat: false,
    });
    setSoundMenuOpen(false);
  };

  const setClockTime = (nextHours, nextMinutes) => {
    const totalMinutes =
      ((nextHours * 60 + nextMinutes) % 1440 + 1440) % 1440;
    const normalizedHours = Math.floor(totalMinutes / 60);
    const normalizedMinutes = totalMinutes % 60;

    setTime(
      `${String(normalizedHours).padStart(2, "0")}:${String(
        normalizedMinutes,
      ).padStart(2, "0")}`,
    );
  };

  const timeButtonClass = `flex h-12 w-11 shrink-0 items-center justify-center transition focus:outline-none focus:ring-2 focus:ring-inset focus:ring-amber-500 ${
    dark
      ? "bg-neutral-800 text-neutral-300 hover:bg-neutral-700"
      : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
  }`;

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
      sound,
      repeatSound,
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
          <p
            className={`mb-2 flex items-center gap-2 text-sm font-semibold ${
              dark ? "text-neutral-300" : "text-neutral-700"
            }`}
          >
            <Clock3 size={16} />
            Alarm time
          </p>

          <div ref={timePickerRef} className="grid gap-3 sm:grid-cols-2">
            <div>
              <label
                htmlFor="alarm-hours"
                className={`mb-1.5 block text-xs font-semibold ${
                  dark ? "text-neutral-400" : "text-neutral-500"
                }`}
              >
                Hours
              </label>
              <div
                className={`flex rounded-xl border ${
                  dark ? "border-neutral-800" : "border-neutral-200"
                }`}
              >
                <button
                  type="button"
                  onClick={() => setClockTime(hours - 1, minutes)}
                  aria-label="Previous hour"
                  className={`${timeButtonClass} rounded-l-xl border-r ${
                    dark ? "border-neutral-700" : "border-neutral-200"
                  }`}
                >
                  <ChevronLeft size={18} />
                </button>
                <div className="relative min-w-0 flex-1">
                  <button
                  id="alarm-hours"
                  type="button"
                  aria-expanded={hourMenuOpen}
                  aria-haspopup="listbox"
                  onClick={() => {
                    setHourMenuOpen((open) => !open);
                    setMinuteMenuOpen(false);
                  }}
                  className={`flex h-12 w-full items-center justify-center gap-2 bg-transparent px-3 text-sm font-semibold outline-none focus:ring-2 focus:ring-inset focus:ring-amber-500 ${
                    dark ? "text-neutral-100" : "text-neutral-900"
                  }`}
                  >
                    {HOUR_OPTIONS[hours]?.label}
                    <ChevronDown
                      size={16}
                      className={`text-neutral-500 transition ${
                        hourMenuOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {hourMenuOpen && (
                    <div
                      role="listbox"
                      aria-label="Alarm hour"
                      className={`absolute left-0 top-[calc(100%+0.5rem)] z-30 max-h-64 w-full overflow-y-auto rounded-xl border p-1.5 shadow-xl ${
                        dark
                          ? "border-neutral-700 bg-neutral-900"
                          : "border-neutral-200 bg-white"
                      }`}
                    >
                      {HOUR_OPTIONS.map((option) => {
                        const selected = option.value === hours;

                        return (
                          <button
                            key={option.value}
                            type="button"
                            role="option"
                            aria-selected={selected}
                            onClick={() => {
                              setClockTime(option.value, minutes);
                              setHourMenuOpen(false);
                            }}
                            className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm transition ${
                              selected
                                ? "bg-amber-500 text-neutral-950"
                                : dark
                                  ? "text-neutral-200 hover:bg-neutral-800"
                                  : "text-neutral-700 hover:bg-neutral-100"
                            }`}
                          >
                            {option.label}
                            {selected && <Check size={16} />}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => setClockTime(hours + 1, minutes)}
                  aria-label="Next hour"
                  className={`${timeButtonClass} rounded-r-xl border-l ${
                    dark ? "border-neutral-700" : "border-neutral-200"
                  }`}
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>

            <div>
              <label
                htmlFor="alarm-minutes"
                className={`mb-1.5 block text-xs font-semibold ${
                  dark ? "text-neutral-400" : "text-neutral-500"
                }`}
              >
                Minutes
              </label>
              <div
                className={`flex rounded-xl border ${
                  dark ? "border-neutral-800" : "border-neutral-200"
                }`}
              >
                <button
                  type="button"
                  onClick={() => setClockTime(hours, minutes - 1)}
                  aria-label="Previous minute"
                  className={`${timeButtonClass} rounded-l-xl border-r ${
                    dark ? "border-neutral-700" : "border-neutral-200"
                  }`}
                >
                  <ChevronLeft size={18} />
                </button>
                <div className="relative min-w-0 flex-1">
                  <button
                  id="alarm-minutes"
                  type="button"
                  aria-expanded={minuteMenuOpen}
                  aria-haspopup="listbox"
                  onClick={() => {
                    setMinuteMenuOpen((open) => !open);
                    setHourMenuOpen(false);
                  }}
                  className={`flex h-12 w-full items-center justify-center gap-2 bg-transparent px-3 text-sm font-semibold outline-none focus:ring-2 focus:ring-inset focus:ring-amber-500 ${
                    dark ? "text-neutral-100" : "text-neutral-900"
                  }`}
                  >
                    {String(minutes).padStart(2, "0")}
                    <ChevronDown
                      size={16}
                      className={`text-neutral-500 transition ${
                        minuteMenuOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {minuteMenuOpen && (
                    <div
                      role="listbox"
                      aria-label="Alarm minutes"
                      className={`absolute left-0 top-[calc(100%+0.5rem)] z-30 max-h-64 w-full overflow-y-auto rounded-xl border p-1.5 shadow-xl ${
                        dark
                          ? "border-neutral-700 bg-neutral-900"
                          : "border-neutral-200 bg-white"
                      }`}
                    >
                      {MINUTE_OPTIONS.map((minute) => {
                        const selected = minute === minutes;

                        return (
                          <button
                            key={minute}
                            type="button"
                            role="option"
                            aria-selected={selected}
                            onClick={() => {
                              setClockTime(hours, minute);
                              setMinuteMenuOpen(false);
                            }}
                            className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm transition ${
                              selected
                                ? "bg-amber-500 text-neutral-950"
                                : dark
                                  ? "text-neutral-200 hover:bg-neutral-800"
                                  : "text-neutral-700 hover:bg-neutral-100"
                            }`}
                          >
                            {String(minute).padStart(2, "0")}
                            {selected && <Check size={16} />}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => setClockTime(hours, minutes + 1)}
                  aria-label="Next minute"
                  className={`${timeButtonClass} rounded-r-xl border-l ${
                    dark ? "border-neutral-700" : "border-neutral-200"
                  }`}
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          </div>
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

        <div>
          <label
            htmlFor="alarm-sound"
            className={`mb-2 flex items-center gap-2 text-sm font-semibold ${
              dark ? "text-neutral-300" : "text-neutral-700"
            }`}
          >
            <Volume2 size={16} />
            Alarm sound
          </label>

          <div ref={soundPickerRef} className="relative">
            <button
              id="alarm-sound"
              type="button"
              aria-expanded={soundMenuOpen}
              aria-haspopup="listbox"
              onClick={() => setSoundMenuOpen((open) => !open)}
              className={`flex w-full items-center justify-between rounded-xl border px-3 py-3 text-left text-sm font-medium outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-500/15 ${
                dark
                  ? "border-neutral-800 bg-neutral-900 text-neutral-100 hover:border-neutral-700"
                  : "border-neutral-200 bg-neutral-50 text-neutral-900 hover:border-neutral-300"
              }`}
            >
              <span className="flex items-center gap-2">
                <Volume2 size={16} className="text-amber-500" />
                {selectedSound?.label}
              </span>
              <ChevronDown
                size={18}
                className={`text-neutral-500 transition ${
                  soundMenuOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {soundMenuOpen && (
              <div
                role="listbox"
                aria-label="Alarm sound"
                className={`absolute z-20 mt-2 max-h-64 w-full overflow-y-auto rounded-xl border p-1.5 shadow-xl ${
                  dark
                    ? "border-neutral-700 bg-neutral-900"
                    : "border-neutral-200 bg-white"
                }`}
              >
                {ALARM_SOUNDS.map((option) => {
                  const selected = option.id === sound;

                  return (
                    <button
                      key={option.id}
                      type="button"
                      role="option"
                      aria-selected={selected}
                      onClick={() => selectSound(option.id)}
                      className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm transition ${
                        selected
                          ? "bg-amber-500 text-neutral-950"
                          : dark
                            ? "text-neutral-200 hover:bg-neutral-800"
                            : "text-neutral-700 hover:bg-neutral-100"
                      }`}
                    >
                      {option.label}
                      {selected && <Check size={16} />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <label
            className={`mt-3 flex cursor-pointer items-center gap-3 rounded-xl border p-3 text-sm ${
              dark
                ? "border-neutral-800 bg-neutral-900/70 text-neutral-300"
                : "border-neutral-200 bg-neutral-50 text-neutral-700"
            }`}
          >
            <input
              type="checkbox"
              checked={repeatSound}
              onChange={(event) => setRepeatSound(event.target.checked)}
              className="h-4 w-4 accent-amber-500"
            />
            <Repeat2 size={16} className="text-amber-500" />
            <span>
              <span className="font-semibold">Repeat until dismissed</span>
              <span className="mt-0.5 block text-xs text-neutral-500">
                Keep ringing until you dismiss the alarm.
              </span>
            </span>
          </label>
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

          <span className="text-xs text-neutral-500">
            Select a sound to hear it once.
          </span>
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
