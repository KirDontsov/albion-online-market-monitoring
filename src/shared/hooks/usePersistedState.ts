import { useState, useEffect, useCallback } from "react";

export function usePersistedState<T>(
  key: string,
  defaultValue: T
): [T, (value: T | ((prev: T) => T)) => void] {
  const [value, setValue] = useState<T>(() => {
    try {
      const saved = localStorage.getItem(key);
      return saved !== null ? (JSON.parse(saved) as T) : defaultValue;
    } catch {
      return defaultValue;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
    }
  }, [key, value]);

  const setPersistedValue = useCallback(
    (next: T | ((prev: T) => T)) => {
      setValue(next);
    },
    []
  );

  return [value, setPersistedValue];
}
