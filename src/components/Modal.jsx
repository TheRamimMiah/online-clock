import { useEffect } from "react";
import { X } from "lucide-react";

export default function Modal({
  title,
  subtitle,
  onClose,
  children,
  theme = "dark",
  width = "max-w-lg",
}) {
  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === "Escape") onClose?.();
    };

    window.addEventListener("keydown", onKeyDown);

    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  const dark = theme === "dark";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose?.();
        }
      }}
      role="presentation"
    >
      <section
        aria-modal="true"
        role="dialog"
        aria-label={title}
        className={`w-full ${width} max-h-[90vh] overflow-y-auto rounded-2xl border p-5 shadow-2xl sm:p-6 ${
          dark
            ? "border-neutral-800 bg-neutral-950 text-neutral-100"
            : "border-neutral-200 bg-white text-neutral-900"
        }`}
      >
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold">{title}</h2>

            {subtitle && (
              <p
                className={`mt-1 text-sm ${
                  dark ? "text-neutral-400" : "text-neutral-500"
                }`}
              >
                {subtitle}
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className={`rounded-lg p-2 transition ${
              dark ? "hover:bg-neutral-800" : "hover:bg-neutral-100"
            }`}
          >
            <X size={20} />
          </button>
        </div>

        {children}
      </section>
    </div>
  );
}
