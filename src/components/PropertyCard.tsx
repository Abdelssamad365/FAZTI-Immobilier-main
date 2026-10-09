import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Heart, Camera, MapPin, Clock, Building2, BedDouble, Ruler, ChevronLeft, ChevronRight } from "lucide-react";
import { communeLabel, TYPE_LABELS, wilayaBy, type Listing } from "@/lib/data";
import { FIELDS, displayValue } from "@/lib/fields";
import { toggleFavorite, useFavorites } from "@/lib/favorites";
import { listingPrice, relativeDate, useI18n } from "@/lib/i18n";
import { Carousel, CarouselApi, CarouselContent, CarouselItem } from "@/components/ui/carousel";

const BADGE_KEYS = ["papers", "negotiable", "furnished", "scheme", "exchange", "landUse"];

export function keyBadges(l: Listing, lang: "fr" | "ar") {
  const out: string[] = [];
  for (const k of BADGE_KEYS) {
    const f = FIELDS.find((x) => x.key === k);
    const v = f && displayValue(f, l.fields[k], lang);
    if (f && v) out.push(f.type === "tri" ? f.label[lang] : v);
    if (out.length === 2) break;
  }
  return out;
}

export function PropertyCard({ p, active, onHover }: { p: Listing; active?: boolean; onHover?: (id: string | null) => void }) {
  const { lang, tx } = useI18n();
  const favs = useFavorites();
  const fav = favs.includes(p.id);
  const w = wilayaBy(p.wilaya);
  const badges = keyBadges(p, lang);
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const [activePhoto, setActivePhoto] = useState(0);
  const salePrice = listingPrice(p.price, false, lang);
  const priceSeparator = lang === "ar" ? " و " : " et ";
  const priceParts = p.listing_type === "sale" ? salePrice.split(priceSeparator) : [salePrice];

  useEffect(() => {
    if (!carouselApi) return;
    const updateActivePhoto = () => setActivePhoto(carouselApi.selectedScrollSnap());
    updateActivePhoto();
    carouselApi.on("select", updateActivePhoto);
    return () => { carouselApi.off("select", updateActivePhoto); };
  }, [carouselApi]);

  return (
    <div
      onMouseEnter={() => onHover?.(p.id)}
      onMouseLeave={() => onHover?.(null)}
      className={`group relative flex min-w-0 flex-col overflow-hidden rounded-xl border bg-card transition-[border-color,box-shadow] duration-200 ${active ? "border-primary/40 shadow-md" : "border-border/80 shadow-sm hover:border-primary/25 hover:shadow-md"}`}
    >
      <div className="relative">
        <Carousel opts={{ loop: p.images.length > 1 }} setApi={setCarouselApi} className="overflow-hidden">
          <CarouselContent className="ml-0">
            {(p.images.length ? p.images : [""]).map((src, index) => (
              <CarouselItem key={`${src}-${index}`} className="pl-0">
                <Link to="/property/$id" params={{ id: p.id }} className="relative block aspect-[16/10] overflow-hidden bg-secondary">
                  {src
                    ? <img src={src} alt={`${p.title[lang]} ${index + 1}`} loading="lazy" className="h-full w-full object-cover" />
                    : <div className="grid h-full w-full place-items-center bg-secondary text-primary/35"><Building2 className="h-12 w-12" /></div>}
                </Link>
              </CarouselItem>
            ))}
          </CarouselContent>
          <span className="pointer-events-none absolute start-3 top-3 rounded-full bg-primary px-3 py-1.5 text-xs font-bold text-primary-foreground shadow-sm">{tx(p.listing_type === "rent" ? "À louer" : "À vendre", p.listing_type === "rent" ? "للكراء" : "للبيع")}</span>
          <span className="pointer-events-none absolute bottom-3 start-3 flex max-w-[calc(100%-6rem)] items-center gap-1.5 truncate rounded-full bg-foreground/75 px-2.5 py-1.5 text-xs font-semibold text-white backdrop-blur-sm"><MapPin className="h-3.5 w-3.5 shrink-0" /><span className="truncate">{communeLabel(p.wilaya, p.commune, lang)}, {w?.[lang]}</span></span>
          {p.images.length > 1 && <>
            <button type="button" onClick={() => carouselApi?.scrollPrev()} aria-label={tx("Photo précédente", "الصورة السابقة")} className="absolute start-2 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full bg-foreground/55 text-white shadow-sm transition-colors hover:bg-foreground/75 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"><ChevronLeft className="h-5 w-5 rtl:rotate-180" /></button>
            <button type="button" onClick={() => carouselApi?.scrollNext()} aria-label={tx("Photo suivante", "الصورة التالية")} className="absolute end-2 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full bg-foreground/55 text-white shadow-sm transition-colors hover:bg-foreground/75 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"><ChevronRight className="h-5 w-5 rtl:rotate-180" /></button>
          </>}
          {p.images.length > 0 && <span className="pointer-events-none absolute bottom-3 end-3 flex items-center gap-1.5 rounded-full bg-foreground/75 px-2.5 py-1 text-[11px] font-bold text-deep-foreground backdrop-blur-sm"><Camera className="h-3.5 w-3.5" />{activePhoto + 1} / {p.images.length}</span>}
        </Carousel>
        <button
          onClick={() => toggleFavorite(p.id)}
          aria-label={fav ? tx("Retirer des favoris", "إزالة من المفضلة") : tx("Ajouter aux favoris", "أضف إلى المفضلة")}
          aria-pressed={fav}
          className="absolute end-3 top-3 z-10 grid h-10 w-10 place-items-center rounded-full bg-card/95 text-primary shadow-sm transition-colors hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <Heart className={`h-4 w-4 ${fav ? "fill-current text-destructive" : ""}`} />
        </button>
      </div>
      <div className="min-w-0 p-2.5 sm:p-3.5">
        <Link to="/property/$id" params={{ id: p.id }} className="block border-b border-border/70 pb-2.5">
          <div className="text-xl font-extrabold leading-tight tracking-tight text-foreground">{priceParts[0]}</div>
          {priceParts[1] && <div className="text-lg font-extrabold leading-tight text-foreground">{lang === "ar" ? "و " : "et "}{priceParts[1]}</div>}
        </Link>
        <div className="mt-2.5 flex flex-wrap gap-1.5 text-xs font-semibold text-foreground">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary/80 px-3 py-2"><Building2 className="h-4 w-4 text-primary" />{TYPE_LABELS[p.type][lang]}</span>
          {p.rooms > 0 && <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary/80 px-3 py-2"><BedDouble className="h-4 w-4 text-primary" />F{p.rooms}{p.rooms >= 5 ? "+" : ""}</span>}
          <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary/80 px-3 py-2"><Ruler className="h-4 w-4 text-primary" />{p.area} m²</span>
          {badges.map((b) => <span key={b} className="inline-flex max-w-[140px] items-center truncate rounded-full bg-secondary/80 px-3 py-2 text-[10px]">{b}</span>)}
        </div>
        <div className="mt-2.5 flex items-center gap-1 text-xs text-muted-foreground">
          <Clock className="h-3 w-3 shrink-0" />{relativeDate(p.createdAt, lang)}
        </div>
      </div>
    </div>
  );
}
