# ito

ito is a minimalistic travel itinerary web app. Create a trip, build out a day-by-day itinerary (stays, travel, activities, food & drink), and run an AI-powered audit that checks the itinerary for logistics gaps, like missing lodging, unconnected travel, or tight timing, before you go.

## Tech stack

- [Next.js](https://nextjs.org) (App Router) + TypeScript
- [Tailwind CSS](https://tailwindcss.com) + [shadcn/ui](https://ui.shadcn.com) (Base UI variant)
- [Supabase](https://supabase.com) for auth (Google OAuth) and the Postgres database
- [OpenAI API](https://platform.openai.com), powering the itinerary audit feature
