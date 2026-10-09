/** Accepts +213XXXXXXXXX or 05/06/07XXXXXXXX (spaces, dots, dashes ignored). */
export const PHONE_RE = /^(\+213[567]\d{8}|0[567]\d{8})$/;
export const cleanPhone = (v: string) => v.replace(/[\s.-]/g, "");
export const isValidPhone = (v: string) => PHONE_RE.test(cleanPhone(v));

/** International digits only for wa.me, e.g. 0661... → 213661... */
export function waDigits(phone: string) {
  const d = cleanPhone(phone).replace(/\D/g, "");
  return d.startsWith("0") ? `213${d.slice(1)}` : d;
}

export function waLink(phone: string, title: string, ref: string, lang: "fr" | "ar") {
  const msg = lang === "ar"
    ? `السلام عليكم، أنا مهتم بإعلانكم: ${title} (المرجع ${ref}). هل ما زال متاحا؟`
    : `Bonjour, je suis intéressé(e) par votre annonce : ${title} (réf. ${ref}). Est-elle toujours disponible ?`;
  return `https://wa.me/${waDigits(phone)}?text=${encodeURIComponent(msg)}`;
}

/** Embeddable video source: YouTube → embed URL, otherwise mp4 file. */
export function videoSource(url: string): { kind: "youtube" | "file"; src: string } {
  const m = url.match(/(?:youtu\.be\/|v=|embed\/|shorts\/)([\w-]{11})/);
  return m ? { kind: "youtube", src: `https://www.youtube-nocookie.com/embed/${m[1]}` } : { kind: "file", src: url };
}
