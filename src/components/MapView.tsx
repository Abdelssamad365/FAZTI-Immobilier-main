import { useEffect, useRef } from "react";
import L from "leaflet";

export type MapPoint = { id: string; lat: number; lng: number; label: string };

type Props = {
  points?: MapPoint[];
  activeId?: string | null;
  onHover?: (id: string | null) => void;
  onSelect?: (id: string) => void;
  center?: [number, number];
  zoom?: number;
  onPick?: (lat: number, lng: number) => void;
  pin?: [number, number] | null;
  fitPoints?: boolean;
};

/** Browser-only Leaflet map. Import via React.lazy behind <ClientOnly>. */
export default function MapView({ points = [], activeId, onHover, onSelect, center = [35.7, 1.5], zoom = 6, onPick, pin, fitPoints }: Props) {
  const el = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);
  const layer = useRef<L.LayerGroup | null>(null);
  const pinLayer = useRef<L.Marker | null>(null);
  const cbs = useRef({ onHover, onSelect, onPick });
  cbs.current = { onHover, onSelect, onPick };

  useEffect(() => {
    if (!el.current || map.current) return;
    const m = L.map(el.current, { zoomControl: false, attributionControl: true }).setView(center, zoom);
    const mapboxToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;
    const openStreetMapUrl = "https://tile.openstreetmap.org/{z}/{x}/{y}.png";
    const tiles = L.tileLayer(
      mapboxToken
        ? `https://api.mapbox.com/styles/v1/mapbox/streets-v12/tiles/256/{z}/{x}/{y}?access_token=${mapboxToken}`
        : openStreetMapUrl,
      {
        attribution: mapboxToken ? "© Mapbox © OpenStreetMap" : "© OpenStreetMap contributors",
        maxZoom: mapboxToken ? 22 : 19,
      },
    ).addTo(m);
    let fallbackAdded = !mapboxToken;
    tiles.on("tileerror", () => {
      if (fallbackAdded) return;
      fallbackAdded = true;
      tiles.remove();
      L.tileLayer(openStreetMapUrl, {
        attribution: "© OpenStreetMap contributors", maxZoom: 19,
      }).addTo(m);
    });
    const observer = new ResizeObserver(() => m.invalidateSize());
    observer.observe(el.current);
    L.control.zoom({ position: "bottomright" }).addTo(m);
    layer.current = L.layerGroup().addTo(m);
    m.on("click", (e) => cbs.current.onPick?.(e.latlng.lat, e.latlng.lng));
    m.on("zoomend", () => render());
    map.current = m;
    render();
    if (fitPoints && points.length > 1) m.fitBounds(L.latLngBounds(points.map((p) => [p.lat, p.lng])), { padding: [60, 60] });
    return () => { observer.disconnect(); m.remove(); map.current = null; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function render() {
    const m = map.current, lg = layer.current;
    if (!m || !lg) return;
    lg.clearLayers();
    // Simple pixel-grid clustering when zoomed out
    const clusters: { pts: MapPoint[]; x: number; y: number }[] = [];
    const R = 50;
    for (const p of pointsRef.current) {
      const px = m.project([p.lat, p.lng], m.getZoom());
      const c = clusters.find((c) => Math.hypot(c.x - px.x, c.y - px.y) < R);
      if (c) c.pts.push(p); else clusters.push({ pts: [p], x: px.x, y: px.y });
    }
    for (const c of clusters) {
      if (c.pts.length === 1) {
        const p = c.pts[0];
        if (!p) continue;
        const mk = L.marker([p.lat, p.lng], {
          icon: L.divIcon({ className: "", iconSize: [0, 0], html: `<div class="price-marker ${p.id === activeRef.current ? "active" : ""}">${p.label}</div>` }),
          zIndexOffset: p.id === activeRef.current ? 1000 : 0,
        });
        mk.on("mouseover", () => cbs.current.onHover?.(p.id));
        mk.on("mouseout", () => cbs.current.onHover?.(null));
        mk.on("click", () => cbs.current.onSelect?.(p.id));
        lg.addLayer(mk);
      } else {
        const lat = c.pts.reduce((s, p) => s + p.lat, 0) / c.pts.length;
        const lng = c.pts.reduce((s, p) => s + p.lng, 0) / c.pts.length;
        const mk = L.marker([lat, lng], { icon: L.divIcon({ className: "", iconSize: [0, 0], html: `<div class="cluster-marker">${c.pts.length}</div>` }) });
        mk.on("click", () => m.fitBounds(L.latLngBounds(c.pts.map((p) => [p.lat, p.lng])), { padding: [80, 80] }));
        lg.addLayer(mk);
      }
    }
  }

  const pointsRef = useRef(points);
  const activeRef = useRef(activeId);
  pointsRef.current = points;
  activeRef.current = activeId;

  useEffect(() => { render(); }, [points, activeId]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const m = map.current;
    if (!m) return;
    if (pinLayer.current) { pinLayer.current.remove(); pinLayer.current = null; }
    if (pin) {
      pinLayer.current = L.marker(pin, { icon: L.divIcon({ className: "", iconSize: [0, 0], html: `<div class="price-marker active">📍</div>` }) }).addTo(m);
    }
  }, [pin]);

  return <div ref={el} className="h-full w-full" />;
}
