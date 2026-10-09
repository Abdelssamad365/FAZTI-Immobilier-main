import { createFileRoute, Link } from "@tanstack/react-router";
import { Heart } from "lucide-react";
import { useListings } from "@/lib/data";
import { useFavorites } from "@/lib/favorites";
import { useI18n } from "@/lib/i18n";
import { PropertyCard } from "@/components/PropertyCard";

export const Route = createFileRoute("/favoris")({
  head: () => ({
    meta: [
      { title: "Mes favoris — FAZTI Immobilier" },
      { name: "description", content: "Retrouvez les annonces immobilières que vous avez enregistrées." },
      { property: "og:title", content: "Mes favoris — FAZTI Immobilier" },
      { property: "og:description", content: "Vos annonces immobilières enregistrées en Algérie." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: FavoritesPage,
});

function FavoritesPage() {
  const { tx } = useI18n();
  const favs = useFavorites();
  const items = useListings().filter((l) => favs.includes(l.id));
  return (
    <main className="mx-auto w-full max-w-3xl space-y-3 p-4">
      <h1 className="flex items-center gap-2 text-2xl font-extrabold text-foreground"><Heart className="h-6 w-6" />{tx("Mes favoris", "المفضلة")}</h1>
      {items.length === 0 ? (
        <div className="rounded-md border border-border bg-card p-8 text-center text-sm text-muted-foreground">
          {tx("Aucune annonce enregistrée pour le moment.", "لا توجد إعلانات محفوظة حاليا.")}{" "}
          <Link to="/" className="font-bold text-primary underline">{tx("Voir les annonces", "تصفح الإعلانات")}</Link>
        </div>
      ) : items.map((l) => <PropertyCard key={l.id} p={l} />)}
    </main>
  );
}
