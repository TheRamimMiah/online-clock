import { BellRing, Check, CheckCircle2, Moon, Sun } from "lucide-react";
import Modal from "./Modal.jsx";

const CLOCK_COLORS = [
  { id: "white", label: "White", className: "bg-white ring-1 ring-neutral-300" },
  { id: "amber", label: "Amber", className: "bg-amber-500" },
  { id: "red", label: "Red", className: "bg-red-500" },
  { id: "green", label: "Green", className: "bg-emerald-500" },
  { id: "blue", label: "Blue", className: "bg-blue-500" },
];

function SettingToggle({ label, description, checked, onChange, dark }) {
  return (
    <div className="flex items-center justify-between gap-4 py-1.5">
      <div>
        <p className="text-sm font-semibold">{label}</p>
        {description && (
          <p className="mt-0.5 text-xs text-neutral-500">{description}</p>
        )}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={() => onChange(!checked)}
        className={`relative h-7 w-12 shrink-0 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 ${
          dark ? "focus-visible:ring-offset-neutral-950" : "focus-visible:ring-offset-white"
        } ${checked ? "bg-emerald-500" : dark ? "bg-neutral-700" : "bg-neutral-300"}`}
      >
        <span
          className={`absolute left-1 top-1 h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${
            checked ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </button>
    </div>
  );
}

export default function SettingsModal({
  onClose,
  theme,
  onToggleTheme,
  onRequestNotifications,
  notificationState,
  clockSettings,
  onUpdateClockSettings,
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
      <div className="space-y-4">
        <div className={rowClass}>
          <div
            className={`w-full divide-y ${
              dark ? "divide-neutral-800" : "divide-neutral-200"
            }`}
          >
            <SettingToggle
              label="Digital font"
              description="Use seven-segment digits on the main clock."
              checked={clockSettings.digitalFont}
              onChange={(digitalFont) => onUpdateClockSettings({ digitalFont })}
              dark={dark}
            />
            <SettingToggle
              label="12-hour time"
              description="Show AM and PM instead of 24-hour time."
              checked={clockSettings.use12Hour}
              onChange={(use12Hour) => onUpdateClockSettings({ use12Hour })}
              dark={dark}
            />
            <SettingToggle
              label="Show date"
              checked={clockSettings.showDate}
              onChange={(showDate) => onUpdateClockSettings({ showDate })}
              dark={dark}
            />
            <SettingToggle
              label="Show seconds"
              checked={clockSettings.showSeconds}
              onChange={(showSeconds) => onUpdateClockSettings({ showSeconds })}
              dark={dark}
            />
          </div>
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
              {dark ? <Moon size={19} /> : <Sun size={19} />}
            </span>

            <div>
              <p className="text-sm font-semibold">Night mode</p>
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
            {dark ? "On" : "Off"}
          </button>
        </div>

        <div className={rowClass}>
          <div className="w-full">
            <p className="text-sm font-semibold">Clock color</p>
            <p className={`mt-1 text-xs ${textMuted}`}>
              Pick a color for the main clock digits.
            </p>
            <div className="mt-3 flex items-center gap-3">
              {CLOCK_COLORS.map((color) => {
                const selected = clockSettings.color === color.id;
                return (
                  <button
                    key={color.id}
                    type="button"
                    onClick={() => onUpdateClockSettings({ color: color.id })}
                    aria-label={`${color.label} clock color`}
                    aria-pressed={selected}
                    className={`flex h-8 w-8 items-center justify-center rounded-full transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 ${
                      dark ? "focus-visible:ring-offset-neutral-950" : "focus-visible:ring-offset-white"
                    } ${color.className} ${selected ? "ring-2 ring-offset-2 " + (dark ? "ring-offset-neutral-950 ring-white" : "ring-offset-white ring-neutral-900") : "hover:scale-110"}`}
                  >
                    {selected && (
                      <Check
                        size={16}
                        strokeWidth={3}
                        className={color.id === "white" || color.id === "amber" ? "text-neutral-900" : "text-white"}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
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
