export default function SectionCard({
  title,
  subtitle,
  icon: Icon,
  action,
  children,
  theme = "dark",
  className = "",
}) {
  const dark = theme === "dark";

  return (
    <section
      className={`rounded-2xl border p-4 sm:p-5 ${
        dark
          ? "border-neutral-800 bg-neutral-950/90"
          : "border-neutral-200 bg-white"
      } ${className}`}
    >
      {(title || action) && (
        <div
          className={`mb-4 flex items-center justify-between gap-4 border-b pb-3 ${
            dark ? "border-neutral-800" : "border-neutral-200"
          }`}
        >
          <div className="flex min-w-0 items-center gap-3">
            {Icon && (
              <span
                className={`rounded-xl p-2 ${
                  dark
                    ? "bg-neutral-900 text-amber-400"
                    : "bg-amber-50 text-amber-600"
                }`}
              >
                <Icon size={18} />
              </span>
            )}

            <div className="min-w-0">
              {title && (
                <h2 className="truncate text-base font-semibold sm:text-lg">
                  {title}
                </h2>
              )}

              {subtitle && (
                <p
                  className={`mt-0.5 text-xs ${
                    dark ? "text-neutral-500" : "text-neutral-500"
                  }`}
                >
                  {subtitle}
                </p>
              )}
            </div>
          </div>

          {action}
        </div>
      )}

      {children}
    </section>
  );
}
