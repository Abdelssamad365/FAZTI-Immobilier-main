import type { ListingType, PType } from "./data";

export type Bi = { fr: string; ar: string };
export type FieldType = "tri" | "multi" | "single" | "number";
export type Scope = "all" | "residential" | "rent" | "land" | "commercial";
export type Option = { value: string } & Bi;
export type FieldDef = { key: string; type: FieldType; label: Bi; options?: Option[]; appliesTo: Scope[]; unit?: Bi };
export type TriValue = "yes" | "no" | "unknown";
export type FieldValue = TriValue | string | string[] | number;
export type FieldValues = Record<string, FieldValue | undefined>;

const o = (value: string, fr: string, ar: string): Option => ({ value, fr, ar });

export const TRI_OPTIONS: Option[] = [o("yes", "Oui", "نعم"), o("no", "Non", "لا"), o("unknown", "?", "؟")];

export const FIELDS: FieldDef[] = [
  { key: "papers", type: "single", appliesTo: ["all"], label: { fr: "Papiers", ar: "الوثائق" }, options: [
    o("acte", "Acte notarié", "عقد موثق"), o("livret", "Livret foncier", "دفتر عقاري"), o("acte_livret", "Acte + livret foncier", "عقد + دفتر عقاري"),
    o("decision", "Décision d'attribution", "قرار استفادة"), o("promesse", "Promesse de vente", "وعد بالبيع"), o("timbre", "Papier timbré", "ورقة مختومة"), o("none", "Sans papiers", "بدون وثائق") ] },
  { key: "negotiable", type: "tri", appliesTo: ["all"], label: { fr: "Négociable", ar: "قابل للتفاوض" } },
  { key: "exchange", type: "tri", appliesTo: ["all"], label: { fr: "Échange possible", ar: "تبادل ممكن" } },
  { key: "payment", type: "multi", appliesTo: ["all"], label: { fr: "Paiement", ar: "طريقة الدفع" }, options: [
    o("cash", "Cash", "نقدا"), o("cheque", "Chèque", "صك"), o("virement", "Virement", "تحويل"), o("facilites", "Facilités", "تسهيلات"), o("credit", "Crédit bancaire", "قرض بنكي") ] },
  // Residential
  { key: "floor", type: "number", appliesTo: ["residential"], label: { fr: "Étage", ar: "الطابق" } },
  { key: "yearBuilt", type: "single", appliesTo: ["residential"], label: { fr: "État", ar: "الحالة" }, options: [o("new", "Neuf", "جديد"), o("old", "Ancien", "قديم")] },
  { key: "finish", type: "single", appliesTo: ["residential"], label: { fr: "Finition", ar: "التشطيب" }, options: [
    o("finished", "Finie", "منتهية"), o("semi", "Semi-finie", "نصف منتهية"), o("raw", "Carcasse", "هيكل") ] },
  { key: "gaz", type: "tri", appliesTo: ["residential"], label: { fr: "Gaz de ville", ar: "غاز المدينة" } },
  { key: "water", type: "single", appliesTo: ["residential"], label: { fr: "Eau", ar: "الماء" }, options: [o("h24", "24h/24", "24/24 سا"), o("tranches", "Par tranches", "بالتناوب")] },
  { key: "electricity", type: "tri", appliesTo: ["residential"], label: { fr: "Électricité", ar: "الكهرباء" } },
  { key: "sewage", type: "tri", appliesTo: ["residential"], label: { fr: "Assainissement", ar: "الصرف الصحي" } },
  { key: "clim", type: "tri", appliesTo: ["residential"], label: { fr: "Climatisation", ar: "تكييف" } },
  { key: "heating", type: "tri", appliesTo: ["residential"], label: { fr: "Chauffage", ar: "تدفئة" } },
  { key: "amenities", type: "multi", appliesTo: ["residential"], label: { fr: "Équipements", ar: "المرافق" }, options: [
    o("ascenseur", "Ascenseur", "مصعد"), o("parking", "Parking", "موقف"), o("garage", "Garage", "مرآب"), o("jardin", "Jardin", "حديقة"),
    o("terrasse", "Terrasse", "شرفة"), o("piscine", "Piscine", "مسبح"), o("vuemer", "Vue mer", "إطلالة بحرية"), o("residence", "Résidence fermée", "إقامة مغلقة"),
    o("gardiennage", "Gardiennage", "حراسة"), o("cuisine", "Cuisine équipée", "مطبخ مجهز"), o("citerne", "Citerne", "خزان ماء") ] },
  { key: "scheme", type: "single", appliesTo: ["residential"], label: { fr: "Formule", ar: "الصيغة" }, options: [o("aadl", "AADL", "عدل"), o("lpp", "LPP", "LPP"), o("lsp", "LSP", "LSP"), o("vefa", "VEFA", "VEFA")] },
  // Rent
  { key: "furnished", type: "tri", appliesTo: ["rent"], label: { fr: "Meublé", ar: "مفروش" } },
  { key: "deposit", type: "number", appliesTo: ["rent"], label: { fr: "Caution", ar: "الضمان" }, unit: { fr: "mois", ar: "أشهر" } },
  { key: "allowedTenants", type: "multi", appliesTo: ["rent"], label: { fr: "Locataires acceptés", ar: "المستأجرون المقبولون" }, options: [
    o("familles", "Familles", "عائلات"), o("celibataires", "Célibataires", "عزاب"), o("etudiants", "Étudiants", "طلبة"), o("bureaux", "Bureaux", "مكاتب") ] },
  // Land
  { key: "landUse", type: "single", appliesTo: ["land"], label: { fr: "Vocation", ar: "طبيعة الأرض" }, options: [
    o("constructible", "Constructible", "صالحة للبناء"), o("agricole", "Agricole", "فلاحية"), o("industriel", "Industriel", "صناعية") ] },
  { key: "frontage", type: "number", appliesTo: ["land", "commercial"], label: { fr: "Façade", ar: "الواجهة" }, unit: { fr: "m", ar: "م" } },
  { key: "serviced", type: "tri", appliesTo: ["land"], label: { fr: "Viabilisé", ar: "مهيأ" } },
  { key: "fenced", type: "tri", appliesTo: ["land"], label: { fr: "Clôturé", ar: "مسيج" } },
  // Commercial
  { key: "subtype", type: "single", appliesTo: ["commercial"], label: { fr: "Catégorie", ar: "الفئة" }, options: [
    o("local", "Local", "محل"), o("bureau", "Bureau", "مكتب"), o("depot", "Dépôt", "مستودع"), o("fonds", "Fond de commerce", "قاعدة تجارية") ] },
  { key: "shutter", type: "tri", appliesTo: ["commercial"], label: { fr: "Rideau métallique", ar: "ستار حديدي" } },
  { key: "threePhase", type: "tri", appliesTo: ["commercial"], label: { fr: "Triphasé", ar: "ثلاثي الطور" } },
];

const RESIDENTIAL: PType[] = ["apartment", "villa", "house", "duplex"];

export function scopesFor(type: PType | "", listingType: ListingType): Scope[] {
  const s: Scope[] = ["all"];
  if (!type || RESIDENTIAL.includes(type)) s.push("residential");
  if (!type || type === "land") s.push("land");
  if (!type || type === "commercial") s.push("commercial");
  if (listingType === "rent") s.push("rent");
  return s;
}

export function fieldsFor(type: PType | "", listingType: ListingType) {
  const scopes = scopesFor(type, listingType);
  return FIELDS.filter((f) => f.appliesTo.some((a) => scopes.includes(a)));
}

/** Displayable text for a value, or null if it should be hidden (tri "no"/"unknown", empty). */
export function displayValue(f: FieldDef, v: FieldValue | undefined, lang: "fr" | "ar"): string | null {
  if (v === undefined || v === "" || (Array.isArray(v) && v.length === 0)) return null;
  if (f.type === "tri") return v === "yes" ? (lang === "ar" ? "نعم" : "Oui") : null;
  if (f.type === "number") return `${v}${f.unit ? ` ${f.unit[lang]}` : ""}`;
  const label = (x: string) => f.options?.find((op) => op.value === x)?.[lang] ?? x;
  return Array.isArray(v) ? v.map(label).join(", ") : label(String(v));
}
