import { useEffect, useState } from "react";

export function useNow(interval = 250) {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const tick = () => setNow(new Date());
    const id = window.setInterval(tick, interval);
    tick();
    return () => window.clearInterval(id);
  }, [interval]);

  return now;
}
