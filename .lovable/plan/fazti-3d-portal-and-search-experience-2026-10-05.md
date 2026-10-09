# FAZTI 3D Portal and Search Experience

## Goal
Create a premium bilingual entry experience at `/`, move the existing map discovery screen to `/search`, and refine the requested selling, property, and booking flows without changing their demo data behavior.

## What will change
- Add a full-screen 3D FAZTI portal at `/` with an animated radial grid, floating illuminated monogram, French and Arabic taglines, and two clear actions.
- Make “Explorer la Carte / استكشف الخريطة” perform a cinematic zoom-and-blur transition before opening `/search`.
- Make “Déposer une Annonce / بيع عقارك” open `/list-property` directly.
- Move the existing map-first discovery experience from `/` to `/search`, preserving the 35/65 desktop split, filtering, marker hover synchronization, clustering, and mobile list/map controls.
- Add a dedicated floating mobile map-expansion control and keep OpenStreetMap/CARTO tiles as the no-token map path.
- Keep `/list-property`, `/property/$id`, and the booking modal functional while aligning their labels, navigation, visual hierarchy, and controls with the supplied FAZTI direction.
- Hide the standard site header on the immersive landing page while keeping it on the product pages.

## Technical details
- Use React Three Fiber with procedural geometry for the abstract FAZTI monogram scene; no external 3D model is needed.
- Keep the 3D route client-only and use frame-rate-independent animation with reduced-motion support.
- Add `/search` as its own TanStack route and update internal links to point there.
- Reuse semantic palette tokens from the existing design system; add only the scene-specific grid/glow tokens globally.
- Preserve Leaflet loading behind the existing client-only wrapper.
- Add unique metadata for the new landing and search routes.

## Verification
- Check the landing and `/search` at desktop and mobile sizes.
- Verify both landing actions, property navigation, map markers, listing wizard steps, and booking modal opening.
- Confirm no console, runtime, or build errors remain.
