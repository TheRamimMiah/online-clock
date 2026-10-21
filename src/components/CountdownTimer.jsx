import { useEffect, useRef, useState } from "react";
import {
  AlarmClock,
  Pause,
  Play,
  RotateCcw,
  Timer as TimerIcon,
} from "lucide-react";

import SectionCard from "./SectionCard.jsx";
import { formatDuration } from "../lib/format.js";
import { playBeep, unlockAudio } from "../lib/sound.js";

const PRESETS = [
  { label: "1 minute", seconds: 60 },
  { label: "5 minutes", seconds: 300 },
  { label: "10 minutes", seconds: 600 },
  { label: "25 minutes", seconds: 1500 },
  { label: "30 minutes", seconds: 1800 },
  { label: "1 hour", seconds: 3600 },
];

function clampNumber(value, max) {
  if (value === "") return "";

  const parsed = Number.parseInt(value, 10);

  if (!Number.isFinite(parsed)) return "0";

  return String(Math.min(max, Math.max(0, parsed)));
}

export default function CountdownTimer({ theme }) {
  const dark = theme === "dark";

  const [hours, setHours] = useState("0");
  const [minutes, setMinutes] = useState("5");
  const [seconds, setSeconds] = useState("0");

  const [remainingMs, setRemainingMs] = useState(0);
  const [running, setRunning] = useState(false);
  const [finished, setFinished] = useState(false);

  const deadlineRef = useRef(0);
  const totalDurationRef = useRef(0);

  useEffect(() => {
    if (!running) return undefined;

    const tick = () => {
      const remaining = Math.max(0, deadlineRef.current - Date.now());

      setRemainingMs(remaining);

      if (remaining <= 0) {
        setRunning(false);
        setFinished(true);

        playBeep({
          repeat: 8,
          frequency: 760,
          duration: 0.25,
        });
      }
    };

    const id = window.setInterval(tick, 100);

    tick();

    return () => window.clearInterval(id);
  }, [running]);

  const chosenDuration =
    (Math.max(0, Number(hours) || 0) * 3600 +
      Math.max(0, Number(minutes) || 0) * 60 +
      Math.max(0, Number(seconds) || 0)) *
    1000;

  const totalMs =
    running || remainingMs > 0
      ? // eslint-disable-next-line react-hooks/refs
        totalDurationRef.current
      : chosenDuration;

  const progress =
    totalMs > 0 ? Math.min(1, Math.max(0, remainingMs / totalMs)) : 0;

  const start = () => {
    unlockAudio();

    const duration = remainingMs > 0 ? remainingMs : chosenDuration;

    if (duration <= 0) return;

    totalDurationRef.current =
      remainingMs > 0 ? totalDurationRef.current : duration;

    deadlineRef.current = Date.now() + duration;

    setRemainingMs(duration);
    setFinished(false);
    setRunning(true);
  };

  const pause = () => {
    setRemainingMs(Math.max(0, deadlineRef.current - Date.now()));

    setRunning(false);
  };

  const reset = () => {
    setRunning(false);
    setFinished(false);
    setRemainingMs(0);
    totalDurationRef.current = 0;
  };

  const applyPreset = (presetSeconds) => {
    setRunning(false);
    setFinished(false);

    const newHours = Math.floor(presetSeconds / 3600);
    const newMinutes = Math.floor((presetSeconds % 3600) / 60);
    const newSeconds = presetSeconds % 60;

    setHours(String(newHours));
    setMinutes(String(newMinutes));
    setSeconds(String(newSeconds));

    setRemainingMs(0);
    totalDurationRef.current = 0;
  };

  const inputClass = `w-full rounded-xl border px-2 py-3 text-center text-xl font-semibold tabular-nums outline-none focus:border-amber-500 ${
    dark
      ? "border-neutral-800 bg-neutral-900 text-white"
      : "border-neutral-200 bg-neutral-50 text-neutral-900"
  }`;

  return (
    <div className="space-y-5">
      <SectionCard
        title="Countdown timer"
        subtitle="Set a duration, then start the countdown."
        icon={TimerIcon}
        theme={theme}
      >
        <div className="grid gap-8 py-2 lg:grid-cols-[minmax(0,1fr)_minmax(260px,0.8fr)] lg:items-center">
          <div className="flex flex-col items-center">
            <div className="relative flex h-64 w-64 items-center justify-center sm:h-72 sm:w-72">
              <svg
                className="absolute inset-0 h-full w-full -rotate-90"
                viewBox="0 0 280 280"
                role="img"
                aria-label={`${Math.round(progress * 100)} percent of timer remains`}
              >
                <circle
                  cx="140"
                  cy="140"
                  r="124"
                  fill="none"
                  stroke={dark ? "#262626" : "#e5e5e5"}
                  strokeWidth="7"
                />

                <circle
                  cx="140"
                  cy="140"
                  r="124"
                  fill="none"
                  stroke="#f59e0b"
                  strokeWidth="7"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 124}`}
                  strokeDashoffset={`${2 * Math.PI * 124 * (1 - progress)}`}
                  className="transition-[stroke-dashoffset] duration-100"
                />
              </svg>

              <div className="relative text-center">
                <p
                  className={`clock-digit text-[clamp(2.1rem,5vw,3.4rem)] font-semibold tracking-tight ${
                    finished
                      ? "text-amber-500"
                      : dark
                        ? "text-white"
                        : "text-neutral-900"
                  }`}
                >
                  {formatDuration(remainingMs)}
                </p>

                <p
                  className={`mt-2 text-xs font-semibold uppercase tracking-[0.25em] ${
                    finished
                      ? "text-amber-500"
                      : dark
                        ? "text-neutral-500"
                        : "text-neutral-500"
                  }`}
                >
                  {finished
                    ? "Time is up"
                    : running
                      ? "Counting down"
                      : remainingMs > 0
                        ? "Paused"
                        : "Ready"}
                </p>
              </div>
            </div>

            <div className="mt-5 flex flex-wrap justify-center gap-3">
              {running ? (
                <button
                  type="button"
                  onClick={pause}
                  className={`inline-flex items-center gap-2 rounded-xl border px-5 py-3 text-sm font-semibold ${
                    dark
                      ? "border-neutral-700 bg-neutral-900 text-white hover:bg-neutral-800"
                      : "border-neutral-200 bg-neutral-100 text-neutral-800 hover:bg-neutral-200"
                  }`}
                >
                  <Pause size={17} />
                  Pause
                </button>
              ) : (
                <button
                  type="button"
                  onClick={start}
                  disabled={chosenDuration <= 0 && remainingMs <= 0}
                  className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-5 py-3 text-sm font-semibold text-neutral-950 transition hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <Play size={17} fill="currentColor" />
                  {remainingMs > 0 ? "Resume" : "Start timer"}
                </button>
              )}

              <button
                type="button"
                onClick={reset}
                className={`inline-flex items-center gap-2 rounded-xl border px-5 py-3 text-sm font-semibold transition ${
                  dark
                    ? "border-neutral-800 text-neutral-300 hover:bg-neutral-900"
                    : "border-neutral-200 text-neutral-600 hover:bg-neutral-100"
                }`}
              >
                <RotateCcw size={16} />
                Reset
              </button>
            </div>
          </div>

          <div className="space-y-5">
            <div>
              <p
                className={`mb-3 text-sm font-semibold ${
                  dark ? "text-neutral-300" : "text-neutral-700"
                }`}
              >
                Custom duration
              </p>

              <div className="grid grid-cols-3 gap-3">
                <label className="block">
                  <input
                    aria-label="Hours"
                    disabled={running || remainingMs > 0}
                    type="number"
                    inputMode="numeric"
                    min="0"
                    max="99"
                    value={hours}
                    onChange={(event) => {
                      setHours(clampNumber(event.target.value, 99));
                      setFinished(false);
                    }}
                    className={`${inputClass} disabled:opacity-50`}
                  />
                  <span className="mt-2 block text-center text-xs text-neutral-500">
                    Hours
                  </span>
                </label>

                <label className="block">
                  <input
                    aria-label="Minutes"
                    disabled={running || remainingMs > 0}
                    type="number"
                    inputMode="numeric"
                    min="0"
                    max="59"
                    value={minutes}
                    onChange={(event) => {
                      setMinutes(clampNumber(event.target.value, 59));
                      setFinished(false);
                    }}
                    className={`${inputClass} disabled:opacity-50`}
                  />
                  <span className="mt-2 block text-center text-xs text-neutral-500">
                    Minutes
                  </span>
                </label>

                <label className="block">
                  <input
                    aria-label="Seconds"
                    disabled={running || remainingMs > 0}
                    type="number"
                    inputMode="numeric"
                    min="0"
                    max="59"
                    value={seconds}
                    onChange={(event) => {
                      setSeconds(clampNumber(event.target.value, 59));
                      setFinished(false);
                    }}
                    className={`${inputClass} disabled:opacity-50`}
                  />
                  <span className="mt-2 block text-center text-xs text-neutral-500">
                    Seconds
                  </span>
                </label>
              </div>
            </div>

            <div>
              <p
                className={`mb-3 text-sm font-semibold ${
                  dark ? "text-neutral-300" : "text-neutral-700"
                }`}
              >
                Quick presets
              </p>

              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {PRESETS.map((preset) => (
                  <button
                    key={preset.seconds}
                    type="button"
                    disabled={running}
                    onClick={() => applyPreset(preset.seconds)}
                    className={`rounded-lg border px-3 py-2.5 text-xs font-semibold transition disabled:opacity-40 ${
                      dark
                        ? "border-neutral-800 bg-neutral-900/50 text-neutral-300 hover:border-amber-500/60 hover:text-amber-400"
                        : "border-neutral-200 bg-white text-neutral-600 hover:border-amber-400 hover:text-amber-700"
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            <div
              className={`flex items-start gap-2 rounded-xl p-3 text-xs leading-5 ${
                dark
                  ? "bg-neutral-900 text-neutral-500"
                  : "bg-neutral-50 text-neutral-500"
              }`}
            >
              <AlarmClock
                className="mt-0.5 shrink-0 text-amber-500"
                size={15}
              />
              The sound plays in this page. Keep the tab open and your device
              awake while the timer runs.
            </div>
          </div>
        </div>
      </SectionCard>
    </div>
  );
}
