import { useSyncExternalStore } from "react";
import type { Bi, FieldValues } from "./fields";

const p1 = "/assets/p1.jpg";
const p2 = "/assets/p2.jpg";
const p3 = "/assets/p3.jpg";
const p4 = "/assets/p4.jpg";

/** The brand / agency name shown in the header. Change it here only. */
export const AGENCY_NAME = "FAZTI Immobilier";

export type PType = "apartment" | "villa" | "house" | "duplex" | "land" | "commercial";
export type ListingType = "sale" | "rent";
export type Publisher = { kind: "agency"; name: string; slug?: string | undefined; phone: string; whatsapp?: string | undefined };

export type Listing = {
  id: string;
  listing_type: ListingType;
  type: PType;
  title: Bi;
  description: Bi;
  wilaya: string; // wilaya code, e.g. "31"
  commune: string; // commune French name (key)
  price: number; // DA (per month when rent)
  rooms: number; // F-number; 5 means 5+
  area: number;
  lat: number;
  lng: number;
  images: string[];
  videos: string[];
  createdAt: string;
  publisher: Publisher;
  fields: FieldValues;
  has360?: boolean;
};

export const TYPE_LABELS: Record<PType, Bi> = {
  apartment: { fr: "Appartement", ar: "شقة" }, villa: { fr: "Villa", ar: "فيلا" }, house: { fr: "Maison", ar: "منزل" },
  duplex: { fr: "Duplex", ar: "دوبلكس" }, land: { fr: "Terrain", ar: "أرض" }, commercial: { fr: "Local", ar: "محل" },
};

export type Wilaya = { code: string; fr: string; ar: string; lat: number; lng: number };
const W = (code: string, fr: string, ar: string, lat = 36, lng = 3): Wilaya => ({ code, fr, ar, lat, lng });
export const WILAYAS: Wilaya[] = [
  W("01", "Adrar", "أدرار", 27.87, -0.29), W("02", "Chlef", "الشلف", 36.16, 1.33), W("03", "Laghouat", "الأغواط", 33.8, 2.88), W("04", "Oum El Bouaghi", "أم البواقي", 35.87, 7.11),
  W("05", "Batna", "باتنة", 35.55, 6.17), W("06", "Béjaïa", "بجاية", 36.75, 5.06), W("07", "Biskra", "بسكرة", 34.85, 5.73), W("08", "Béchar", "بشار", 31.62, -2.22),
  W("09", "Blida", "البليدة", 36.47, 2.83), W("10", "Bouira", "البويرة", 36.37, 3.9), W("11", "Tamanrasset", "تمنراست", 22.79, 5.52), W("12", "Tébessa", "تبسة", 35.4, 8.12),
  W("13", "Tlemcen", "تلمسان", 34.88, -1.31), W("14", "Tiaret", "تيارت", 35.37, 1.32), W("15", "Tizi Ouzou", "تيزي وزو", 36.71, 4.05), W("16", "Alger", "الجزائر", 36.75, 3.06),
  W("17", "Djelfa", "الجلفة", 34.67, 3.25), W("18", "Jijel", "جيجل", 36.82, 5.77), W("19", "Sétif", "سطيف", 36.19, 5.41), W("20", "Saïda", "سعيدة", 34.83, 0.15),
  W("21", "Skikda", "سكيكدة", 36.88, 6.91), W("22", "Sidi Bel Abbès", "سيدي بلعباس", 35.19, -0.63), W("23", "Annaba", "عنابة", 36.9, 7.76), W("24", "Guelma", "قالمة", 36.46, 7.43),
  W("25", "Constantine", "قسنطينة", 36.37, 6.61), W("26", "Médéa", "المدية", 36.26, 2.75), W("27", "Mostaganem", "مستغانم", 35.93, 0.09), W("28", "M'Sila", "المسيلة", 35.7, 4.54),
  W("29", "Mascara", "معسكر", 35.4, 0.14), W("30", "Ouargla", "ورقلة", 31.95, 5.33), W("31", "Oran", "وهران", 35.7, -0.63), W("32", "El Bayadh", "البيض", 33.68, 1.02),
  W("33", "Illizi", "إليزي", 26.5, 8.48), W("34", "Bordj Bou Arréridj", "برج بوعريريج", 36.07, 4.76), W("35", "Boumerdès", "بومرداس", 36.76, 3.48), W("36", "El Tarf", "الطارف", 36.77, 8.31),
  W("37", "Tindouf", "تندوف", 27.67, -8.15), W("38", "Tissemsilt", "تيسمسيلت", 35.6, 1.81), W("39", "El Oued", "الوادي", 33.37, 6.86), W("40", "Khenchela", "خنشلة", 35.43, 7.14),
  W("41", "Souk Ahras", "سوق أهراس", 36.29, 7.95), W("42", "Tipaza", "تيبازة", 36.59, 2.45), W("43", "Mila", "ميلة", 36.45, 6.26), W("44", "Aïn Defla", "عين الدفلى", 36.26, 1.97),
  W("45", "Naâma", "النعامة", 33.27, -0.31), W("46", "Aïn Témouchent", "عين تموشنت", 35.3, -1.14), W("47", "Ghardaïa", "غرداية", 32.49, 3.67), W("48", "Relizane", "غليزان", 35.74, 0.56),
  W("49", "Timimoun", "تيميمون", 29.26, 0.24), W("50", "Bordj Badji Mokhtar", "برج باجي مختار", 21.33, 0.95), W("51", "Ouled Djellal", "أولاد جلال", 34.42, 5.07), W("52", "Béni Abbès", "بني عباس", 30.13, -2.17),
  W("53", "In Salah", "عين صالح", 27.2, 2.48), W("54", "In Guezzam", "عين قزام", 19.57, 5.77), W("55", "Touggourt", "تقرت", 33.1, 6.06), W("56", "Djanet", "جانت", 24.55, 9.48),
  W("57", "El M'Ghair", "المغير", 33.95, 5.92), W("58", "El Menia", "المنيعة", 30.58, 2.88),
];

export const COMMUNES: Record<string, Bi[]> = {
  "16": [{ fr: "Hydra", ar: "حيدرة" }, { fr: "Kouba", ar: "القبة" }, { fr: "Bab Ezzouar", ar: "باب الزوار" }, { fr: "Casbah", ar: "القصبة" }, { fr: "Chéraga", ar: "الشراقة" }, { fr: "Dély Ibrahim", ar: "دالي إبراهيم" }, { fr: "El Biar", ar: "الأبيار" }],
  "31": [{ fr: "Oran", ar: "وهران" }, { fr: "Bir El Djir", ar: "بئر الجير" }, { fr: "Es Sénia", ar: "السانية" }, { fr: "Aïn El Turck", ar: "عين الترك" }, { fr: "Arzew", ar: "أرزيو" }, { fr: "Canastel", ar: "كناستيل" }],
  "25": [{ fr: "Constantine", ar: "قسنطينة" }, { fr: "El Khroub", ar: "الخروب" }, { fr: "Ali Mendjeli", ar: "علي منجلي" }, { fr: "Hamma Bouziane", ar: "حامة بوزيان" }],
  "19": [{ fr: "Sétif", ar: "سطيف" }, { fr: "El Eulma", ar: "العلمة" }, { fr: "Aïn Arnat", ar: "عين أرنات" }, { fr: "Aïn Oulmene", ar: "عين ولمان" }],
  "23": [{ fr: "Annaba", ar: "عنابة" }, { fr: "El Bouni", ar: "البوني" }, { fr: "Seraïdi", ar: "سرايدي" }, { fr: "Sidi Amar", ar: "سيدي عمار" }],
};

export const wilayaBy = (code: string) => WILAYAS.find((w) => w.code === code);
export const communeLabel = (wilaya: string, commune: string, lang: "fr" | "ar") =>
  COMMUNES[wilaya]?.find((c) => c.fr === commune)?.[lang] ?? commune;

export type Agency = { slug: string; name: string; phone: string; whatsapp: string; wilaya: string; logoText: string; about: Bi };
export const AGENCIES: Agency[] = [
  { slug: "fazti-immobilier", name: AGENCY_NAME, phone: "+213550123456", whatsapp: "+213550123456", wilaya: "31", logoText: "FZ",
    about: { fr: "Agence immobilière à Oran et Alger, spécialisée dans les biens haut de gamme.", ar: "وكالة عقارية في وهران والجزائر، متخصصة في العقارات الراقية." } },
];
export const agencyBy = (slug?: string) => AGENCIES.find((a) => a.slug === slug);
const agencyPublisher = (slug: string): Publisher => {
  const a = AGENCIES.find((x) => x.slug === slug) ?? AGENCIES[0]!;
  return { kind: "agency", name: a.name, slug: a.slug, phone: a.phone, whatsapp: a.whatsapp };
};

/** Agent shown on the agency dashboard. */
export const agent = { name: "Yasmine Benali", agency: AGENCY_NAME, phone: "+213 550 12 34 56", initials: "YB" };

const ago = (days: number) => new Date(Date.now() - days * 864e5).toISOString();

export const SEED_LISTINGS: Listing[] = [
  { id: "FZ-1001", listing_type: "sale", type: "villa", price: 85000000, rooms: 5, area: 420, wilaya: "31", commune: "Canastel", lat: 35.7425, lng: -0.5764,
    title: { fr: "Villa familiale sur plusieurs niveaux", ar: "فيلا عائلية متعددة الطوابق" }, images: ["/houses/4/photo_2026-10-09_00-03-32.jpg", "/houses/4/photo_2026-10-09_00-03-36.jpg", "/houses/4/photo_2026-10-09_00-03-43.jpg", "/houses/4/photo_2026-10-09_00-03-49.jpg"], videos: [], createdAt: ago(0.1), has360: true,
    description: { fr: "Une maison spacieuse organisée sur plusieurs niveaux, avec escalier intérieur, séjour lumineux et finitions carrelées. Située à Canastel, Oran.", ar: "منزل واسع موزع على عدة طوابق، يضم سلما داخليا وغرفة جلوس مضيئة وتشطيبات بالبلاط. يقع في كناستيل، وهران." },
    publisher: agencyPublisher("fazti-immobilier"),
    fields: { papers: "acte_livret", negotiable: "yes", payment: ["cash", "virement"], yearBuilt: "new", finish: "finished", gaz: "yes", water: "h24", electricity: "yes", sewage: "yes", clim: "yes", heating: "yes", amenities: ["piscine", "jardin", "vuemer", "garage", "gardiennage"] } },
  { id: "FZ-1002", listing_type: "sale", type: "apartment", price: 32000000, rooms: 4, area: 145, wilaya: "16", commune: "Hydra", lat: 36.7406, lng: 3.0336,
    title: { fr: "F4 lumineux avec balcon", ar: "شقة F4 مضيئة مع شرفة" }, images: ["/houses/2/photo_2026-10-09_00-00-49.jpg", "/houses/2/photo_2026-10-09_00-00-52.jpg", "/houses/2/photo_2026-10-09_00-00-55.jpg", "/houses/2/photo_2026-10-09_00-00-57.jpg"], videos: [], createdAt: ago(1),
    description: { fr: "Appartement F4 avec balcon, séjour lumineux et cuisine aménagée. Les photos montrent les pièces et les espaces de vie. Situé à Hydra, Alger.", ar: "شقة F4 مع شرفة وغرفة جلوس مضيئة ومطبخ مجهز. تُظهر الصور الغرف ومساحات المعيشة. تقع في حيدرة، الجزائر العاصمة." },
    publisher: agencyPublisher("fazti-immobilier"),
    fields: { papers: "livret", negotiable: "unknown", payment: ["cash", "credit"], floor: 8, yearBuilt: "new", gaz: "yes", water: "h24", clim: "yes", amenities: ["ascenseur", "parking", "residence", "vuemer"] } },
  { id: "FZ-1003", listing_type: "rent", type: "apartment", price: 65000, rooms: 3, area: 90, wilaya: "16", commune: "Kouba", lat: 36.72, lng: 3.08,
    title: { fr: "F3 meublé avec cuisine aménagée", ar: "شقة F3 مفروشة بمطبخ مجهز" }, images: ["/houses/3/photo_2026-10-09_00-01-49.jpg", "/houses/3/photo_2026-10-09_00-01-52.jpg", "/houses/3/photo_2026-10-09_00-01-54.jpg", "/houses/3/photo_2026-10-09_00-01-58.jpg"], videos: [], createdAt: ago(0.4),
    description: { fr: "Appartement F3 meublé avec séjour, cuisine aménagée et salle de bain carrelée. Situé à Kouba, Alger.", ar: "شقة F3 مفروشة تضم غرفة جلوس ومطبخا مجهزا وحماماً مبلطاً. تقع في القبة، الجزائر العاصمة." },
    publisher: agencyPublisher("fazti-immobilier"),
    fields: { negotiable: "no", furnished: "yes", deposit: 2, allowedTenants: ["familles"], floor: 3, gaz: "yes", water: "tranches", amenities: ["cuisine", "citerne"] } },
  { id: "FZ-1004", listing_type: "sale", type: "duplex", price: 26500000, rooms: 4, area: 160, wilaya: "25", commune: "Ali Mendjeli", lat: 36.25, lng: 6.57,
    title: { fr: "Duplex rénové avec espaces lumineux", ar: "دوبلكس مجدد بمساحات مضيئة" }, images: ["/houses/1/photo_2026-10-08_23-57-13.jpg", "/houses/1/photo_2026-10-08_23-57-19.jpg", "/houses/1/photo_2026-10-08_23-57-22.jpg"], videos: [], createdAt: ago(3), has360: true,
    description: { fr: "Duplex avec pièces réparties sur deux niveaux, rangements intégrés et espaces de vie carrelés. Situé à Ali Mendjeli, Constantine.", ar: "دوبلكس بغرف موزعة على مستويين وخزائن مدمجة ومساحات معيشة مبلطة. يقع في علي منجلي، قسنطينة." },
    publisher: agencyPublisher("fazti-immobilier"),
    fields: { papers: "promesse", negotiable: "yes", payment: ["facilites", "credit"], scheme: "vefa", yearBuilt: "new", amenities: ["ascenseur", "parking", "terrasse"] } },
  { id: "FZ-1005", listing_type: "sale", type: "land", price: 18000000, rooms: 0, area: 500, wilaya: "19", commune: "El Eulma", lat: 36.15, lng: 5.69,
    title: { fr: "Terrain constructible 500 m²", ar: "قطعة أرض صالحة للبناء 500 م²" }, images: [p3, p1, p2, p4], videos: [], createdAt: ago(6),
    description: { fr: "Terrain plat, angle de deux rues, quartier calme.", ar: "أرض مستوية على زاوية شارعين، حي هادئ." },
    publisher: agencyPublisher("fazti-immobilier"),
    fields: { papers: "acte", negotiable: "yes", exchange: "yes", landUse: "constructible", frontage: 20, serviced: "yes", fenced: "no" } },
  { id: "FZ-1006", listing_type: "rent", type: "commercial", price: 120000, rooms: 0, area: 80, wilaya: "19", commune: "Sétif", lat: 36.19, lng: 5.41,
    title: { fr: "Local commercial centre-ville", ar: "محل تجاري وسط المدينة" }, images: [p2, p3, p4, p1], videos: [], createdAt: ago(2),
    description: { fr: "Local de 80 m² sur boulevard passant, vitrine 8 m.", ar: "محل 80 م² على شارع حيوي، واجهة 8 م." },
    publisher: agencyPublisher("fazti-immobilier"),
    fields: { subtype: "local", frontage: 8, shutter: "yes", threePhase: "yes", deposit: 3, allowedTenants: ["bureaux"] } },
  { id: "FZ-1007", listing_type: "sale", type: "house", price: 21000000, rooms: 5, area: 220, wilaya: "23", commune: "El Bouni", lat: 36.86, lng: 7.71,
    title: { fr: "Maison familiale avec chambres spacieuses", ar: "منزل عائلي بغرف نوم واسعة" }, images: ["/houses/5/photo_2026-10-09_00-01-47.jpg", "/houses/5/photo_2026-10-09_00-03-23.jpg", "/houses/5/photo_2026-10-09_00-03-29.jpg"], videos: [], createdAt: ago(10),
    description: { fr: "Maison familiale avec chambres meublées, rangements intégrés et pièces carrelées. Située à El Bouni, Annaba.", ar: "منزل عائلي بغرف مؤثثة وخزائن مدمجة وأرضيات مبلطة. يقع في البوني، عنابة." },
    publisher: agencyPublisher("fazti-immobilier"),
    fields: { papers: "acte", negotiable: "yes", payment: ["cash"], yearBuilt: "old", gaz: "yes", amenities: ["jardin", "garage"] } },
  { id: "FZ-1008", listing_type: "rent", type: "villa", price: 250000, rooms: 5, area: 300, wilaya: "23", commune: "Seraïdi", lat: 36.91, lng: 7.67,
    title: { fr: "Villa à louer vue mer", ar: "فيلا للكراء مطلة على البحر" }, images: [p1, p4, p2, p3], videos: [], createdAt: ago(4),
    description: { fr: "Villa sur les hauteurs de Seraïdi, vue imprenable.", ar: "فيلا في أعالي سرايدي بإطلالة رائعة." },
    publisher: agencyPublisher("fazti-immobilier"),
    fields: { furnished: "yes", deposit: 3, allowedTenants: ["familles"], clim: "yes", heating: "yes", amenities: ["piscine", "vuemer", "jardin"] } },
];

// ---- Client-side store: user-published listings (localStorage) ----
const KEY = "fazti-listings";
let userListings: Listing[] = [];
let snapshot: Listing[] = SEED_LISTINGS;
let loaded = false;
const subs = new Set<() => void>();

function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  try {
    const stored = JSON.parse(localStorage.getItem(KEY) ?? "[]") as Listing[];
    const fazti = agencyPublisher("fazti-immobilier");
    userListings = stored.map((listing) => ({
      ...listing,
      publisher: { ...listing.publisher, ...fazti, phone: listing.publisher.phone, whatsapp: listing.publisher.whatsapp },
    }));
    localStorage.setItem(KEY, JSON.stringify(userListings));
  } catch { userListings = []; }
  snapshot = [...userListings, ...SEED_LISTINGS];
}

export function addListing(l: Listing) {
  load();
  userListings = [l, ...userListings];
  snapshot = [...userListings, ...SEED_LISTINGS];
  try { localStorage.setItem(KEY, JSON.stringify(userListings)); } catch { /* storage full: keep in memory */ }
  subs.forEach((f) => f());
}

export function useListings() {
  return useSyncExternalStore(
    (cb) => { subs.add(cb); return () => subs.delete(cb); },
    () => { load(); return snapshot; },
    () => SEED_LISTINGS,
  );
}
