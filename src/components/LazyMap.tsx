import { lazy, Suspense, type ComponentProps } from "react";
import { ClientOnly } from "@tanstack/react-router";

const MapView = lazy(() => import("./MapView"));
type Props = ComponentProps<typeof MapView>;

export function LazyMap(props: Props) {
  const fallback = <div className="h-full w-full animate-pulse bg-secondary" />;
  return (
    <ClientOnly fallback={fallback}>
      <Suspense fallback={fallback}>
        <MapView {...props} />
      </Suspense>
    </ClientOnly>
  );
}
