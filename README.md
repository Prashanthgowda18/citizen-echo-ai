# GovSense - Citizen Echo AI

GovSense is an AI-powered civic intelligence platform that converts citizen feedback into policy insights, trend analytics, and prioritized action briefs.

## Core Features

- Multi-page policy intelligence workflow: dashboard, briefs, explorer, submit, analytics, hackathon readiness.
- AI-assisted feedback analysis through Supabase Edge Function.
- Reliability-first fallback analysis when AI service is unavailable.
- Durable local persistence for submissions, briefs, and activity feeds.
- Optional cloud synchronization pipeline to Supabase tables with offline queue fallback.

## Tech Stack

- React 18 + TypeScript + Vite
- Tailwind + shadcn/ui
- Supabase client + Edge Functions
- Recharts for analytics visualizations

## Local Setup

1. Install dependencies

```bash
npm install
```

2. Configure environment variables in a local `.env` file

```bash
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
VITE_APP_LIVE_URL=https://your-live-app-url.example.com
```

3. Run app

```bash
npm run dev
```

## Supabase Setup

1. Apply database migration for tables and policies:

- `supabase/migrations/20260408_hackathon_schema.sql`

2. Deploy edge function:

- `supabase/functions/analyze-feedback/index.ts`

3. Set edge secret:

- `LOVABLE_API_KEY`

## Deployment (Vercel or Netlify)

1. Connect repository.
2. Set build command: `npm run build`.
3. Set output directory: `dist`.
4. Add required environment variables:
	- `VITE_SUPABASE_URL`
	- `VITE_SUPABASE_PUBLISHABLE_KEY`
	- `VITE_APP_LIVE_URL`
5. Deploy and verify `/readiness` shows live deployment status.

## Hackverse Rubric Coverage

- Problem Understanding: domain-specific submission model and policy briefs.
- Innovation & Creativity: AI analysis + fallback resilience + rubric evidence engine.
- Technical Implementation & Backend DB: edge function, migration schema, cloud sync hooks.
- Prototype / Working Model: complete user flow with durable state.
- Deployment & UI/UX: production-ready build path and polished multi-page UI.
- Scalability & Commercialization: queue-based sync, target users, GTM notes in readiness page.
- Presentation & Communication: dedicated `Hackathon Readiness` page with live scorecards.

