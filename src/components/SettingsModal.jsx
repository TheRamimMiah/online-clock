import { BellRing, CheckCircle2, Moon, Sun } from "lucide-react";
import Modal from "./Modal.jsx";

export default function SettingsModal({
  onClose,
  theme,
  onToggleTheme,
  onRequestNotifications,
  notificationState,
}) {
  const dark = theme === "dark";

  const rowClass = `flex items-center justify-between gap-4 rounded-xl border p-4 ${
    dark
      ? "border-neutral-800 bg-neutral-900/50"
      : "border-neutral-200 bg-neutral-50"
  }`;

  const textMuted = "text-neutral-500";

  return (
    <Modal
      title="Settings"
      subtitle="Personalize your online clock."
      onClose={onClose}
      theme={theme}
    >
      <div className="space-y-3">
        <div className={rowClass}>
          <div className="flex items-center gap-3">
            <span
              className={`rounded-xl p-2 ${
                dark
                  ? "bg-neutral-800 text-amber-400"
                  : "bg-white text-amber-600"
              }`}
            >
              {dark ? <Moon size={19} /> : <Sun size={19} />}
            </span>

            <div>
              <p className="text-sm font-semibold">Color theme</p>
              <p className={`mt-1 text-xs ${textMuted}`}>
                Choose dark or light appearance.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onToggleTheme}
            className={`rounded-lg px-3 py-2 text-xs font-semibold ${
              dark
                ? "bg-neutral-800 text-neutral-200 hover:bg-neutral-700"
                : "bg-white text-neutral-700 hover:bg-neutral-100"
            }`}
          >
            {dark ? "Dark" : "Light"}
          </button>
        </div>

        <div className={rowClass}>
          <div className="flex items-center gap-3">
            <span
              className={`rounded-xl p-2 ${
                dark
                  ? "bg-neutral-800 text-amber-400"
                  : "bg-white text-amber-600"
              }`}
            >
              {notificationState === "granted" ? (
                <CheckCircle2 size={19} />
              ) : (
                <BellRing size={19} />
              )}
            </span>

            <div>
              <p className="text-sm font-semibold">Browser notifications</p>

              <p className={`mt-1 text-xs ${textMuted}`}>
                {notificationState === "granted"
                  ? "Notifications are allowed."
                  : notificationState === "denied"
                    ? "Blocked by browser settings."
                    : "Optional on-screen alert notifications."}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onRequestNotifications}
            disabled={
              notificationState === "granted" ||
              notificationState === "denied" ||
              notificationState === "unsupported"
            }
            className="rounded-lg bg-amber-500 px-3 py-2 text-xs font-semibold text-neutral-950 transition hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {notificationState === "granted"
              ? "Enabled"
              : notificationState === "denied"
                ? "Blocked"
                : notificationState === "unsupported"
                  ? "Unavailable"
                  : "Enable"}
          </button>
        </div>

        <p className={`px-1 pt-1 text-xs leading-5 ${textMuted}`}>
          Settings and alarm schedules are stored in this browser on this
          device. They are not synced between browsers or devices.
        </p>
      </div>
    </Modal>
  );
}
