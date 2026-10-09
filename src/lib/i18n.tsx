import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Lang = "fr" | "ar";

const dict = {
  fr: {
    search: "Rechercher", sell: "Vendre", agent: "Espace agent",
    location: "Ville ou quartier", type: "Type", anyType: "Tous types", price: "Prix max",
    anyPrice: "Tout prix", apartment: "Appartement", villa: "Villa", house: "Maison", duplex: "Duplex",
    results: "biens trouvés", beds: "ch.", baths: "sdb", area: "m²",
    filters: "Filtres", showMap: "Carte", showList: "Liste",
    tour360: "Visite 360°", launchTour: "Lancer la visite 360°", amenities: "Équipements",
    floorPlan: "Plan", description: "Description", specs: "Caractéristiques",
    requestTour: "Demander une visite virtuelle", scheduleVisit: "Planifier une visite",
    agentLabel: "Agent certifié", responds: "Répond en ~1h",
    bookTitle: "Réserver une visite", inPerson: "Visite sur place", virtualLive: "Visite virtuelle guidée",
    pickDate: "Choisissez une date", pickTime: "Choisissez un créneau", confirm: "Confirmer la réservation",
    booked: "Visite confirmée !", bookedMsg: "L'agent a été notifié instantanément.", close: "Fermer",
    syncNote: "Disponibilités synchronisées avec l'agenda de l'agent",
    listTitle: "Publier votre bien", step: "Étape", stepAddress: "Adresse & position",
    stepMedia: "Photos HD", stepSpecs: "Visite 360° & détails", address: "Adresse",
    addressPh: "Ex : Boulevard de l'ALN, Oran", pinHint: "Cliquez sur la carte pour placer l'épingle",
    dropPhotos: "Glissez vos photos haute résolution ici", orBrowse: "ou parcourir",
    cover: "Couverture", setCover: "Définir couverture", tourUrl: "Lien visite 360° (Matterport, Kuula…)",
    priceDzd: "Prix (DA)", bedrooms: "Chambres", bathrooms: "Salles de bain", areaM2: "Surface (m²)",
    previous: "Précédent", continue: "Continuer", publish: "Publier", published: "Annonce publiée !",
    dashboard: "Tableau de bord agent", notifications: "Notifications", upcoming: "À venir",
    pending: "En attente", completed: "Terminées", accept: "Accepter", reschedule: "Reporter",
    newBooking: "Nouvelle réservation", tourRequest: "Demande de visite virtuelle", live: "En direct",
    back: "Retour", notFound: "Bien introuvable",
  },
  ar: {
    search: "بحث", sell: "بيع", agent: "فضاء الوكيل",
    location: "مدينة أو حي", type: "النوع", anyType: "كل الأنواع", price: "السعر الأقصى",
    anyPrice: "أي سعر", apartment: "شقة", villa: "فيلا", house: "منزل", duplex: "دوبلكس",
    results: "عقار متاح", beds: "غرف", baths: "حمام", area: "م²",
    filters: "تصفية", showMap: "الخريطة", showList: "القائمة",
    tour360: "جولة 360°", launchTour: "ابدأ الجولة 360°", amenities: "المرافق",
    floorPlan: "المخطط", description: "الوصف", specs: "المواصفات",
    requestTour: "اطلب جولة افتراضية", scheduleVisit: "حجز زيارة",
    agentLabel: "وكيل معتمد", responds: "يرد خلال ساعة تقريبا",
    bookTitle: "حجز زيارة", inPerson: "زيارة حضورية", virtualLive: "جولة افتراضية مباشرة",
    pickDate: "اختر التاريخ", pickTime: "اختر الوقت", confirm: "تأكيد الحجز",
    booked: "تم تأكيد الزيارة!", bookedMsg: "تم إشعار الوكيل فورا.", close: "إغلاق",
    syncNote: "المواعيد متزامنة مع رزنامة الوكيل",
    listTitle: "انشر عقارك", step: "خطوة", stepAddress: "العنوان والموقع",
    stepMedia: "صور عالية الدقة", stepSpecs: "جولة 360° والتفاصيل", address: "العنوان",
    addressPh: "مثال: شارع جيش التحرير، وهران", pinHint: "انقر على الخريطة لتحديد الموقع",
    dropPhotos: "اسحب صورك عالية الدقة هنا", orBrowse: "أو تصفح",
    cover: "الغلاف", setCover: "اجعلها غلافا", tourUrl: "رابط الجولة 360°",
    priceDzd: "السعر (د.ج)", bedrooms: "الغرف", bathrooms: "الحمامات", areaM2: "المساحة (م²)",
    previous: "السابق", continue: "متابعة", publish: "نشر", published: "تم نشر الإعلان!",
    dashboard: "لوحة تحكم الوكيل", notifications: "الإشعارات", upcoming: "القادمة",
    pending: "قيد الانتظار", completed: "المنتهية", accept: "قبول", reschedule: "تأجيل",
    newBooking: "حجز جديد", tourRequest: "طلب جولة افتراضية", live: "مباشر",
    back: "رجوع", notFound: "العقار غير موجود",
  },
} as const;

export type TKey = keyof typeof dict.fr;

type Ctx = { lang: Lang; setLang: (l: Lang) => void; t: (k: TKey) => string; tx: (fr: string, ar: string) => string; dir: "rtl" | "ltr" };
const I18nCtx = createContext<Ctx | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("fr");
  useEffect(() => {
    const saved = localStorage.getItem("fazti-lang") as Lang | null;
    if (saved === "ar" || saved === "fr") setLang(saved);
  }, []);
  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    localStorage.setItem("fazti-lang", lang);
  }, [lang]);
  const value: Ctx = { lang, setLang, t: (k) => dict[lang][k], tx: (fr, ar) => (lang === "ar" ? ar : fr), dir: lang === "ar" ? "rtl" : "ltr" };
  return <I18nCtx.Provider value={value}>{children}</I18nCtx.Provider>;
}

export function useI18n() {
  const c = useContext(I18nCtx);
  if (!c) throw new Error("useI18n outside provider");
  return c;
}

/** Full DZD price, e.g. "24 000 000 DA" / "24٬000٬000 د.ج" */
export function formatDZD(v: number, lang: Lang) {
  const n = new Intl.NumberFormat(lang === "ar" ? "ar-DZ" : "fr-DZ").format(v);
  return lang === "ar" ? `${n} د.ج` : `${n} DA`;
}

/** Compact marker label; sales use centime-based Algerian amounts, rentals use DA. */
export function shortDZD(v: number, lang: Lang, rent = false) {
  if (rent) {
    const compact = new Intl.NumberFormat(lang === "ar" ? "ar-DZ" : "fr-DZ", { notation: "compact", maximumFractionDigits: 1 }).format(v);
    return lang === "ar" ? `${compact} د.ج/شهر` : `${compact} DA/mois`;
  }
  const format = new Intl.NumberFormat(lang === "ar" ? "ar-DZ" : "fr-DZ");
  const millions = Math.round(v / 1e4);
  if (millions >= 1000) {
    const milliards = Math.floor(millions / 1000);
    const remainder = millions % 1000;
    const billionLabel = format.format(milliards);
    const millionLabel = format.format(remainder);
    if (lang === "ar") return remainder ? `${billionLabel} مليار ${millionLabel} مليون` : `${billionLabel} مليار`;
    return remainder ? `${billionLabel} Mrd ${millionLabel} M` : `${billionLabel} Mrd`;
  }
  const m = format.format(millions);
  return lang === "ar" ? `${m} مليون` : `${m} M`;
}

/** Algerian listing price: Millions of centimes, grouped into milliards when needed. */
export function listingPrice(v: number, rent: boolean, lang: Lang) {
  if (rent) return `${formatDZD(v, lang)} ${lang === "ar" ? "/ شهر" : "/ mois"}`;
  const format = new Intl.NumberFormat(lang === "ar" ? "ar-DZ" : "fr-DZ");
  const millions = Math.round(v / 1e4);
  if (millions >= 1000) {
    const milliards = Math.floor(millions / 1000);
    const remainder = millions % 1000;
    const billionLabel = format.format(milliards);
    const millionLabel = format.format(remainder);
    if (lang === "ar") return remainder ? `${billionLabel} مليار و ${millionLabel} مليون` : `${billionLabel} مليار`;
    return remainder ? `${billionLabel} ${milliards === 1 ? "Milliard" : "Milliards"} et ${millionLabel} Millions` : `${billionLabel} ${milliards === 1 ? "Milliard" : "Milliards"}`;
  }
  const m = format.format(millions);
  return lang === "ar" ? `${m} مليون` : `${m} Millions`;
}

export function relativeDate(iso: string, lang: Lang) {
  const diff = (new Date(iso).getTime() - Date.now()) / 1000;
  const rtf = new Intl.RelativeTimeFormat(lang === "ar" ? "ar" : "fr", { numeric: "auto" });
  const abs = Math.abs(diff);
  if (abs < 3600) return rtf.format(Math.round(diff / 60), "minute");
  if (abs < 86400) return rtf.format(Math.round(diff / 3600), "hour");
  if (abs < 2592000) return rtf.format(Math.round(diff / 86400), "day");
  return rtf.format(Math.round(diff / 2592000), "month");
}
