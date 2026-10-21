import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown, Repeat2, Volume2 } from "lucide-react";

import Modal from "./Modal.jsx";
import {
  ALARM_SOUNDS,
  DEFAULT_ALARM_SOUND,
  previewAlarmSound,
  unlockAudio,
} from "../lib/sound.js";

function clampValue(value, maximum) {
  if (value === "") return "";

  const parsed = Number.parseInt(value, 10);
  return String(Number.isFinite(parsed) ? Math.min(maximum, Math.max(0, parsed)) : 0);
}

export default function TimerEditModal({
  theme,
  initialHours,
  initialMinutes,
  initialSeconds,
  initialSound = DEFAULT_ALARM_SOUND,
  initialRepeatSound = true,
  onClose,
  onStart,
}) {
  const dark = theme === "dark";
  const [hours, setHours] = useState(initialHours);
  const [minutes, setMinutes] = useState(initialMinutes);
  const [seconds, setSeconds] = useState(initialSeconds);
  const [sound, setSound] = useState(initialSound);
  const [repeatSound, setRepeatSound] = useState(initialRepeatSound);
  const [error, setError] = useState("");
  const [soundMenuOpen, setSoundMenuOpen] = useState(false);
  const stopPreviewRef = useRef(null);
  const soundPickerRef = useRef(null);
  const selectedSound = ALARM_SOUNDS.find((option) => option.id === sound);

  useEffect(() => {
    const closeSoundMenu = (event) => {
      if (!soundPickerRef.current?.contains(event.target)) {
        setSoundMenuOpen(false);
      }
    };

    document.addEventListener("pointerdown", closeSoundMenu);

    return () => {
      document.removeEventListener("pointerdown", closeSoundMenu);
      stopPreviewRef.current?.();
    };
  }, []);

  const selectSound = (nextSound) => {
    stopPreviewRef.current?.();
    unlockAudio();
    setSound(nextSound);
    stopPreviewRef.current = previewAlarmSound(nextSound);
    setSoundMenuOpen(false);
  };

  const inputClass = `w-full rounded-xl border px-3 py-3 text-center text-lg font-semibold tabular-nums outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-500/15 ${
    dark
      ? "border-neutral-800 bg-neutral-900 text-white"
      : "border-neutral-200 bg-neutral-50 text-neutral-900"
  }`;

  const submit = (event) => {
    event.preventDefault();

    const durationMs =
      ((Number(hours) || 0) * 3600 +
        (Number(minutes) || 0) * 60 +
        (Number(seconds) || 0)) *
      1000;

    if (durationMs <= 0) {
      setError("Choose a duration longer than zero.");
      return;
    }

    unlockAudio();
    onStart({
      hours: String(Number(hours) || 0),
      minutes: String(Number(minutes) || 0),
      seconds: String(Number(seconds) || 0),
      durationMs,
      sound,
      repeatSound,
    });
    onClose();
  };

  return (
    <Modal
      title="Edit timer"
      subtitle="Choose a duration and the sound that plays at zero."
      onClose={onClose}
      theme={theme}
    >
      <form onSubmit={submit} className="space-y-5">
        <div>
          <p className={`mb-3 text-sm font-semibold ${dark ? "text-neutral-300" : "text-neutral-700"}`}>
            Countdown duration
          </p>
          <div className="grid grid-cols-3 gap-3">
            {[
              ["Hours", hours, setHours, 99],
              ["Minutes", minutes, setMinutes, 59],
              ["Seconds", seconds, setSeconds, 59],
            ].map(([label, value, setValue, maximum]) => (
              <label key={label} className="block">
                <input
                  aria-label={label}
                  type="number"
                  inputMode="numeric"
                  min="0"
                  max={maximum}
                  value={value}
                  onChange={(event) => setValue(clampValue(event.target.value, maximum))}
                  className={inputClass}
                />
                <span className="mt-2 block text-center text-xs text-neutral-500">
                  {label}
                </span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label
            htmlFor="timer-sound"
            className={`mb-2 flex items-center gap-2 text-sm font-semibold ${dark ? "text-neutral-300" : "text-neutral-700"}`}
          >
            <Volume2 size={16} />
            Timer sound
          </label>
          <div ref={soundPickerRef} className="relative">
            <button
              id="timer-sound"
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
                aria-label="Timer sound"
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
        </div>

        <label
          className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3 text-sm ${
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
            <span className="font-semibold">Repeat sound until dismissed</span>
            <span className="mt-0.5 block text-xs text-neutral-500">
              Use Stop to dismiss the timer alarm.
            </span>
          </span>
        </label>

        {error && <p role="alert" className="text-sm text-red-500">{error}</p>}

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
            className="flex-1 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-500"
          >
            Start timer
          </button>
        </div>
      </form>
    </Modal>
  );
}
