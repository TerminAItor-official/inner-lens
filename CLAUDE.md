# CLAUDE.md — Inner Lens

This file tells Claude Code what this project is, how it's built, and how to work on it.

## What Is Inner Lens

An AI-powered psychoanalytic journaling app for Mom Words Matter™ (Keila's brand). Users write a journal entry, AI reads it and matches them to one of six psychoanalytic thinkers (Freud, Anna Freud, Winnicott, Jung, Klein, Lacan), and that thinker asks a deeper follow-up question. Paid users get an AI-generated reflection.

All 6 thinkers are free. Free tier: 1 session per day. The paid tier ("Deep Lens" — $6/month or $49/year) adds AI reflections, pattern dashboard, unlimited sessions, and export.

## Tech Stack

- **Frontend**: React (UI generated via Google Stitch, imported into this repo)
- **Backend**: Vercel serverless functions (Node.js) in `/api/`
- **AI**: Claude Sonnet via Anthropic API for routing + reflections
- **Database**: Supabase (planned — not yet set up)
- **Auth**: Supabase Auth (planned — not yet set up)
- **Payments**: Stripe Checkout (planned — not yet set up)
- **Hosting**: Vercel

## Project Structure

inner-lens/
├── api/                    # Vercel serverless functions
│   ├── route-entry.js      # Crisis detection + AI philosopher routing
│   ├── generate-reflection.js  # AI reflection for paid users
│   └── get-prompt.js       # Random opening prompt with repeat avoidance
├── lib/
│   ├── prompts/
│   │   ├── router.js       # System prompt for philosopher routing
│   │   └── reflection.js   # System prompt for AI reflections
│   └── questions.json      # Full question bank (15 opening + 48 follow-up)
├── src/                    # React frontend (from Stitch)
│   └── [components]
├── public/
├── .env.local              # API keys (never commit this)
├── vercel.json
├── package.json
└── CLAUDE.md               # This file

## Commands

npm install                # Install dependencies
npm run dev                # Start local dev server (Vercel dev)
npm test                   # Run tests (to be configured)
git push origin main       # Deploy via Vercel (auto-deploys on push)

## Environment Variables

ANTHROPIC_API_KEY=         # Claude API for routing and reflections
SUPABASE_URL=              # Database (Phase 2)
SUPABASE_ANON_KEY=         # Database auth (Phase 2)
STRIPE_SECRET_KEY=         # Payments (Phase 2)

Store in .env.local — never commit this file.

## Philosopher Emojis (source of truth)

- Freud: 🛋️
- Anna Freud: 🛡️
- Winnicott: 🌱
- Jung: 🌙
- Klein: 🪞
- Lacan: 🔮

## Brand Colors (Mom Words Matter™)

Base palette (used on landing, entry, and upgrade screens):
- Background: Warm Ivory #F5F1EA
- Headlines: Deep Olive #6B7B6A
- Body text: Charcoal Taupe #4A4541
- Emotional accent: Muted Rose #D8A7A0
- Premium accent: Soft Gold #C8A96A
- Depth/header: Deep Forest Green #2F3A34

Philosopher palettes (entire UI shifts to these after routing):
- Freud: bg #F5EDE8, text #6B4C3B, accent #A0522D
- Anna Freud: bg #EDF2F7, text #4A5568, accent #718096
- Winnicott: bg #E8F5E9, text #2D6A4F, accent #40916C
- Jung: bg #FDF3E3, text #4A3728, accent #8B6914
- Klein: bg #F8E8F8, text #6B2D6B, accent #9B59B6
- Lacan: bg #E8F0F8, text #1A3A5C, accent #2E6DA4

Use CSS custom properties for all colors. A data-philosopher attribute on the page container swaps the entire palette.

## The App Flow

1. User opens app → GET /api/get-prompt → opening prompt displayed
2. User writes entry → POST /api/route-entry → crisis check → AI routing → philosopher + question returned
3. Frontend renders philosopher card with full color shift + follow-up question
4. User writes reflection → POST /api/generate-reflection (paid only) → AI insight
5. Entry saved to database (Phase 2)

## AI Routing Logic

The router receives a journal entry and analyzes it for emotional patterns:
- Freud: guilt, shame, dreams, repetition, forbidden desire
- Anna Freud: deflection, minimizing, intellectualizing, "I'm fine"
- Klein: love/resentment, idealizing/demonizing, jealousy, relationship ambivalence
- Winnicott: feeling fake, people-pleasing, gap between public/private self
- Lacan: unnamed wanting, unsatisfying achievement, identity confusion
- Jung: projection, recurring symbols, inner conflict, fascination/repulsion

Returns JSON: { philosopher, confidence, runner_up, reasoning, question_id }

## Crisis Detection

If entry contains crisis indicators (suicidal ideation, self-harm), skip philosopher routing entirely and return { crisis: true }. Frontend shows crisis resources (988 Lifeline, Crisis Text Line). Non-negotiable.

## Coding Guidelines

- All API routes in /api/ as Vercel serverless functions
- System prompts in /lib/prompts/ — never hardcode in route files
- Question bank in /lib/questions.json
- ANTHROPIC_API_KEY from process.env — never hardcode
- Add CORS headers on all API routes
- Validate all inputs (reject empty entries, enforce max length)
- Handle API failures gracefully with fallback responses
- Typography: Georgia serif for all user-facing text
- Mobile-first responsive design

## Related Resources

- Obsidian vault: C:\AI\Inner Lens\ (product docs, prompts, build log)
- Stitch prompts: 9 screens defined, ready to generate UI
- Prototype code: exists from prior session (React with keyword routing — being replaced with AI routing)

## Frontend Stack

- **Build tool**: Vite + `@vitejs/plugin-react`
- **Styling**: Tailwind CSS v3 with full MD3 token palette (see `tailwind.config.js`)
- **Animations**: Framer Motion
- **Fonts**: Newsreader (serif, all emotional content) + Inter (sans, UI labels only) + Material Symbols Outlined icons
- **Stitch reference screens**: `src/stitch/` — HTML prototypes, do not edit
- **React source**: `src/` (App.jsx, screens/, components/, context/)

Screen state machine in `App.jsx`: `landing → journal → routing → reveal → ai_reflection` (or `crisis` on detection). No URL routing — single-page state machine.

`ThemeProvider` in `src/context/ThemeContext.jsx` injects `--bg`, `--text-primary`, `--accent` CSS variables on `document.documentElement` when philosopher changes. 1-second CSS transition on body.

"Destination Rule" (from design system): suppress Header and BottomNav on `routing`, `ai_reflection`, and `crisis` screens — these are focused, linear flows.

## What's Not Built Yet

- [ ] Supabase database + auth (Phase 2)
- [ ] Stripe payments (Phase 2)
- [ ] Pattern dashboard / Insights screen
- [ ] JournalHistory populated from real data (shows empty state now)
- [ ] Lens switcher pills on PhilosopherReveal (UI present, not wired)
- [ ] Paid tier gating (isPaid stub in App.jsx — always false until auth)
