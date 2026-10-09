import { useSyncExternalStore } from "react";

const KEY = "fazti-favorites";
const EMPTY: string[] = [];
let favs: string[] = EMPTY;
let loaded = false;
const subs = new Set<() => void>();

function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  try { favs = JSON.parse(localStorage.getItem(KEY) ?? "[]") as string[]; } catch { favs = EMPTY; }
}

export function toggleFavorite(id: string) {
  load();
  favs = favs.includes(id) ? favs.filter((f) => f !== id) : [id, ...favs];
  localStorage.setItem(KEY, JSON.stringify(favs));
  subs.forEach((f) => f());
}

export function useFavorites() {
  return useSyncExternalStore(
    (cb) => { subs.add(cb); return () => subs.delete(cb); },
    () => { load(); return favs; },
    () => EMPTY,
  );
}
