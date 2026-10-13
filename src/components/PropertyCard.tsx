import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Heart, Camera, MapPin, Clock, Building2, BedDouble, Ruler, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
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

  const isRent = p.listing_type === "rent";

  return (
    <div
      onMouseEnter={() => onHover?.(p.id)}
      onMouseLeave={() => onHover?.(null)}
      className={`group relative flex min-w-0 flex-col overflow-hidden rounded-2xl border bg-card transition-all duration-300 ${
        active
          ? "border-primary/40 shadow-[0_2px_8px_-2px_oklch(0.18_0.03_255/10%),0_24px_56px_-16px_oklch(0.22_0.055_168/28%)] -translate-y-0.5"
          : "border-border/60 shadow-[0_1px_3px_0_oklch(0.18_0.03_255/6%),0_8px_24px_-8px_oklch(0.22_0.055_168/12%)] hover:border-primary/30 hover:shadow-[0_2px_8px_-2px_oklch(0.18_0.03_255/10%),0_24px_56px_-16px_oklch(0.22_0.055_168/22%)] hover:-translate-y-0.5"
      }`}
    >
      {/* Image carousel */}
      <div className="relative">
        <Carousel opts={{ loop: p.images.length > 1 }} setApi={setCarouselApi} className="overflow-hidden">
          <CarouselContent className="ml-0">
            {(p.images.length ? p.images : [""]).map((src, index) => (
              <CarouselItem key={`${src}-${index}`} className="pl-0">
                <Link to="/property/$id" params={{ id: p.id }} className="relative block aspect-[16/10] overflow-hidden bg-secondary">
                  {src
                    ? <img src={src} alt={`${p.title[lang]} ${index + 1}`} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    : <div className="grid h-full w-full place-items-center bg-secondary text-primary/30"><Building2 className="h-12 w-12" /></div>
                  }
                  {/* Gradient overlay */}
                  <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                </Link>
              </CarouselItem>
            ))}
          </CarouselContent>

          {/* Listing type badge */}
          <span className={`pointer-events-none absolute start-3 top-3 rounded-full px-3 py-1.5 text-xs font-bold shadow-sm backdrop-blur-sm ${
            isRent
              ? "bg-amber-500/95 text-white"
              : "bg-primary/95 text-primary-foreground"
          }`}>
            {tx(isRent ? "À louer" : "À vendre", isRent ? "للكراء" : "للبيع")}
          </span>

          {/* Location pill */}
          <span className="pointer-events-none absolute bottom-3 start-3 flex max-w-[calc(100%-6rem)] items-center gap-1.5 truncate rounded-full bg-black/55 px-2.5 py-1.5 text-xs font-semibold text-white backdrop-blur-md">
            <MapPin className="h-3.5 w-3.5 shrink-0 text-amber-300" />
            <span className="truncate">{communeLabel(p.wilaya, p.commune, lang)}, {w?.[lang]}</span>
          </span>

          {/* Photo counter */}
          {p.images.length > 0 && (
            <span className="pointer-events-none absolute bottom-3 end-3 flex items-center gap-1.5 rounded-full bg-black/55 px-2.5 py-1 text-[11px] font-bold text-white backdrop-blur-md">
              <Camera className="h-3.5 w-3.5" />{activePhoto + 1} / {p.images.length}
            </span>
          )}

          {/* Nav arrows */}
          {p.images.length > 1 && <>
            <button
              type="button"
              onClick={() => carouselApi?.scrollPrev()}
              aria-label={tx("Photo précédente", "الصورة السابقة")}
              className="absolute start-2 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full bg-white/20 text-white shadow-sm backdrop-blur-sm transition-all hover:bg-white/35 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white opacity-0 group-hover:opacity-100"
            >
              <ChevronLeft className="h-5 w-5 rtl:rotate-180" />
            </button>
            <button
              type="button"
              onClick={() => carouselApi?.scrollNext()}
              aria-label={tx("Photo suivante", "الصورة التالية")}
              className="absolute end-2 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full bg-white/20 text-white shadow-sm backdrop-blur-sm transition-all hover:bg-white/35 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white opacity-0 group-hover:opacity-100"
            >
              <ChevronRight className="h-5 w-5 rtl:rotate-180" />
            </button>
          </>}
        </Carousel>

        {/* Favorite button */}
        <button
          onClick={() => toggleFavorite(p.id)}
          aria-label={fav ? tx("Retirer des favoris", "إزالة من المفضلة") : tx("Ajouter aux favoris", "أضف إلى المفضلة")}
          aria-pressed={fav}
          className={`absolute end-3 top-3 z-10 grid h-10 w-10 place-items-center rounded-full shadow-sm transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
            fav
              ? "bg-white text-destructive scale-110"
              : "bg-white/85 text-foreground/60 hover:bg-white hover:text-destructive backdrop-blur-sm"
          }`}
        >
          <Heart className={`h-4 w-4 transition-all ${fav ? "fill-current" : ""}`} />
        </button>

        {/* 360° badge (hidden) */}
        {p.has360 && (
          <span className="hidden pointer-events-none absolute start-3 bottom-12 items-center gap-1 rounded-full bg-primary/90 px-2.5 py-1 text-[10px] font-bold text-white backdrop-blur-sm">
            <Sparkles className="h-3 w-3" />360°
          </span>
        )}
      </div>

      {/* Card body */}
      <div className="min-w-0 p-3.5 sm:p-4">
        <Link to="/property/$id" params={{ id: p.id }} className="block">
          {/* Price */}
          <div className="border-b border-border/60 pb-3">
            <div className="text-xl font-extrabold leading-tight tracking-tight text-foreground">
              {priceParts[0]}
            </div>
            {priceParts[1] && (
              <div className="text-lg font-extrabold leading-tight text-foreground">
                {lang === "ar" ? "و " : "et "}{priceParts[1]}
              </div>
            )}
          </div>

          {/* Title */}
          <p className="mt-2.5 line-clamp-1 text-sm font-semibold text-foreground/80">
            {p.title[lang]}
          </p>
        </Link>

        {/* Stats chips */}
        <div className="mt-2.5 flex flex-wrap gap-1.5 text-xs font-semibold">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border/70 bg-secondary/70 px-2.5 py-1.5 text-foreground">
            <Building2 className="h-3.5 w-3.5 text-primary" />{TYPE_LABELS[p.type][lang]}
          </span>
          {p.rooms > 0 && (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border/70 bg-secondary/70 px-2.5 py-1.5 text-foreground">
              <BedDouble className="h-3.5 w-3.5 text-primary" />F{p.rooms}{p.rooms >= 5 ? "+" : ""}
            </span>
          )}
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border/70 bg-secondary/70 px-2.5 py-1.5 text-foreground">
            <Ruler className="h-3.5 w-3.5 text-primary" />{p.area} m²
          </span>
          {badges.map((b) => (
            <span key={b} className="inline-flex max-w-[140px] items-center truncate rounded-full border border-amber-200/80 bg-amber-50 px-2.5 py-1.5 text-[10px] text-amber-700">
              {b}
            </span>
          ))}
        </div>

        {/* Timestamp */}
        <div className="mt-2.5 flex items-center gap-1.5 text-xs text-muted-foreground">
          <Clock className="h-3 w-3 shrink-0" />
          {relativeDate(p.createdAt, lang)}
        </div>
      </div>
    </div>
  );
}
