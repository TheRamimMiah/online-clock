import { Bell, BellOff, Trash2 } from "lucide-react";
import { WEEKDAYS } from "../data/timezones.js";
import { formatAlarmTime } from "../lib/format.js";

function repeatText(days) {
  if (!days?.length) return "Once";

  if (days.length === 7) return "Every day";

  if (days.length === 5 && [1, 2, 3, 4, 5].every((day) => days.includes(day))) {
    return "Weekdays";
  }

  return days
    .map((value) =>
      WEEKDAYS.find((day) => day.value === value)?.label.slice(0, 3),
    )
    .join(", ");
}

export default function AlarmList({
  alarms,
  onToggle,
  onDelete,
  theme,
  use24Hour,
}) {
  const dark = theme === "dark";

  if (!alarms.length) {
    return (
      <div
        className={`flex min-h-48 flex-col items-center justify-center rounded-xl border border-dashed px-4 py-8 text-center ${
          dark
            ? "border-neutral-800 text-neutral-500"
            : "border-neutral-200 text-neutral-500"
        }`}
      >
        <Bell size={27} className="mb-3 opacity-60" />

        <p
          className={`text-sm font-semibold ${
            dark ? "text-neutral-300" : "text-neutral-700"
          }`}
        >
          No alarms yet
        </p>

        <p className="mt-1 max-w-xs text-xs leading-5">
          Create an alarm or pick a quick time to add your first one.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {alarms.map((alarm) => (
        <div
          key={alarm.id}
          className={`flex items-center gap-3 rounded-xl border p-3 transition ${
            dark
              ? "border-neutral-800 bg-neutral-900/50"
              : "border-neutral-200 bg-neutral-50"
          } ${!alarm.enabled ? "opacity-55" : ""}`}
        >
          <button
            type="button"
            aria-label={alarm.enabled ? "Disable alarm" : "Enable alarm"}
            aria-pressed={alarm.enabled}
            onClick={() => onToggle(alarm.id, !alarm.enabled)}
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
              alarm.enabled
                ? "bg-amber-500 text-neutral-950"
                : dark
                  ? "bg-neutral-800 text-neutral-500"
                  : "bg-neutral-200 text-neutral-500"
            }`}
          >
            {alarm.enabled ? <Bell size={18} /> : <BellOff size={18} />}
          </button>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
              <span
                className={`text-lg font-semibold tabular-nums ${
                  dark ? "text-white" : "text-neutral-900"
                }`}
              >
                {formatAlarmTime(alarm.time, use24Hour)}
              </span>

              {alarm.label && (
                <span
                  className={`truncate text-xs ${
                    dark ? "text-neutral-300" : "text-neutral-600"
                  }`}
                >
                  {alarm.label}
                </span>
              )}
            </div>

            <p
              className={`mt-0.5 text-xs ${
                dark ? "text-neutral-500" : "text-neutral-500"
              }`}
            >
              {repeatText(alarm.days)}
            </p>
          </div>

          <button
            type="button"
            onClick={() => onDelete(alarm.id)}
            aria-label="Delete alarm"
            title="Delete alarm"
            className={`rounded-lg p-2 transition ${
              dark
                ? "text-neutral-600 hover:bg-red-950/60 hover:text-red-400"
                : "text-neutral-400 hover:bg-red-50 hover:text-red-600"
            }`}
          >
            <Trash2 size={17} />
          </button>
        </div>
      ))}
    </div>
  );
}
