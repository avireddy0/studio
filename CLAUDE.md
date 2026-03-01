# Studio — Envision OS Marketing Site

## Project

Next.js 15 single-page dashboard with 6 snap-scrolling full-viewport sections. Tactical/military HUD aesthetic. Deployed via Firebase App Hosting (push to GitHub triggers auto-deploy).

- **Repo**: `avireddy0/studio`
- **Firebase**: `studio-7741937329-54916`
- **Live URL**: `https://studio--studio-7741937329-54916.us-central1.hosted.app`
- **Dev port**: 9002

## Commands

```bash
npm run dev          # Dev server (Turbopack, port 9002)
npm run build        # Production build
npm run typecheck    # TypeScript check (tsc --noEmit)
npm run lint         # ESLint
```

## Stack

- Next.js 15, React 19, TypeScript
- Tailwind CSS v4, shadcn/ui, Radix primitives
- Firebase Data Connect (Cloud SQL + GraphQL, PGlite local emulator)
- Genkit AI (Google GenAI)
- lucide-react icons

## Key Directories

- `src/app/(dashboard)/page.tsx` — Main landing page (6 sections)
- `src/components/` — All UI components
- `src/components/ui/` — shadcn/ui primitives
- `src/components/visualizations/` — SVG-based data viz (BIM overlay, etc.)
- `src/components/context/` — Context fusion components
- `src/hooks/` — Custom hooks (`use-mobile.tsx` for responsive detection)
- `dataconnect/` — Firebase Data Connect schema + queries

## Style Guide

- Dark theme uses `#0A0A0F` (obsidian), primary green `#007C5A`
- Monospace labels with `tracking-widest` and `uppercase`
- Responsive: mobile-first with `sm:`, `md:`, `lg:` breakpoints
- Min font size: `text-[10px]` on mobile, `text-[8px]` allowed on `md:` and up
- Use `cn()` from `@/lib/utils` for conditional classNames

## Workflow

- Auto-commit and push when changes are complete and build passes
- Always run `npm run build` before pushing to catch errors
- Quote paths with parentheses in git commands: `git add 'src/app/(dashboard)/page.tsx'`

## Context Preservation (Compaction Resilience)

Before context compaction, write a handoff file to `.claude/handoff.md` containing:

1. **Current task**: What you were working on
2. **Files modified**: List of files changed and what was done to each
3. **Progress**: What's complete vs what remains
4. **Decisions made**: Key technical decisions and rationale
5. **Errors encountered**: Any unresolved issues or blockers
6. **Next steps**: Exactly what to do next to continue

After compaction, read `.claude/handoff.md` and this file to restore context.
