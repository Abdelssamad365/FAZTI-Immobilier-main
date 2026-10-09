import { createFileRoute, notFound } from "@tanstack/react-router";
import { MessageCircle, Phone } from "lucide-react";
import { agencyBy, useListings, wilayaBy } from "@/lib/data";
import { waDigits } from "@/lib/contact";
import { useI18n } from "@/lib/i18n";
import { PropertyCard } from "@/components/PropertyCard";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/agence/$slug")({
  loader: ({ params }) => {
    const agency = agencyBy(params.slug);
    if (!agency) throw notFound();
    return { agency };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [{ title: "Agence introuvable" }, { name: "robots", content: "noindex" }] };
    const t = `${loaderData.agency.name} — Annonces immobilières`;
    return { meta: [
      { title: t }, { name: "description", content: loaderData.agency.about.fr },
      { property: "og:title", content: t }, { property: "og:description", content: loaderData.agency.about.fr },
      { property: "og:type", content: "profile" }, { name: "twitter:card", content: "summary" },
    ] };
  },
  notFoundComponent: AgencyNotFound,
  component: AgencyPage,
});

function AgencyNotFound() {
  return <main className="p-10 text-center font-bold text-foreground">Agence introuvable · الوكالة غير موجودة</main>;
}

function AgencyPage() {
  const { agency } = Route.useLoaderData();
  const { lang, tx } = useI18n();
  const items = useListings().filter((l) => l.publisher.slug === agency.slug);
  return (
    <main className="mx-auto w-full max-w-3xl space-y-4 p-4">
      <section className="flex flex-col gap-4 rounded-md border border-border bg-card p-5 sm:flex-row sm:items-center">
        <div className="grid h-20 w-20 shrink-0 place-items-center rounded-md bg-brand text-2xl font-extrabold text-deep-foreground">{agency.logoText}</div>
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl font-extrabold text-foreground">{agency.name}</h1>
          <p className="text-sm text-muted-foreground">{wilayaBy(agency.wilaya)?.[lang]} · {agency.about[lang]}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Button asChild variant="outline"><a href={`tel:${agency.phone}`}><Phone />{agency.phone}</a></Button>
            <Button asChild className="bg-whatsapp text-whatsapp-foreground hover:bg-whatsapp/90">
              <a href={`https://wa.me/${waDigits(agency.whatsapp)}`} target="_blank" rel="noreferrer"><MessageCircle />WhatsApp</a>
            </Button>
          </div>
        </div>
      </section>
      <h2 className="font-bold text-foreground">{items.length} {tx("annonces", "إعلان")}</h2>
      {items.map((l) => <PropertyCard key={l.id} p={l} />)}
    </main>
  );
}
