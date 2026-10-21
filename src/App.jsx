import { useEffect, useState } from "react";
import {
  AlarmClock,
  ArrowUpRight,
  Clock3,
  Globe2,
  Timer,
  Watch,
} from "lucide-react";

import AppHeader from "./components/AppHeader.jsx";
import AppSidebar, { VIEWS } from "./components/AppSidebar.jsx";
import AlarmClockView from "./components/AlarmClockView.jsx";
import AlarmFormModal from "./components/AlarmFormModal.jsx";
import CountdownTimer from "./components/CountdownTimer.jsx";
import Stopwatch from "./components/Stopwatch.jsx";
import WorldClock from "./components/WorldClock.jsx";
import SettingsModal from "./components/SettingsModal.jsx";
import RingingAlarmModal from "./components/RingingAlarmModal.jsx";

import { useAlarms } from "./hooks/useAlarms.js";
import { useLocalStorage } from "./hooks/useLocalStorage.js";
import { useNow } from "./hooks/useNow.js";
import { unlockAudio } from "./lib/sound.js";

const VIEW_META = {
  alarm: {
    eyebrow: "YOUR DAILY ROUTINE",
    title: "Alarm clock",
    icon: AlarmClock,
  },
  timer: {
    eyebrow: "STAY FOCUSED",
    title: "Countdown timer",
    description: "Set a duration and let the clock keep track for you.",
    icon: Timer,
  },
  stopwatch: {
    eyebrow: "TRACK EVERY SECOND",
    title: "Stopwatch",
    description: "Measure elapsed time, record laps, and stay in rhythm.",
    icon: Watch,
  },
  world: {
    eyebrow: "TIME AROUND THE WORLD",
    title: "World clock",
    description: "See the current local time in cities across the globe.",
    icon: Globe2,
  },
};

export default function App() {
  const now = useNow(1000);

  const [theme, setTheme] = useLocalStorage("online-clock-theme-v1", "dark");

  const [activeView, setActiveView] = useState("alarm");
  const [showAlarmForm, setShowAlarmForm] = useState(false);
  const [initialAlarmTime, setInitialAlarmTime] = useState(undefined);
  const [showSettings, setShowSettings] = useState(false);

  const [notificationState, setNotificationState] = useState(() =>
    "Notification" in window ? Notification.permission : "unsupported",
  );

  const {
    alarms,
    addAlarm,
    updateAlarm,
    removeAlarm,
    ringingAlarm,
    dismissAlarm,
  } = useAlarms();

  const dark = theme === "dark";
  const meta = VIEW_META[activeView];
  const CurrentIcon = meta.icon;

  useEffect(() => {
    document.documentElement.style.colorScheme = dark ? "dark" : "light";

    document.title =
      activeView === "alarm"
        ? "Online Clock — Alarm Clock, Timer, Stopwatch & World Clock"
        : `${meta.title} — Online Clock`;
  }, [dark, activeView, meta.title]);

  const openAlarmForm = (time) => {
    setInitialAlarmTime(time);
    setShowAlarmForm(true);
  };

  const handleQuickAdd = (time) => {
    unlockAudio();

    addAlarm({
      time,
      label: "",
      days: [],
      enabled: true,
      lastFiredDate: null,
    });
  };

  const requestNotifications = async () => {
    if (!("Notification" in window)) {
      setNotificationState("unsupported");
      return;
    }

    try {
      const permission = await Notification.requestPermission();

      setNotificationState(permission);
    } catch {
      setNotificationState("denied");
    }
  };

  return (
    <div
      id="home"
      className={`min-h-screen ${
        dark
          ? "bg-neutral-950 text-neutral-100"
          : "bg-neutral-100 text-neutral-950"
      }`}
    >
      <AppHeader
        theme={theme}
        onToggleTheme={() => setTheme(dark ? "light" : "dark")}
        onOpenSettings={() => setShowSettings(true)}
      />

      <div className="mx-auto flex min-h-[calc(100vh-76px)] max-w-[1800px]">
        <AppSidebar
          activeView={activeView}
          onChange={setActiveView}
          theme={theme}
        />

        <main className="min-w-0 flex-1 px-4 pb-24 pt-6 sm:px-6 sm:pt-8 lg:px-8 lg:pb-10">
          <div className="mx-auto max-w-315">
            <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="mb-2 text-[10px] font-bold tracking-[0.24em] text-amber-500">
                  {meta.eyebrow}
                </p>

                <h1 className="flex items-center gap-3 text-2xl font-semibold tracking-tight sm:text-3xl">
                  <span
                    className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                      dark
                        ? "bg-neutral-900 text-amber-400"
                        : "bg-white text-amber-600 shadow-sm"
                    }`}
                  >
                    <CurrentIcon size={21} />
                  </span>

                  {meta.title}
                </h1>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-neutral-500">
                  {meta.description}
                </p>
              </div>

              <div
                className={`hidden items-center gap-2 rounded-full border px-3 py-2 text-xs sm:flex ${
                  dark
                    ? "border-neutral-800 bg-neutral-900/60 text-neutral-400"
                    : "border-neutral-200 bg-white text-neutral-500"
                }`}
              >
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                Live local time
                <span className="text-neutral-500">•</span>
                {now.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true,
                })}
              </div>
            </div>

            <div className={activeView === "alarm" ? "block" : "hidden"}>
              <AlarmClockView
                now={now}
                theme={theme}
                use24Hour={false}
                alarms={alarms}
                onOpenCreate={() => openAlarmForm()}
                onQuickAdd={handleQuickAdd}
                onToggleAlarm={(id, enabled) => updateAlarm(id, { enabled })}
                onDeleteAlarm={removeAlarm}
              />
            </div>

            <div className={activeView === "timer" ? "block" : "hidden"}>
              <CountdownTimer theme={theme} />
            </div>

            <div className={activeView === "stopwatch" ? "block" : "hidden"}>
              <Stopwatch theme={theme} />
            </div>

            <div className={activeView === "world" ? "block" : "hidden"}>
              <WorldClock now={now} theme={theme} use24Hour={false} />
            </div>

            <footer
              className={`mt-8 flex flex-col gap-3 border-t pt-5 text-xs sm:flex-row sm:items-center sm:justify-between ${
                dark
                  ? "border-neutral-900 text-neutral-600"
                  : "border-neutral-200 text-neutral-500"
              }`}
            >
              <div className="flex items-center gap-2">
                <Clock3 size={14} />
                <span>© {new Date().getFullYear()} online-clock.com</span>
                <span>·</span>
                <span>Simple tools. Better timing.</span>
              </div>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                {VIEWS.map((view) => (
                  <button
                    key={view.id}
                    type="button"
                    onClick={() => setActiveView(view.id)}
                    className="transition hover:text-amber-500"
                  >
                    {view.label}
                  </button>
                ))}

                <a
                  href="https://online-clock.com"
                  className="inline-flex items-center gap-1 transition hover:text-amber-500"
                >
                  Website <ArrowUpRight size={12} />
                </a>
              </div>
            </footer>
          </div>
        </main>
      </div>

      {showAlarmForm && (
        <AlarmFormModal
          theme={theme}
          initialTime={initialAlarmTime}
          onClose={() => setShowAlarmForm(false)}
          onSave={addAlarm}
        />
      )}

      {showSettings && (
        <SettingsModal
          theme={theme}
          onClose={() => setShowSettings(false)}
          onToggleTheme={() => setTheme(dark ? "light" : "dark")}
          onRequestNotifications={requestNotifications}
          notificationState={notificationState}
        />
      )}

      <RingingAlarmModal
        alarm={ringingAlarm}
        onDismiss={dismissAlarm}
        theme={theme}
        use24Hour={false}
      />
    </div>
  );
}
