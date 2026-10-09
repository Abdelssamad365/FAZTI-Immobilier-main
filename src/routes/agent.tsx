import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, Users, Video, Check, CalendarClock } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { getNotifications, subscribe, type Notif } from "@/lib/notifications";
import { agent } from "@/lib/data";

export const Route = createFileRoute("/agent")({
  head: () => ({
    meta: [
      { title: "Tableau de bord agent | FAZTI" },
      { name: "description", content: "Gérez vos visites, demandes de visite virtuelle et notifications en temps réel." },
      { property: "og:title", content: "Tableau de bord agent | FAZTI" },
      { property: "og:description", content: "Rendez-vous et notifications en temps réel pour agents FAZTI." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AgentDashboard,
});

type Status = "upcoming" | "pending" | "completed";
type Appt = { id: string; client: string; property: string; when: string; kind: "visit" | "tour"; status: Status };

const seed: Appt[] = [
  { id: "a1", client: "Karim Haddad", property: "Villa vue mer — Canastel", when: "Dim. 11 oct · 10:00", kind: "visit", status: "upcoming" },
  { id: "a2", client: "Nadia Mansouri", property: "F4 Hydra", when: "Lun. 12 oct · 14:30", kind: "tour", status: "upcoming" },
  { id: "a3", client: "Sofiane Bouzid", property: "Duplex Constantine", when: "Mar. 13 oct · 09:00", kind: "visit", status: "pending" },
  { id: "a4", client: "Amina Rahmani", property: "F5 Akid Lotfi", when: "Mer. 14 oct · 16:30", kind: "tour", status: "pending" },
  { id: "a5", client: "Mehdi Cherif", property: "Villa Bousfer", when: "Jeu. 1 oct · 11:00", kind: "visit", status: "completed" },
];

function AgentDashboard() {
  const { t } = useI18n();
  const [tab, setTab] = useState<Status>("pending");
  const [appts, setAppts] = useState(seed);
  const [notifs, setNotifs] = useState<Notif[]>([]);
  const [drawer, setDrawer] = useState(false);

  useEffect(() => {
    const initial = getNotifications();
    setNotifs(initial);
    setAppts((a) => [...initial.map((n) => ({ id: n.id, client: "Client FAZTI", property: n.property, when: n.when, kind: n.kind, status: "pending" as const })), ...a]);
    return subscribe((n) => {
      setNotifs((x) => [n, ...x]);
      setAppts((a) => [{ id: n.id, client: "Client FAZTI", property: n.property, when: n.when, kind: n.kind, status: "pending" }, ...a]);
      setDrawer(true);
    });
  }, []);

  const setStatus = (id: string, status: Status) => setAppts((a) => a.map((x) => (x.id === id ? { ...x, status } : x)));
  const counts = (s: Status) => appts.filter((a) => a.status === s).length;

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-6">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-md bg-brand p-5 text-deep-foreground">
        <div className="min-w-0">
          <p className="text-xs font-semibold opacity-80">{t("dashboard")}</p>
          <h1 className="truncate text-2xl font-extrabold">{agent.name}</h1>
          <p className="truncate text-sm opacity-80">{agent.agency}</p>
        </div>
        <button onClick={() => setDrawer(true)} className="relative shrink-0 rounded-full bg-card p-3 text-foreground" aria-label={t("notifications")}>
          <Bell className="h-5 w-5" />
          {notifs.length > 0 && <span className="absolute -end-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-accent px-1 text-[10px] font-extrabold text-accent-foreground">{notifs.length}</span>}
        </button>
      </div>

      <div className="mt-5 grid grid-cols-3 gap-2 rounded-md bg-card p-1">
        {(["upcoming", "pending", "completed"] as const).map((s) => (
          <button key={s} onClick={() => setTab(s)} className={`rounded px-2 py-2 text-xs font-bold transition-colors sm:text-sm ${tab === s ? "bg-foreground text-deep-foreground" : "text-primary hover:bg-secondary"}`}>
            {t(s)} <span className="opacity-70">({counts(s)})</span>
          </button>
        ))}
      </div>

      <div className="mt-4 space-y-3">
        <AnimatePresence mode="popLayout">
          {appts.filter((a) => a.status === tab).map((a) => (
            <motion.div key={a.id} layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: 40 }} className="rounded-md border border-border bg-card p-4">
              <div className="grid grid-cols-[auto_minmax(0,1fr)] items-start gap-3">
                <div className={`grid h-10 w-10 shrink-0 place-items-center rounded-md ${a.kind === "tour" ? "bg-accent text-accent-foreground" : "bg-secondary text-foreground"}`}>
                  {a.kind === "tour" ? <Video className="h-5 w-5" /> : <Users className="h-5 w-5" />}
                </div>
                <div className="min-w-0">
                  <div className="truncate font-extrabold text-foreground">{a.client}</div>
                  <div className="truncate text-sm text-primary">{a.property}</div>
                  <div className="mt-1 flex items-center gap-1 text-xs font-semibold text-muted-foreground"><CalendarClock className="h-3.5 w-3.5" />{a.when} · {a.kind === "tour" ? t("virtualLive") : t("inPerson")}</div>
                </div>
              </div>
              {a.status !== "completed" && (
                <div className="mt-3 grid grid-cols-2 gap-2">
                  {a.status === "pending" && (
                    <button onClick={() => setStatus(a.id, "upcoming")} className="flex items-center justify-center gap-1.5 rounded-md bg-accent py-2 text-sm font-extrabold text-accent-foreground"><Check className="h-4 w-4" />{t("accept")}</button>
                  )}
                  <button onClick={() => setStatus(a.id, "pending")} className={`rounded-md border border-border py-2 text-sm font-bold text-primary hover:bg-secondary ${a.status === "upcoming" ? "col-span-2" : ""}`}>{t("reschedule")}</button>
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {drawer && (
          <motion.div className="fixed inset-0 z-[2000] bg-foreground/40" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setDrawer(false)}>
            <motion.aside onClick={(e) => e.stopPropagation()} initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 28 }} className="absolute inset-y-0 end-0 w-full max-w-sm overflow-y-auto bg-card p-5 rtl:[--tw-translate-x:0]">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-extrabold text-foreground">{t("notifications")}</h2>
                <span className="flex items-center gap-1.5 text-xs font-bold text-primary"><span className="h-2 w-2 animate-pulse rounded-full bg-accent" />{t("live")}</span>
              </div>
              {notifs.length === 0 && <p className="text-sm text-muted-foreground">—</p>}
              <div className="space-y-2">
                {notifs.map((n) => (
                  <div key={n.id} className="rounded-md border border-border p-3">
                    <div className="text-xs font-bold text-primary">{n.kind === "tour" ? t("tourRequest") : t("newBooking")}</div>
                    <div className="truncate text-sm font-extrabold text-foreground">{n.property}</div>
                    <div className="text-xs text-muted-foreground">{n.when}</div>
                  </div>
                ))}
              </div>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
