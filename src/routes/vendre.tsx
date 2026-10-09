import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, type DragEvent } from "react";
import { CheckCircle2, ImagePlus, Star, X } from "lucide-react";
import { z } from "zod";
import { addListing, AGENCY_NAME, COMMUNES, TYPE_LABELS, WILAYAS, wilayaBy, type ListingType, type PType } from "@/lib/data";
import { fieldsFor, type FieldValues } from "@/lib/fields";
import { cleanPhone, isValidPhone } from "@/lib/contact";
import { useI18n } from "@/lib/i18n";
import { FieldInput, chip } from "@/components/FieldInput";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/vendre")({
  head: () => ({
    meta: [
      { title: "Déposer une annonce gratuite — FAZTI Immobilier" },
      { name: "description", content: "Publiez gratuitement votre bien à vendre ou à louer en Algérie, sans inscription." },
      { property: "og:title", content: "Vendre ou louer mon bien — FAZTI Immobilier" },
      { property: "og:description", content: "Déposez votre annonce immobilière en quelques minutes." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: SellPage,
});

const MAX_PHOTOS = 10;
const input = "h-10 w-full rounded-md border border-border bg-card px-3 text-sm text-foreground outline-none focus:border-ring";

const readFile = (file: File) => new Promise<string>((res, rej) => {
  const r = new FileReader(); r.onload = () => res(String(r.result)); r.onerror = rej; r.readAsDataURL(file);
});

function SellPage() {
  const { lang, tx } = useI18n();
  const [lt, setLt] = useState<ListingType>("sale");
  const [type, setType] = useState<PType>("apartment");
  const [wilaya, setWilaya] = useState("31");
  const [commune, setCommune] = useState("");
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [price, setPrice] = useState("");
  const [area, setArea] = useState("");
  const [rooms, setRooms] = useState(3);
  const [photos, setPhotos] = useState<string[]>([]);
  const [video, setVideo] = useState("");
  const [phone, setPhone] = useState("");
  const [wa, setWa] = useState("");
  const [fields, setFields] = useState<FieldValues>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [doneId, setDoneId] = useState<string | null>(null);
  const [drag, setDrag] = useState(false);

  const addFiles = async (files: FileList | null) => {
    if (!files) return;
    const imgs = Array.from(files).filter((f) => f.type.startsWith("image/")).slice(0, MAX_PHOTOS - photos.length);
    const urls = await Promise.all(imgs.map(readFile));
    setPhotos((p) => [...p, ...urls].slice(0, MAX_PHOTOS));
  };
  const onDrop = (e: DragEvent) => { e.preventDefault(); setDrag(false); void addFiles(e.dataTransfer.files); };

  const submit = () => {
    const schema = z.object({
      title: z.string().trim().min(5).max(120), desc: z.string().trim().min(10).max(3000),
      price: z.coerce.number().positive().max(1e12), area: z.coerce.number().positive().max(1e7),
      video: z.string().trim().url().max(500).or(z.literal("")),
    });
    const r = schema.safeParse({ title, desc, price, area, video });
    const e: Record<string, string> = {};
    if (!r.success) for (const i of r.error.issues) e[String(i.path[0])] = tx("Champ invalide", "حقل غير صالح");
    if (!isValidPhone(phone)) e["phone"] = tx("Format : +213… ou 05/06/07…", "الصيغة: ‎+213… أو 05/06/07…");
    if (wa && !isValidPhone(wa)) e["wa"] = tx("Numéro WhatsApp invalide", "رقم واتساب غير صالح");
    setErrors(e);
    if (Object.keys(e).length) return;
    const w = wilayaBy(wilaya);
    const id = `FZ-${Date.now().toString().slice(-6)}`;
    const t = title.trim(), d = desc.trim();
    addListing({
      id, listing_type: lt, type, wilaya, commune: commune || (w?.fr ?? ""),
      title: { fr: t, ar: t }, description: { fr: d, ar: d },
      price: Number(price), area: Number(area), rooms: ["land", "commercial"].includes(type) ? 0 : rooms,
      lat: (w?.lat ?? 36) + (Math.random() - 0.5) * 0.05, lng: (w?.lng ?? 3) + (Math.random() - 0.5) * 0.05,
      images: photos, videos: video.trim() ? [video.trim()] : [], createdAt: new Date().toISOString(),
      publisher: { kind: "agency", name: AGENCY_NAME, slug: "fazti-immobilier", phone: cleanPhone(phone), whatsapp: wa ? cleanPhone(wa) : undefined },
      fields,
    });
    setDoneId(id);
    window.scrollTo({ top: 0 });
  };

  if (doneId) {
    return (
      <main className="mx-auto w-full max-w-xl p-4">
        <div className="rounded-md border border-border bg-card p-8 text-center">
          <CheckCircle2 className="mx-auto h-14 w-14 text-accent" />
          <h1 className="mt-3 text-xl font-extrabold text-foreground">{tx("Annonce publiée !", "تم نشر الإعلان!")}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{tx("Référence", "المرجع")} {doneId} · {tx("Elle apparaît en tête des résultats.", "يظهر في أعلى النتائج.")}</p>
          <div className="mt-5 flex justify-center gap-2">
            <Button asChild><Link to="/property/$id" params={{ id: doneId }}>{tx("Voir l'annonce", "عرض الإعلان")}</Link></Button>
            <Button asChild variant="outline"><Link to="/">{tx("Toutes les annonces", "كل الإعلانات")}</Link></Button>
          </div>
        </div>
      </main>
    );
  }

  const err = (k: string) => errors[k] && <span className="text-xs font-semibold text-destructive">{errors[k]}</span>;
  const lbl = (fr: string, ar: string, req = false) => <span className="text-xs font-bold text-foreground">{tx(fr, ar)}{req && " *"}</span>;

  return (
    <main className="mx-auto w-full max-w-2xl p-3 sm:p-4">
      <h1 className="mb-1 text-2xl font-extrabold text-foreground">{tx("Déposer une annonce", "أضف إعلانا")}</h1>
      <p className="mb-4 text-sm text-muted-foreground">{tx("Gratuit, sans inscription.", "مجانا ودون تسجيل.")}</p>
      <form onSubmit={(e) => { e.preventDefault(); submit(); }} className="space-y-4 rounded-md border border-border bg-card p-4">
        <div className="flex gap-1.5">{([["sale", "Vente", "بيع"], ["rent", "Location", "كراء"]] as const).map(([v, fr, ar]) => (
          <button type="button" key={v} aria-pressed={lt === v} onClick={() => { setLt(v); setFields({}); }} className={chip(lt === v)}>{tx(fr, ar)}</button>
        ))}</div>
        <div className="space-y-1">{lbl("Type de bien", "نوع العقار", true)}
          <div className="flex flex-wrap gap-1.5">{(Object.keys(TYPE_LABELS) as PType[]).map((k) => (
            <button type="button" key={k} aria-pressed={type === k} onClick={() => { setType(k); setFields({}); }} className={chip(type === k)}>{TYPE_LABELS[k][lang]}</button>
          ))}</div>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="space-y-1">{lbl("Wilaya", "الولاية", true)}
            <select value={wilaya} onChange={(e) => { setWilaya(e.target.value); setCommune(""); }} className={input}>
              {WILAYAS.map((w) => <option key={w.code} value={w.code}>{w.code} - {w[lang]}</option>)}
            </select>
          </label>
          <label className="space-y-1">{lbl("Commune", "البلدية")}
            {COMMUNES[wilaya]
              ? <select value={commune} onChange={(e) => setCommune(e.target.value)} className={input}><option value="">—</option>{COMMUNES[wilaya].map((c) => <option key={c.fr} value={c.fr}>{c[lang]}</option>)}</select>
              : <input value={commune} maxLength={60} onChange={(e) => setCommune(e.target.value)} className={input} />}
          </label>
        </div>
        <label className="block space-y-1">{lbl("Titre", "العنوان", true)}<input value={title} maxLength={120} onChange={(e) => setTitle(e.target.value)} className={input} />{err("title")}</label>
        <label className="block space-y-1">{lbl("Description", "الوصف", true)}<textarea value={desc} maxLength={3000} rows={4} onChange={(e) => setDesc(e.target.value)} className={`${input} h-auto py-2`} />{err("desc")}</label>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="space-y-1">{lbl(lt === "rent" ? "Loyer (DA / mois)" : "Prix (DA)", lt === "rent" ? "الإيجار (د.ج / شهر)" : "السعر (د.ج)", true)}<input type="number" min={0} value={price} onChange={(e) => setPrice(e.target.value)} className={input} />{err("price")}</label>
          <label className="space-y-1">{lbl("Surface (m²)", "المساحة (م²)", true)}<input type="number" min={0} value={area} onChange={(e) => setArea(e.target.value)} className={input} />{err("area")}</label>
        </div>
        {!["land", "commercial"].includes(type) && (
          <div className="space-y-1">{lbl("Pièces", "الغرف")}
            <div className="flex gap-1.5">{[1, 2, 3, 4, 5].map((n) => <button type="button" key={n} aria-pressed={rooms === n} onClick={() => setRooms(n)} className={chip(rooms === n)}>F{n}{n === 5 ? "+" : ""}</button>)}</div>
          </div>
        )}

        <div className="space-y-2">{lbl(`Photos (max ${MAX_PHOTOS}, la 1re = couverture)`, `الصور (${MAX_PHOTOS} كحد أقصى، الأولى = الغلاف)`)}
          <label onDragOver={(e) => { e.preventDefault(); setDrag(true); }} onDragLeave={() => setDrag(false)} onDrop={onDrop}
            className={`flex cursor-pointer flex-col items-center gap-1 rounded-md border-2 border-dashed p-6 text-center text-sm font-semibold text-primary ${drag ? "border-accent bg-accent/20" : "border-ring bg-background"}`}>
            <ImagePlus className="h-7 w-7" />{tx("Glissez vos photos ici ou cliquez", "اسحب صورك هنا أو انقر")}
            <input type="file" accept="image/*" multiple className="sr-only" onChange={(e) => void addFiles(e.target.files)} />
          </label>
          {photos.length > 0 && (
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
              {photos.map((src, i) => (
                <div key={i} className="relative aspect-square overflow-hidden rounded">
                  <img src={src} alt="" className="h-full w-full object-cover" />
                  {i === 0
                    ? <span className="absolute start-1 top-1 rounded bg-accent px-1 text-[10px] font-bold text-accent-foreground">{tx("Couverture", "الغلاف")}</span>
                    : <button type="button" onClick={() => setPhotos((p) => [src, ...p.filter((_, j) => j !== i)])} aria-label={tx("Définir comme couverture", "اجعلها غلافا")} className="absolute start-1 top-1 rounded bg-card/90 p-0.5 text-primary"><Star className="h-3 w-3" /></button>}
                  <button type="button" onClick={() => setPhotos((p) => p.filter((_, j) => j !== i))} aria-label={tx("Supprimer", "حذف")} className="absolute end-1 top-1 rounded bg-card/90 p-0.5 text-destructive"><X className="h-3 w-3" /></button>
                </div>
              ))}
            </div>
          )}
        </div>
        <label className="block space-y-1">{lbl("Lien vidéo (YouTube ou mp4)", "رابط الفيديو (يوتيوب أو mp4)")}<input value={video} onChange={(e) => setVideo(e.target.value)} placeholder="https://" className={input} />{err("video")}</label>

        <div className="space-y-2 rounded-md bg-background p-3">
          <div className="flex items-center gap-2 text-sm font-bold text-foreground">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary/10 text-primary">FZ</span>
            {tx(`Annonce publiée par ${AGENCY_NAME}`, `إعلان من ${AGENCY_NAME}`)}
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="space-y-1">{lbl("Téléphone", "الهاتف", true)}<input type="tel" dir="ltr" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="0550 12 34 56" className={input} />{err("phone")}</label>
            <label className="space-y-1">{lbl("WhatsApp (optionnel)", "واتساب (اختياري)")}<input type="tel" dir="ltr" value={wa} onChange={(e) => setWa(e.target.value)} placeholder="+213…" className={input} />{err("wa")}</label>
          </div>
        </div>

        <details className="rounded-md border border-border p-3">
          <summary className="cursor-pointer text-sm font-bold text-foreground">{tx("Détails optionnels", "تفاصيل اختيارية")}</summary>
          <div className="mt-3 space-y-3">
            {fieldsFor(type, lt).map((f) => <FieldInput key={f.key} f={f} value={fields[f.key]} onChange={(v) => setFields((c) => ({ ...c, [f.key]: v }))} />)}
          </div>
        </details>

        <div className="sticky bottom-0 -mx-4 -mb-4 border-t border-border bg-card p-3">
          <Button type="submit" className="h-11 w-full bg-foreground text-deep-foreground hover:bg-primary">{tx("Publier l'annonce", "نشر الإعلان")}</Button>
        </div>
      </form>
    </main>
  );
}
