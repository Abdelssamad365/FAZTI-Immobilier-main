import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle2, Users, Video, CalendarCheck } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { pushNotification } from "@/lib/notifications";
import { Button } from "@/components/ui/button";

type Props = { open: boolean; onClose: () => void; propertyTitle: string; defaultType?: "in_person" | "virtual" };

const slots = ["09:00", "10:00", "11:00", "13:30", "14:30", "15:30", "16:30"];

export function BookingModal({ open, onClose, propertyTitle, defaultType = "in_person" }: Props) {
  const { t, lang } = useI18n();
  const [type, setType] = useState(defaultType);
  const [day, setDay] = useState(0);
  const [slot, setSlot] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const days = useMemo(() => {
    const out: Date[] = [];
    const d = new Date();
    while (out.length < 10) {
      d.setDate(d.getDate() + 1);
      if (d.getDay() !== 5) out.push(new Date(d)); // Friday off (Algerian weekend)
    }
    return out;
  }, []);
  // Deterministic "busy" slots simulating agent calendar sync
  const busy = (di: number, s: string) => (di * 7 + s.charCodeAt(1) + s.charCodeAt(3)) % 4 === 0;
  const locale = lang === "ar" ? "ar-DZ" : "fr-FR";

  const confirm = () => {
    const selectedDay = days[day];
    if (!slot || !selectedDay) return;
    pushNotification({
      kind: type === "virtual" ? "tour" : "visit",
      property: propertyTitle,
      when: `${days[day]?.toLocaleDateString(locale, { weekday: "short", day: "numeric", month: "short" })} · ${slot}`,
    });
    setDone(true);
  };
  const close = () => { onClose(); setTimeout(() => { setDone(false); setSlot(null); }, 300); };

  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-[2000] flex items-end justify-center bg-foreground/40 p-0 sm:items-center sm:p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={close}>
          <motion.div
            onClick={(e) => e.stopPropagation()}
            initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 40, opacity: 0 }}
            role="dialog" aria-modal="true" aria-label={t("bookTitle")} className="w-full max-w-lg rounded-t-2xl bg-card p-5 shadow-float sm:rounded-md"
          >
            <div className="mb-4 flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h2 className="text-lg font-extrabold text-foreground">{t("bookTitle")}</h2>
                <p className="truncate text-sm text-muted-foreground">{propertyTitle}</p>
              </div>
              <Button variant="ghost" onClick={close} className="shrink-0 rounded-md p-1 text-primary hover:bg-secondary" aria-label={t("close")}><X className="h-5 w-5" /></Button>
            </div>

            {done ? (
              <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="py-8 text-center">
                <CheckCircle2 className="mx-auto h-14 w-14 text-accent" />
                <h3 className="mt-3 text-xl font-extrabold text-foreground">{t("booked")}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{t("bookedMsg")}</p>
                <p className="mt-3 text-sm font-bold text-primary">{days[day]?.toLocaleDateString(locale, { weekday: "long", day: "numeric", month: "long" })} · {slot}</p>
                <Button variant="ghost" onClick={close} className="mt-6 rounded-md bg-foreground px-5 py-2.5 text-sm font-bold text-deep-foreground">{t("close")}</Button>
              </motion.div>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-2 rounded-md bg-secondary p-1">
                  {([["in_person", t("inPerson"), Users], ["virtual", t("virtualLive"), Video]] as const).map(([k, label, Icon]) => (
                    <Button variant="ghost" key={k} onClick={() => setType(k)} className={`flex items-center justify-center gap-2 rounded px-2 py-2 text-xs font-bold transition-colors sm:text-sm ${type === k ? "bg-card text-foreground shadow-sm" : "text-primary"}`}>
                      <Icon className="h-4 w-4 shrink-0" /> <span className="truncate">{label}</span>
                    </Button>
                  ))}
                </div>

                <h3 className="mt-5 mb-2 text-sm font-bold text-foreground">{t("pickDate")}</h3>
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {days.map((d, i) => (
                    <Button variant="ghost" key={i} onClick={() => { setDay(i); setSlot(null); }} className={`flex w-14 shrink-0 flex-col items-center rounded-md border py-2 transition-colors ${day === i ? "border-foreground bg-foreground text-deep-foreground" : "border-border text-foreground hover:border-ring"}`}>
                      <span className="text-[10px] font-semibold uppercase">{d.toLocaleDateString(locale, { weekday: "short" })}</span>
                      <span className="text-lg font-extrabold">{d.getDate()}</span>
                    </Button>
                  ))}
                </div>

                <h3 className="mt-5 mb-2 text-sm font-bold text-foreground">{t("pickTime")}</h3>
                <div className="grid grid-cols-4 gap-2">
                  {slots.map((s) => {
                    const b = busy(day, s);
                    return (
                      <Button variant="ghost" key={s} disabled={b} onClick={() => setSlot(s)} className={`rounded-md border py-2 text-sm font-bold transition-colors disabled:cursor-not-allowed disabled:opacity-35 disabled:line-through ${slot === s ? "border-accent bg-accent text-accent-foreground" : "border-border text-primary hover:border-ring"}`}>
                        {s}
                      </Button>
                    );
                  })}
                </div>
                <p className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground"><CalendarCheck className="h-3.5 w-3.5" /> {t("syncNote")}</p>

                <Button variant="ghost" disabled={!slot} onClick={confirm} className="mt-5 w-full rounded-md bg-accent py-3 text-sm font-extrabold text-accent-foreground transition-opacity disabled:opacity-50">
                  {t("confirm")}
                </Button>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
