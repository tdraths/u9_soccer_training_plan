/**
 * useStorage — abstraction layer for persistence.
 *
 * Currently: localStorage (per-device, no account needed).
 * To swap in Supabase later, replace the get/set/remove calls below
 * with Supabase client calls and add a useEffect to subscribe to
 * real-time changes. The hook signature stays identical so no
 * component code needs to change.
 */

import { useState, useEffect, useCallback } from 'react';

const PREFIX = 'u9soccer_';

function lsGet(key) {
  try {
    const raw = localStorage.getItem(PREFIX + key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function lsSet(key, value) {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(value));
  } catch (e) {
    console.warn('localStorage write failed:', e);
  }
}

function lsRemove(key) {
  try {
    localStorage.removeItem(PREFIX + key);
  } catch {}
}

/**
 * useStorage(key, defaultValue)
 * Returns [value, setValue, clearValue] — behaves like useState
 * but persists to localStorage automatically.
 */
export function useStorage(key, defaultValue) {
  const [value, setInner] = useState(() => lsGet(key) ?? defaultValue);

  const setValue = useCallback((next) => {
    const resolved = typeof next === 'function' ? next(value) : next;
    lsSet(key, resolved);
    setInner(resolved);
  }, [key, value]);

  const clearValue = useCallback(() => {
    lsRemove(key);
    setInner(defaultValue);
  }, [key, defaultValue]);

  return [value, setValue, clearValue];
}
