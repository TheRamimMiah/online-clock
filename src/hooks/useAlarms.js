import { useEffect, useRef, useState } from "react";
import { useLocalStorage } from "./useLocalStorage.js";
import { DEFAULT_ALARM_SOUND, startAlarmSound } from "../lib/sound.js";

function getDateKey(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
    2,
    "0",
  )}-${String(date.getDate()).padStart(2, "0")}`;
}

export function useAlarms() {
  const [alarms, setAlarms] = useLocalStorage("online-clock-alarms-v1", []);

  const [ringingAlarm, setRingingAlarm] = useState(null);
  const lastMinuteRef = useRef("");
  const stopSoundRef = useRef(null);

  useEffect(
    () => () => {
      stopSoundRef.current?.();
    },
    [],
  );

  useEffect(() => {
    const checkAlarms = () => {
      const now = new Date();
      const dateKey = getDateKey(now);

      const minuteKey = `${dateKey}-${String(now.getHours()).padStart(
        2,
        "0",
      )}:${String(now.getMinutes()).padStart(2, "0")}`;

      if (lastMinuteRef.current === minuteKey) return;

      lastMinuteRef.current = minuteKey;

      const matching = alarms.filter((alarm) => {
        const currentTime = `${String(now.getHours()).padStart(
          2,
          "0",
        )}:${String(now.getMinutes()).padStart(2, "0")}`;

        if (!alarm.enabled || alarm.time !== currentTime) {
          return false;
        }

        if (alarm.days?.length && !alarm.days.includes(now.getDay())) {
          return false;
        }

        if (alarm.lastFiredDate === dateKey) return false;

        return true;
      });

      if (!matching.length) return;

      const active = matching[0];

      stopSoundRef.current?.();
      setRingingAlarm(active);
      stopSoundRef.current = startAlarmSound({
        sound: active.sound || DEFAULT_ALARM_SOUND,
        repeat: active.repeatSound !== false,
      });

      setAlarms((current) =>
        current.map((alarm) => {
          if (!matching.some((candidate) => candidate.id === alarm.id)) {
            return alarm;
          }

          return alarm.days?.length
            ? { ...alarm, lastFiredDate: dateKey }
            : {
                ...alarm,
                enabled: false,
                lastFiredDate: dateKey,
              };
        }),
      );

      if ("Notification" in window && Notification.permission === "granted") {
        try {
          new Notification(active.label || "Alarm", {
            body: "Your online clock alarm is ringing.",
          });
        } catch {
          // The in-page alarm still works if notifications fail.
        }
      }
    };

    const id = window.setInterval(checkAlarms, 1000);

    checkAlarms();

    return () => window.clearInterval(id);
  }, [alarms, setAlarms]);

  const addAlarm = (alarm) => {
    setAlarms((current) =>
      [
        ...current,
        {
          id: crypto.randomUUID?.() || `${Date.now()}-${Math.random()}`,
          label: "",
          days: [],
          enabled: true,
          lastFiredDate: null,
          sound: DEFAULT_ALARM_SOUND,
          repeatSound: true,
          ...alarm,
        },
      ].sort((a, b) => a.time.localeCompare(b.time)),
    );
  };

  const updateAlarm = (id, updates) => {
    setAlarms((current) =>
      current.map((alarm) =>
        alarm.id === id ? { ...alarm, ...updates } : alarm,
      ),
    );
  };

  const removeAlarm = (id) => {
    setAlarms((current) => current.filter((alarm) => alarm.id !== id));
  };

  const dismissAlarm = () => {
    stopSoundRef.current?.();
    stopSoundRef.current = null;
    setRingingAlarm(null);
  };

  return {
    alarms,
    addAlarm,
    updateAlarm,
    removeAlarm,
    ringingAlarm,
    dismissAlarm,
  };
}
