# Online Clock

A responsive, browser-based clock toolkit built with React. It brings together alarms, a countdown timer, stopwatch, and world clock in a focused interface with light and dark themes.

## Features

- **Alarm clock** — create, enable, disable, and remove alarms; add labels and optional repeat days.
- **Alarm alerts** — plays an in-page sound and can send a browser notification when permission is granted.
- **Countdown timer** — custom hours, minutes, and seconds, plus common time presets.
- **Stopwatch** — start, pause, reset, and record lap splits.
- **World clock** — view live time across selected cities and time zones.
- **Persistent preferences** — alarm schedules and theme preference are saved locally in the browser.
- **Responsive UI** — designed to work across desktop and mobile screen sizes.

> Alarm sounds and alerts require the page to remain open and the device to stay awake. Alarms and settings are stored only in the current browser and are not synced between devices.

## Tech stack

- [React](https://react.dev/)
- [Vite](https://vite.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Lucide React](https://lucide.dev/)

## Getting started

### Prerequisites

Install a current LTS version of [Node.js](https://nodejs.org/), which includes npm.

### Install and run

```bash
npm install
npm run dev
```

Vite will print a local address (typically `http://localhost:5173`) to open in your browser.

## Available commands

| Command | Description |
| --- | --- |
| `npm run dev` | Start the development server with hot reload. |
| `npm run build` | Create an optimized production build in `dist/`. |
| `npm run preview` | Serve the production build locally. |
| `npm run lint` | Run ESLint across the project. |

## Project structure

```text
src/
├── components/     # UI for alarms, timer, stopwatch, world clock, and modals
├── data/           # Time zones, quick alarms, and weekday data
├── hooks/          # Time, local-storage, and alarm behavior
├── lib/            # Formatting and browser audio helpers
├── App.jsx         # App layout and view selection
└── main.jsx        # React entry point
public/             # Static files, sitemap, and robots.txt
```

## Browser permissions

Browser notifications are optional. Open **Settings** in the app and select **Enable** under Browser notifications to request permission. The clock continues to show its in-page alarm interface even if notifications are unavailable or denied.

## License

No license has been specified for this project.
