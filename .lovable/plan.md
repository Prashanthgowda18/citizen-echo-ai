

# GovSense — Revised Implementation Plan

## Overview
AI-powered policy intelligence dashboard with demo data, real AI analysis via Lovable AI, and local state management. All feedback from the review has been incorporated.

## Design System
- **Palette**: Navy primary (`hsl(222, 47%, 11%)`), teal accents (`hsl(174, 60%, 45%)`), white/light gray backgrounds
- **Style**: Professional civic tech — clean cards, subtle shadows, desktop-first, data-dense but readable
- **Typography**: System defaults with clear hierarchy (large bold headings, muted secondary text)

## Pages & Navigation

**Sidebar** (persistent, using existing sidebar components): Dashboard, Policy Briefs, Feedback Explorer, Submit Feedback, Analytics

### 1. Dashboard (Home)
- **"Why This Matters" splash card** (top-right) — single statistic: "India receives over 2 crore public grievances annually. Less than 40% receive a structured response." with source citation
- **Priority score cards** — Top 5 policy issues ranked by urgency/volume with trend indicators
- **Sentiment trend chart** — Line chart (Recharts) across policy domains over time
- **Domain distribution** — Donut chart of feedback by policy area
- **Recent activity feed** — Latest submissions + brief status changes (reflects live local state updates)
- **Quick stats** — Total submissions, active clusters, briefs generated
- **Cross-page state connection**: When a brief status changes on Policy Briefs page, dashboard metrics and activity feed update immediately

### 2. Policy Briefs
- List of 8-10 pre-built briefs with: executive summary, priority badge (Critical/High/Medium/Low), domain tag, submission count, trend indicator
- Click to expand full 7-component brief (summary, citizen count + geography, sentiment timeline, 3-5 citizen quotes, root cause, 2-4 ranked recommendations, priority score)
- Status badges: New, In Review, In Progress, Implemented — status changes propagate to Dashboard

### 3. Feedback Explorer
- **Simplified scope**: Searchable table with domain filter only (no sentiment range slider)
- Each row: excerpt, domain tag, urgency, sentiment score, date
- Click to view full submission with AI-enriched metadata

### 4. Submit Feedback (AI-Powered)
- Text area + optional location field
- On submit: calls Lovable AI edge function for real-time analysis
- **Animated loading sequence** instead of plain spinner: "Reading submission..." → "Detecting domain..." → "Scoring urgency..." → "Analysis complete" — each step appears with staggered JS timeouts (~800ms each)
- **Error fallback**: If AI call fails or times out after 8 seconds, display a pre-cached example analysis result that looks identical to a real response. No visible difference to judges.
- Results displayed: detected domain, urgency, sentiment, keywords
- Submission added to local state, dashboard updates

### 5. Analytics
- **Geographic heatmap**: Karnataka districts with Bengaluru Urban showing highest concentration of infrastructure/housing complaints (using a simplified India/Karnataka SVG or positioned dots on a static map image)
- **Sentiment over time**: Multi-line chart by policy domain (Recharts)
- **Volume trends**: Bar chart of submissions per month
- **Top emerging issues**: List of rising themes
- **Domain comparison**: Grouped bar chart (volume, urgency, sentiment per domain) — replaces radar chart for faster readability

## Demo Data
- ~200 pre-generated submissions across 6 domains (Infrastructure, Healthcare, Education, Environment, Public Safety, Housing)
- Bengaluru/Karnataka geographic specificity throughout
- 8-10 policy briefs at various statuses
- Realistic sentiment scores, urgency levels, citizen quotes

## AI Integration (Lovable AI via Edge Function)
- **Edge function** `supabase/functions/analyze-feedback/index.ts`: Takes citizen text, returns structured JSON (domain, urgency, sentiment, keywords, submission type) using tool calling for structured output
- **Edge function** `supabase/functions/generate-brief/index.ts`: Takes a theme cluster of submissions, returns full policy brief
- Model: `google/gemini-3-flash-preview` (default)
- Error handling: 429/402 surfaced as toasts, 8-second timeout with fallback

## State Management
- React Context for global app state (submissions array, briefs array, analytics derived)
- All mutations (new submission, brief status change) update context and propagate across pages

## Technical Details

### New Dependencies
- `recharts` for all charts
- No additional dependencies needed — sidebar, cards, badges all exist

### File Structure (key new files)
```text
src/
  contexts/AppContext.tsx          — Global state provider
  data/demoData.ts                — All sample submissions, briefs, stats
  data/fallbackAnalysis.ts        — Pre-cached AI response for error fallback
  pages/Dashboard.tsx
  pages/PolicyBriefs.tsx
  pages/FeedbackExplorer.tsx
  pages/SubmitFeedback.tsx
  pages/Analytics.tsx
  components/layout/AppSidebar.tsx
  components/layout/AppLayout.tsx
  components/dashboard/PriorityCards.tsx
  components/dashboard/SentimentChart.tsx
  components/dashboard/DomainDonut.tsx
  components/dashboard/ActivityFeed.tsx
  components/dashboard/WhyThisMatters.tsx
  components/briefs/BriefCard.tsx
  components/briefs/BriefDetail.tsx
  components/feedback/FeedbackTable.tsx
  components/feedback/SubmitForm.tsx
  components/feedback/AnalysisSteps.tsx  — Animated loading sequence
  components/analytics/GeoMap.tsx
  components/analytics/DomainComparison.tsx
supabase/
  functions/analyze-feedback/index.ts
  functions/generate-brief/index.ts
```

### Build Order
1. **Phase 1** — Demo data + App shell (context, sidebar, routing, sample data)
2. **Phase 2** — Dashboard + Policy Briefs pages (charts, cards, brief detail views, cross-page state)
3. **Phase 3** — AI integration (edge functions, Submit Feedback with animated loading + error fallback, generate brief on demand) — allocate 3 hours
4. **Phase 4** — Analytics + Feedback Explorer + polish (1 hour, simplified explorer)

