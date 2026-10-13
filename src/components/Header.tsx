import { Link } from "@tanstack/react-router";
import { Building2, Heart, LayoutDashboard, Search } from "lucide-react";
import { AGENCY_NAME } from "@/lib/data";
import { useFavorites } from "@/lib/favorites";
import { useI18n } from "@/lib/i18n";

export function Header() {
  const { lang, setLang, tx } = useI18n();
  const favs = useFavorites();
  return (
    <header className="sticky top-0 z-[1100] border-b border-border/50 bg-white/85 shadow-[0_1px_0_0_oklch(0.9_0.01_240),0_4px_24px_-8px_oklch(0.22_0.055_168/12%)] backdrop-blur-2xl">
      <div className="mx-auto flex h-[4.25rem] max-w-[1440px] items-center gap-3 px-4 sm:px-6 xl:px-8">

        {/* Logo + brand name */}
        <Link to="/search" aria-label={AGENCY_NAME} className="flex min-w-0 items-center gap-3 text-foreground">
          <span className="relative grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-xl bg-gradient-to-br from-primary/90 to-primary text-primary-foreground shadow-[0_2px_8px_oklch(0.42_0.14_168/35%)]">
            <Building2 className="h-5 w-5" />
            {/* subtle inner glow */}
            <span className="pointer-events-none absolute inset-0 rounded-xl bg-gradient-to-t from-transparent to-white/20" />
          </span>
          <span className="hidden truncate text-lg font-extrabold tracking-tight min-[400px]:block sm:text-xl">
            <span className="bg-gradient-to-r from-primary via-primary to-primary/70 bg-clip-text text-transparent">
              {AGENCY_NAME}
            </span>
          </span>
        </Link>

        {/* Desktop nav (hidden while preserving logic) */}
        <nav aria-label={tx("Navigation principale", "التنقل الرئيسي")} className="hidden items-center gap-1">
          <Link
            to="/search"
            activeOptions={{ exact: false }}
            activeProps={{ className: "bg-primary/8 text-primary font-bold" }}
            className="flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold text-muted-foreground transition-all duration-150 hover:bg-secondary hover:text-foreground"
          >
            <Search className="h-4 w-4" />{tx("Explorer", "اكتشف")}
          </Link>
          <Link
            to="/agent"
            activeProps={{ className: "bg-primary/8 text-primary font-bold" }}
            className="flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold text-muted-foreground transition-all duration-150 hover:bg-secondary hover:text-foreground"
          >
            <LayoutDashboard className="h-4 w-4" />{tx("Espace agence", "فضاء الوكالة")}
          </Link>
        </nav>

        {/* Right side actions */}
        <div className="ms-auto flex items-center gap-2">
          {/* Favorites */}
          <Link
            to="/favoris"
            aria-label={tx("Favoris", "المفضلة")}
            className="relative grid h-10 w-10 place-items-center rounded-xl text-foreground transition-all duration-150 hover:bg-secondary hover:text-primary"
          >
            <Heart className="h-5 w-5" />
            {favs.length > 0 && (
              <span className="absolute -end-0.5 -top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-gradient-to-br from-accent to-amber-400 px-1 text-[10px] font-bold text-accent-foreground shadow-sm">
                {favs.length}
              </span>
            )}
          </Link>

          {/* Language switcher */}
          <div className="flex h-10 items-center gap-0.5 rounded-xl border border-border bg-secondary/60 p-1 text-xs font-bold">
            {(["fr", "ar"] as const).map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className={`h-8 min-w-9 rounded-lg px-2 transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                  lang === l
                    ? "bg-gradient-to-br from-primary/90 to-primary text-white shadow-sm"
                    : "text-muted-foreground hover:bg-card hover:text-foreground"
                }`}
              >
                {l === "fr" ? "FR" : "ع"}
              </button>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}
