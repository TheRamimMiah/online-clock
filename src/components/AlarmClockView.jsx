import { useState } from "react";
import { AlarmClock, Plus, Zap } from "lucide-react";

import DigitalClock from "./DigitalClock.jsx";
import SectionCard from "./SectionCard.jsx";
import AlarmList from "./AlarmList.jsx";

import { QUICK_ALARMS } from "../data/timezones.js";
import { formatAlarmTime } from "../lib/format.js";

export default function AlarmClockView({
  now,
  theme,
  use24Hour,
  alarms,
  onOpenCreate,
  onQuickAdd,
  onToggleAlarm,
  onDeleteAlarm,
  clockSettings,
}) {
  const dark = theme === "dark";

  const [showAllQuickTimes, setShowAllQuickTimes] = useState(false);

  const quickTimes = showAllQuickTimes
    ? QUICK_ALARMS
    : QUICK_ALARMS.slice(0, 16);

  const alarmTimes = new Set(alarms.map((alarm) => alarm.time));

  return (
    <div className="space-y-5">
      <DigitalClock
        now={now}
        use24Hour={use24Hour}
        showDate={clockSettings.showDate}
        showSeconds={clockSettings.showSeconds}
        digitalFont={clockSettings.digitalFont}
        color={clockSettings.color}
        onSetAlarm={onOpenCreate}
        theme={theme}
      />

      <div className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
        <SectionCard
          title="Quick set"
          subtitle="Add a frequently used alarm time"
          icon={Zap}
          theme={theme}
          action={
            <button
              onClick={onOpenCreate}
              type="button"
              className="inline-flex items-center gap-1.5 rounded-lg bg-amber-500 px-3 py-2 text-xs font-semibold text-neutral-950 transition hover:bg-amber-400"
            >
              <Plus size={14} />
              Custom
            </button>
          }
        >
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
            {quickTimes.map((time) => {
              const exists = alarmTimes.has(time);

              return (
                <button
                  type="button"
                  key={time}
                  disabled={exists}
                  onClick={() => onQuickAdd(time)}
                  className={`rounded-lg px-2 py-3 text-xs font-semibold tabular-nums transition sm:text-sm ${
                    exists
                      ? dark
                        ? "cursor-not-allowed border border-neutral-800 bg-neutral-900/40 text-neutral-700"
                        : "cursor-not-allowed border border-neutral-200 bg-neutral-100 text-neutral-400"
                      : "bg-sky-600 text-white hover:bg-sky-500"
                  }`}
                >
                  {formatAlarmTime(time, use24Hour)}
                  {exists && <span className="ml-1 text-[9px]">✓</span>}
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={() => setShowAllQuickTimes((shown) => !shown)}
            className={`mt-3 text-xs font-semibold ${
              dark
                ? "text-amber-400 hover:text-amber-300"
                : "text-amber-700 hover:text-amber-600"
            }`}
          >
            {showAllQuickTimes ? "Show fewer times" : "Show all quick times"}
          </button>
        </SectionCard>

        <SectionCard
          title="Your alarms"
          subtitle={`${alarms.length} saved alarm${alarms.length === 1 ? "" : "s"}`}
          icon={AlarmClock}
          theme={theme}
          action={
            <span
              className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${
                dark
                  ? "bg-neutral-900 text-neutral-400"
                  : "bg-neutral-100 text-neutral-500"
              }`}
            >
              Local
            </span>
          }
        >
          <AlarmList
            alarms={alarms}
            onToggle={onToggleAlarm}
            onDelete={onDeleteAlarm}
            theme={theme}
            use24Hour={use24Hour}
          />
        </SectionCard>
      </div>

      <p
        className={`hidden items-start gap-2 rounded-xl px-1 text-xs leading-5 ${
          dark ? "text-neutral-500" : "text-neutral-500"
        }`}
      >
        <span className="mt-0.5 text-amber-500">ⓘ</span>
        Browser alarms run while this page is open. Keep your device awake,
        allow sound, and avoid closing this tab for reliable alerts.
      </p>
    </div>
  );
}
