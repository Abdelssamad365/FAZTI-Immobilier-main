import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { List, Map as MapIcon, RotateCcw, SlidersHorizontal, X } from "lucide-react";
import { COMMUNES, TYPE_LABELS, WILAYAS, useListings, wilayaBy, type ListingType, type PType } from "@/lib/data";
import { FIELDS, TRI_OPTIONS, fieldsFor, type FieldValue } from "@/lib/fields";
import { shortDZD, useI18n } from "@/lib/i18n";
import { LazyMap } from "@/components/LazyMap";
import { PropertyCard } from "@/components/PropertyCard";
import { FieldInput, chip } from "@/components/FieldInput";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const Route = createFileRoute("/search")({
  head: () => ({
    meta: [
      { title: "Recherche — FAZTI Immobilier" },
      { name: "description", content: "Appartements, villas, terrains et locaux proposés par FAZTI à la vente ou à la location dans les 58 wilayas." },
      { property: "og:title", content: "Recherche — FAZTI Immobilier" },
      { property: "og:description", content: "Achetez ou louez les biens proposés par FAZTI partout en Algérie." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ListingsPage,
});

type Filters = {
  wilaya: string; commune: string; type: PType | ""; min: string; max: string; rooms: number | null;
  area: string; extra: Record<string, FieldValue | undefined>;
};
const EMPTY: Filters = { wilaya: "", commune: "", type: "", min: "", max: "", rooms: null, area: "", extra: {} };
const input = "h-10 w-full rounded-md border border-border bg-card px-3 text-sm font-medium text-foreground outline-none focus:border-ring";
const filterSelect = "h-11 w-full rounded-xl border-border bg-card px-3.5 text-sm font-medium text-foreground shadow-sm transition focus:border-primary/50 focus:ring-4 focus:ring-primary/10 disabled:cursor-not-allowed disabled:opacity-55";

function ListingsPage() {
  const { lang, tx } = useI18n();
  const navigate = useNavigate();
  const all = useListings();
  const [mode, setMode] = useState<ListingType>("sale");
  const [f, setF] = useState<Filters>(EMPTY);
  const [sort, setSort] = useState<"recent" | "asc" | "desc">("recent");
  const [view, setView] = useState<"list" | "map">("list");
  const [showFilters, setShowFilters] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [hover, setHover] = useState<string | null>(null);
  const set = (p: Partial<Filters>) => setF((cur) => ({ ...cur, ...p }));

  const results = useMemo(() => {
    const r = all.filter((l) => {
      if (l.listing_type !== mode) return false;
      if (f.wilaya && l.wilaya !== f.wilaya) return false;
      if (f.commune && l.commune !== f.commune) return false;
      if (f.type && l.type !== f.type) return false;
      if (f.min && l.price < Number(f.min)) return false;
      if (f.max && l.price > Number(f.max)) return false;
      if (f.rooms && (f.rooms === 5 ? l.rooms < 5 : l.rooms !== f.rooms)) return false;
      if (f.area && l.area < Number(f.area)) return false;
      for (const [k, want] of Object.entries(f.extra)) {
        if (want === undefined || (Array.isArray(want) && !want.length)) continue;
        const have = l.fields[k];
        if (Array.isArray(want)) { if (!Array.isArray(have) || !want.every((w) => have.includes(w))) return false; }
        else if (typeof want === "number") { if (typeof have !== "number" || have < want) return false; }
        else if (have !== want) return false;
      }
      return true;
    });
    return r.sort((a, b) => sort === "asc" ? a.price - b.price : sort === "desc" ? b.price - a.price : b.createdAt.localeCompare(a.createdAt));
  }, [all, mode, f, sort]);

  const label = (k: string) => FIELDS.find((x) => x.key === k);
  const chips: { key: string; text: string; clear: () => void }[] = [];
  if (f.wilaya) chips.push({ key: "w", text: wilayaBy(f.wilaya)?.[lang] ?? "", clear: () => set({ wilaya: "", commune: "" }) });
  if (f.commune) chips.push({ key: "c", text: COMMUNES[f.wilaya]?.find((c) => c.fr === f.commune)?.[lang] ?? f.commune, clear: () => set({ commune: "" }) });
  if (f.type) chips.push({ key: "t", text: TYPE_LABELS[f.type][lang], clear: () => set({ type: "" }) });
  if (f.min) chips.push({ key: "min", text: `≥ ${Number(f.min).toLocaleString()} DA`, clear: () => set({ min: "" }) });
  if (f.max) chips.push({ key: "max", text: `≤ ${Number(f.max).toLocaleString()} DA`, clear: () => set({ max: "" }) });
  if (f.rooms) chips.push({ key: "r", text: `F${f.rooms}${f.rooms === 5 ? "+" : ""}`, clear: () => set({ rooms: null }) });
  if (f.area) chips.push({ key: "a", text: `≥ ${f.area} m²`, clear: () => set({ area: "" }) });
  for (const [k, v] of Object.entries(f.extra)) {
    const def = label(k);
    if (!def || v === undefined || (Array.isArray(v) && !v.length)) continue;
    const opt = (x: string) => (def.type === "tri" ? TRI_OPTIONS : def.options ?? []).find((o) => o.value === x)?.[lang] ?? x;
    const text = typeof v === "number" ? `${v}` : Array.isArray(v) ? v.map(opt).join(", ") : opt(v);
    chips.push({ key: k, text: `${def.label[lang]} : ${text}`, clear: () => set({ extra: { ...f.extra, [k]: undefined } }) });
  }
  const reset = () => setF(EMPTY);

  const filtersPanel = (
    <div className="space-y-5">
      <div className="space-y-3.5">
        <p className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-muted-foreground">{tx("Localisation", "الموقع")}</p>
        <label className="block space-y-1.5"><span className="text-xs font-bold text-foreground">{tx("Wilaya", "الولاية")}</span>
          <Select value={f.wilaya || "__all__"} onValueChange={(value) => set({ wilaya: value === "__all__" ? "" : value, commune: "" })}>
            <SelectTrigger className={filterSelect}><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="__all__">{tx("Toutes les wilayas", "كل الولايات")}</SelectItem>
              {WILAYAS.map((w) => <SelectItem key={w.code} value={w.code}>{w.code} - {w[lang]}</SelectItem>)}
            </SelectContent>
          </Select>
        </label>
        <label className="block space-y-1.5"><span className="text-xs font-bold text-foreground">{tx("Commune", "البلدية")}</span>
          {COMMUNES[f.wilaya] ? (
            <Select value={f.commune || "__all__"} onValueChange={(value) => set({ commune: value === "__all__" ? "" : value })}>
              <SelectTrigger className={filterSelect}><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="__all__">{tx("Toutes les communes", "كل البلديات")}</SelectItem>
                {(COMMUNES[f.wilaya] ?? []).map((c) => <SelectItem key={c.fr} value={c.fr}>{c[lang]}</SelectItem>)}
              </SelectContent>
            </Select>
          ) : (
            <input value={f.commune} onChange={(e) => set({ commune: e.target.value })} disabled={!f.wilaya}
              placeholder={f.wilaya ? tx("Saisir une commune", "أدخل البلدية") : tx("Choisissez d'abord une wilaya", "اختر الولاية أولا")}
              className={`${filterSelect} disabled:bg-secondary/60`} />
          )}
        </label>
      </div>
      <div className="space-y-3.5 border-t border-border pt-4">
        <p className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-muted-foreground">{tx("Votre recherche", "بحثك")}</p>
        <label className="block space-y-1.5"><span className="text-xs font-bold text-foreground">{tx("Type de bien", "نوع العقار")}</span>
          <Select value={f.type || "__all__"} onValueChange={(value) => set({ type: value === "__all__" ? "" : value as PType, extra: {} })}>
            <SelectTrigger className={filterSelect}><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="__all__">{tx("Tous types", "كل الأنواع")}</SelectItem>
              {(Object.keys(TYPE_LABELS) as PType[]).map((k) => <SelectItem key={k} value={k}>{TYPE_LABELS[k][lang]}</SelectItem>)}
            </SelectContent>
          </Select>
        </label>
      </div>
      <div className="space-y-1.5 border-t border-border pt-4"><span className="text-xs font-bold text-foreground">{tx("Prix (DA)", "السعر (د.ج)")}</span>
        <div className="grid grid-cols-2 gap-2">
          <input type="number" min={0} value={f.min} onChange={(e) => set({ min: e.target.value })} placeholder={tx("Min", "من")} className={input} />
          <input type="number" min={0} value={f.max} onChange={(e) => set({ max: e.target.value })} placeholder={tx("Max", "إلى")} className={input} />
        </div>
      </div>
      <div className="space-y-1"><span className="text-xs font-bold text-foreground">{tx("Pièces", "الغرف")}</span>
        <div className="flex flex-wrap gap-1.5">{[1, 2, 3, 4, 5].map((n) => (
          <button key={n} type="button" aria-pressed={f.rooms === n} onClick={() => set({ rooms: f.rooms === n ? null : n })} className={chip(f.rooms === n)}>F{n}{n === 5 ? "+" : ""}</button>
        ))}</div>
      </div>
      <label className="block space-y-1"><span className="text-xs font-bold text-foreground">{tx("Surface min (m²)", "المساحة الدنيا (م²)")}</span>
        <input type="number" min={0} value={f.area} onChange={(e) => set({ area: e.target.value })} className={input} />
      </label>
      <Button type="button" variant="outline" className="w-full" onClick={() => setShowMore((v) => !v)}><SlidersHorizontal />{tx("Autres filtres", "فلاتر أخرى")}</Button>
      {showMore && (
        <div className="space-y-3 rounded-md border border-border bg-background p-3">
          {fieldsFor(f.type, mode).map((def) => (
            <FieldInput key={def.key} f={def} value={f.extra[def.key]} onChange={(v) => set({ extra: { ...f.extra, [def.key]: v } })} />
          ))}
        </div>
      )}
    </div>
  );

  const points = results.map((p) => ({ id: p.id, lat: p.lat, lng: p.lng, label: shortDZD(p.price, lang, p.listing_type === "rent") }));

  return (
    <main className="mx-auto w-full max-w-[1440px] flex-1 px-4 py-4 sm:px-6 sm:py-5 xl:px-8">
      <div className="mb-4 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2 sm:flex sm:flex-wrap">
        <div role="tablist" className="inline-flex h-10 w-full items-center rounded-xl border border-border/80 bg-card p-0.5 shadow-sm sm:w-auto">
          {([["sale", "Acheter", "شراء"], ["rent", "Louer", "كراء"]] as const).map(([v, fr, ar]) => (
            <button key={v} role="tab" aria-selected={mode === v} onClick={() => { setMode(v); set({ extra: {} }); }}
              className={`h-9 flex-1 rounded-lg px-3 text-sm font-extrabold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:flex-none sm:px-5 ${mode === v ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:bg-secondary hover:text-foreground"}`}>{tx(fr, ar)}</button>
          ))}
        </div>
        <Button variant="outline" className="h-10 px-3 lg:hidden" onClick={() => setShowFilters((v) => !v)}><SlidersHorizontal />{tx("Filtres", "تصفية")}</Button>
        <div className="col-span-2 flex min-w-0 items-center gap-2 sm:col-span-1 sm:ms-auto">
          <Select value={sort} onValueChange={(value) => setSort(value as typeof sort)}>
            <SelectTrigger className="h-10 min-w-0 flex-1 rounded-xl border-border bg-card px-3 text-sm font-semibold sm:w-40 sm:flex-none"><SelectValue aria-label={tx("Trier", "ترتيب")} /></SelectTrigger>
            <SelectContent>
              <SelectItem value="recent">{tx("Plus récent", "الأحدث")}</SelectItem>
              <SelectItem value="asc">{tx("Prix ↑", "السعر ↑")}</SelectItem>
              <SelectItem value="desc">{tx("Prix ↓", "السعر ↓")}</SelectItem>
            </SelectContent>
          </Select>
          <div className="inline-flex h-10 items-center rounded-xl border border-border/80 bg-card p-0.5 shadow-sm">
            <button onClick={() => setView("list")} aria-label={tx("Liste", "القائمة")} aria-pressed={view === "list"} className={`grid h-9 w-9 place-items-center rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${view === "list" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}><List className="h-4 w-4" /></button>
            <button onClick={() => setView("map")} aria-label={tx("Carte", "الخريطة")} aria-pressed={view === "map"} className={`grid h-9 w-9 place-items-center rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${view === "map" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}><MapIcon className="h-4 w-4" /></button>
          </div>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-[280px_minmax(0,1fr)] 2xl:grid-cols-[300px_minmax(0,1fr)]">
        <aside className={`${showFilters ? "block" : "hidden"} rounded-2xl border border-border/80 bg-card p-4 shadow-sm lg:sticky lg:top-[4.75rem] lg:block lg:max-h-[calc(100vh-5.75rem)] lg:overflow-y-auto`}>
          <div className="mb-4 flex items-center justify-between border-b border-border pb-3">
            <div className="flex items-center gap-2.5">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary/10 text-primary"><SlidersHorizontal className="h-4 w-4" /></span>
              <h2 className="text-sm font-extrabold text-foreground">{tx("Filtres", "التصفية")}</h2>
              {chips.length > 0 && <span className="grid h-5 min-w-5 place-items-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">{chips.length}</span>}
            </div>
            <div className="flex items-center gap-2">
              {chips.length > 0 && <button type="button" onClick={reset} className="text-xs font-bold text-primary hover:underline">{tx("Effacer", "مسح")}</button>}
              <button type="button" onClick={() => setShowFilters(false)} aria-label={tx("Fermer les filtres", "إغلاق الفلاتر")} className="grid h-8 w-8 place-items-center rounded-lg text-muted-foreground hover:bg-secondary lg:hidden"><X className="h-4 w-4" /></button>
            </div>
          </div>
          {filtersPanel}
        </aside>
        <section className="min-w-0 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-bold text-foreground">{results.length} {tx("annonces", "إعلان")}</span>
            {chips.map((c) => (
              <button key={c.key} onClick={c.clear} className="flex items-center gap-1 rounded-full bg-accent/50 px-2.5 py-1 text-xs font-semibold text-foreground hover:bg-accent">
                {c.text}<X className="h-3 w-3" aria-label={tx("Retirer", "إزالة")} />
              </button>
            ))}
            {chips.length > 0 && <button onClick={reset} className="flex items-center gap-1 text-xs font-bold text-primary underline"><RotateCcw className="h-3 w-3" />{tx("Réinitialiser", "إعادة تعيين")}</button>}
          </div>
          {view === "map" ? (
            <div className="h-[70vh] overflow-hidden rounded-2xl border border-border shadow-sm">
              <LazyMap key={results.map((r) => r.id).join()} points={points} activeId={hover} onHover={setHover} onSelect={(id) => navigate({ to: "/property/$id", params: { id } })} fitPoints />
            </div>
          ) : results.length === 0 ? (
            <p className="rounded-2xl border border-border bg-card py-10 text-center text-sm text-muted-foreground sm:col-span-2">{tx("Aucune annonce ne correspond à vos critères.", "لا توجد إعلانات مطابقة.")}</p>
          ) : (
            <div className="grid items-start gap-5 sm:grid-cols-2 2xl:gap-6">
              {results.map((p) => <PropertyCard key={p.id} p={p} active={hover === p.id} onHover={setHover} />)}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
