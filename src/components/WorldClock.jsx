import { useMemo, useState } from "react";
import { Clock3, Globe2, Search } from "lucide-react";

import SectionCard from "./SectionCard.jsx";
import { WORLD_CITIES } from "../data/timezones.js";

function zonedParts(date, zone, use24Hour) {
  const time = new Intl.DateTimeFormat("en-US", {
    timeZone: zone,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: !use24Hour,
  }).formatToParts(date);

  const read = (type) => time.find((part) => part.type === type)?.value || "";

  return {
    display: `${read("hour")}:${read("minute")}:${read("second")}`,
    meridiem: read("dayPeriod"),
  };
}

function offsetFor(date, zone) {
  const local = new Date(date.toLocaleString("en-US", { timeZone: zone }));

  const utc = new Date(date.toLocaleString("en-US", { timeZone: "UTC" }));

  const minutes = Math.round((local.getTime() - utc.getTime()) / 60000);

  const sign = minutes >= 0 ? "+" : "−";

  return `UTC${sign}${Math.floor(Math.abs(minutes) / 60)}${
    Math.abs(minutes) % 60
      ? `:${String(Math.abs(minutes) % 60).padStart(2, "0")}`
      : ""
  }`;
}

export default function WorldClock({ now, theme, use24Hour }) {
  const dark = theme === "dark";

  const [search, setSearch] = useState("");

  const filteredCities = useMemo(
    () =>
      WORLD_CITIES.filter((item) =>
        `${item.city} ${item.country}`
          .toLowerCase()
          .includes(search.toLowerCase()),
      ),
    [search],
  );

  return (
    <div className="space-y-5">
      <SectionCard
        title="World clock"
        subtitle="Compare the current time in major cities around the world."
        icon={Globe2}
        theme={theme}
        action={
          <span
            className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${
              dark
                ? "bg-neutral-900 text-neutral-500"
                : "bg-neutral-100 text-neutral-500"
            }`}
          >
            {filteredCities.length} CITIES
          </span>
        }
      >
        <label
          className={`mb-5 flex items-center gap-2 rounded-xl border px-3 py-3 ${
            dark
              ? "border-neutral-800 bg-neutral-900/60"
              : "border-neutral-200 bg-neutral-50"
          }`}
        >
          <Search
            size={17}
            className={dark ? "text-neutral-500" : "text-neutral-400"}
          />

          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search city or country..."
            aria-label="Search cities"
            className={`w-full bg-transparent text-sm outline-none ${
              dark
                ? "text-white placeholder:text-neutral-600"
                : "text-neutral-900 placeholder:text-neutral-400"
            }`}
          />
        </label>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {filteredCities.map((city) => {
            const { display, meridiem } = zonedParts(now, city.zone, use24Hour);

            const date = new Intl.DateTimeFormat("en-US", {
              timeZone: city.zone,
              weekday: "short",
              month: "short",
              day: "numeric",
            }).format(now);

            return (
              <article
                key={city.zone}
                className={`rounded-xl border p-4 transition hover:-translate-y-0.5 ${
                  dark
                    ? "border-neutral-800 bg-neutral-900/50 hover:border-neutral-700"
                    : "border-neutral-200 bg-neutral-50 hover:border-neutral-300"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-semibold">{city.city}</h3>

                    <p
                      className={`mt-1 text-xs ${
                        dark ? "text-neutral-500" : "text-neutral-500"
                      }`}
                    >
                      {city.country}
                    </p>
                  </div>

                  <span
                    className={`rounded-lg px-2 py-1 text-[10px] font-bold ${
                      dark
                        ? "bg-neutral-800 text-neutral-400"
                        : "bg-white text-neutral-500"
                    }`}
                  >
                    {city.code}
                  </span>
                </div>

                <div className="mt-5 flex items-baseline gap-1.5">
                  <span
                    className={`text-2xl font-medium tracking-tight tabular-nums ${
                      dark ? "text-white" : "text-neutral-950"
                    }`}
                  >
                    {display}
                  </span>

                  {meridiem && (
                    <span className="text-xs font-semibold text-amber-500">
                      {meridiem}
                    </span>
                  )}
                </div>

                <div
                  className={`mt-3 flex items-center justify-between gap-2 border-t pt-3 text-xs ${
                    dark
                      ? "border-neutral-800 text-neutral-500"
                      : "border-neutral-200 text-neutral-500"
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <Clock3 size={13} />
                    {date}
                  </span>

                  <span>{offsetFor(now, city.zone)}</span>
                </div>
              </article>
            );
          })}
        </div>

        {filteredCities.length === 0 && (
          <div
            className={`py-12 text-center text-sm ${
              dark ? "text-neutral-500" : "text-neutral-500"
            }`}
          >
            No cities match “{search}”.
          </div>
        )}
      </SectionCard>
    </div>
  );
}
