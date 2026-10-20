# Weather Mood Page
A responsive weather search that pairs live OpenWeatherMap conditions with a calm, weather-aware color palette.

## Features
- Search current conditions by city, with clear empty, loading, success, and error states.
- Validates API responses before rendering and ignores stale responses when searches overlap.
- Responsive layout and condition-specific solid backgrounds.

## Run locally
Requires Node.js 20.19+ or 22.12+ and an OpenWeatherMap API key.
1. Copy `.env.example` to `.env`.
2. Set `VITE_OPENWEATHER_API_KEY` to your key. This browser key is visible in the built frontend; use a restricted key for public hosting.
3. Run `npm install`, then `npm run dev`.
4. Run `npm run build` for a production build.

## Limitations
The free browser API key is public in the client bundle. Restrict it through the provider or add a server proxy before production use. Live searches require network access and a valid key.
