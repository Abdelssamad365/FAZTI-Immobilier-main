# FAZTI Immobilier

French- and Arabic-language real estate discovery and agency tools for properties in Algeria.

## Features

- Browse sale and rental listings with filters for wilaya, commune, property type, price, rooms, and area.
- Switch between list and map views, sort results, and save favorite properties.
- View property photo galleries, details, map locations, and phone or WhatsApp contact options.
- Request property visits and review appointment notifications in the agency dashboard.
- Use the announcement form to preview property details and photos before publishing.
- Switch between French and Arabic, including right-to-left layouts.

## Routes

- `/search` — listing search and map
- `/property/$id` — property details and contact
- `/favoris` — saved properties
- `/agent` — agency appointment dashboard
- `/vendre` — announcement form

## Development

Requirements: Node.js and npm.

```sh
npm install
npm run dev
```

Build and test:

```sh
npm run build
npm test
```

## Map Configuration

The map uses Mapbox Streets tiles when `VITE_MAPBOX_ACCESS_TOKEN` is configured in `.env.local`. Without it, the app falls back to OpenStreetMap tiles. Use a public browser token restricted to the domains where the site is hosted.

## Prototype Data

Listings and demo appointments are currently client-side prototype data. User-created listings, favorites, and notifications are stored in the browser and are not shared between users; a backend is needed for production publishing and account-based access.

Static listing images are served from `public/assets` and `public/houses`.
