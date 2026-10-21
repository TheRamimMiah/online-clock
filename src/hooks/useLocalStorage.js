import { useCallback, useState } from "react";

export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const saved = window.localStorage.getItem(key);

      return saved === null ? initialValue : JSON.parse(saved);
    } catch {
      return initialValue;
    }
  });

  const setStoredValue = useCallback(
    (nextValue) => {
      setValue((current) => {
        const resolved =
          typeof nextValue === "function" ? nextValue(current) : nextValue;

        try {
          window.localStorage.setItem(key, JSON.stringify(resolved));
        } catch {
          // The app remains usable if storage is disabled or full.
        }

        return resolved;
      });
    },
    [key],
  );

  return [value, setStoredValue];
}
