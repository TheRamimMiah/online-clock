import { BellRing, Check } from "lucide-react";
import Modal from "./Modal.jsx";
import { formatAlarmTime } from "../lib/format.js";

export default function RingingAlarmModal({
  alarm,
  onDismiss,
  theme,
  use24Hour,
}) {
  if (!alarm) return null;

  return (
    <Modal
      title="Alarm is ringing"
      subtitle="Time to check your reminder."
      onClose={onDismiss}
      theme={theme}
      width="max-w-md"
    >
      <div className="flex flex-col items-center py-4 text-center">
        <span className="flex h-16 w-16 animate-pulse items-center justify-center rounded-full bg-amber-500 text-neutral-950">
          <BellRing size={30} />
        </span>

        <p className="mt-5 text-4xl font-semibold tracking-tight text-amber-500">
          {formatAlarmTime(alarm.time, use24Hour)}
        </p>

        <p
          className={`mt-2 text-sm ${
            theme === "dark" ? "text-neutral-400" : "text-neutral-500"
          }`}
        >
          {alarm.label || "Your alarm"}
        </p>

        <button
          type="button"
          onClick={onDismiss}
          autoFocus
          className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-amber-500 px-4 py-3 text-sm font-semibold text-neutral-950 transition hover:bg-amber-400"
        >
          <Check size={17} />
          Dismiss alarm
        </button>
      </div>
    </Modal>
  );
}
