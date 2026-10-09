// Demo-only realtime bus: syncs bookings to the agent dashboard across tabs
// via localStorage + BroadcastChannel. Swap for a realtime backend channel later.
export type Notif = { id: string; kind: "visit" | "tour"; property: string; when: string; at: number };

const KEY = "fazti-notifs";
const CH = "fazti-realtime";

export function getNotifications(): Notif[] {
  try { return JSON.parse(localStorage.getItem(KEY) || "[]"); } catch { return []; }
}

export function pushNotification(n: Omit<Notif, "id" | "at">) {
  const item: Notif = { ...n, id: crypto.randomUUID(), at: Date.now() };
  const all = [item, ...getNotifications()].slice(0, 30);
  localStorage.setItem(KEY, JSON.stringify(all));
  new BroadcastChannel(CH).postMessage(item);
}

export function subscribe(cb: (n: Notif) => void) {
  const ch = new BroadcastChannel(CH);
  ch.onmessage = (e) => cb(e.data as Notif);
  return () => ch.close();
}
