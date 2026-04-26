# Envision OS

A Next.js prototype for a construction-intelligence operating system. The app pairs a marketing/landing experience with a small set of AI-backed dashboard tools (natural-language query, PDF data extraction, qualitative-context summarization) built on Genkit + Google Generative AI.

> Status: prototype. The dashboard tools are wired end-to-end against Genkit flows, but most data shown in landing sections is illustrative.

## Stack

- Next.js 15 (App Router, Turbopack)
- React 19, TypeScript, Tailwind CSS, shadcn/ui (Radix primitives)
- Firebase (Auth, Firestore, Storage) — initialization is gated on env vars
- Genkit + `@genkit-ai/google-genai` for AI flows (`src/ai/flows/*`)
- Firebase App Hosting (`apphosting.yaml`)

## Layout

- `src/app/(dashboard)/page.tsx` — landing entry (hero + section composition under `src/components/landing/`)
- `src/app/(dashboard)/{query,ingestion,context,visualizations}/page.tsx` — dashboard tools
- `src/ai/flows/` — Genkit flows: `query-semantic-routing`, `document-data-extraction-flow`, `qualitative-context-summarization`
- `src/lib/actions.ts` — server actions that invoke the flows
- `src/lib/firebase.ts` / `firestore.ts` / `storage.ts` — Firebase clients (lazy, SSR-safe)

## Local development

```bash
npm install
npm run dev          # http://localhost:9002
npm run genkit:dev   # Genkit dev harness (separate process)
npm run typecheck
npm run lint
npm run build
```

## Configuration

Set these env vars (e.g. `.env.local`) for full functionality. The app boots without them but Firebase-backed features will be inert.

```
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=studio-7741937329-54916
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
GOOGLE_GENAI_API_KEY=     # server-side, for Genkit flows
```

For deploy, wire the same values via `firebase apphosting:secrets:set` and uncomment the corresponding entries in `apphosting.yaml`.

## Deploy

This repo deploys to Firebase App Hosting. `apphosting.yaml` controls runtime resources and secret bindings. Firestore/Storage rules live in `firestore.rules` / `storage.rules`.

## Notes

- Firebase Web `apiKey` is a public identifier by Firebase contract; security is enforced via Firestore/Storage rules and (recommended) GCP API-key referrer + API restrictions on the project.
- Genkit flows currently default to Gemini Flash; see `src/ai/genkit.ts`.
