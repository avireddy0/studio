# Handoff — Session Context

## Current Task
User requested a new **06_Predict section** for the landing page. This is the NEXT task to work on.

### Requirements for 06_Predict:
- Visual component for studying **news trends/media**, especially **municipal meetings**
- Display a YouTube video embed of someone speaking at a city municipal meeting with **negative sentiment**
- Use **captions to visualize** the negative sentiment
- Display an **alert email** component: "Negative Sentiment Alert: {describe what's going on then provide quick recommendation}"
- **Modern military / Palantir meets Anduril** UI aesthetic
- **White background** to contrast going from BIM model to Feasibility section
- This is a new snap-scroll section on the landing page

## Completed This Session
1. Chat streaming: line-by-line reveal with blinking cursor, 80-160ms per line
2. Rich formatting: ALL_CAPS headers detected and styled, warnings amber, action items indented
3. Follow-up buttons: hidden during streaming, stagger-animate in after completion
4. Smooth auto-scroll during streaming
5. Fixed React anti-pattern: replaced index-based streaming with boolean `isStreamingActive`
6. Bold only on headers (user request), normal weight for body text
7. Avenir font on chat bubbles (system font, graceful fallback)
8. Initial prompts: "On Budget?", "On Schedule?", "Quick Debrief", "What If?"
9. Renamed "Intelligence Command" → "Command Central" everywhere
10. Added "debrief" to comms pattern matcher

## Key Files Modified
- `src/components/query/chat-message.tsx` — streaming, formatting, Avenir font
- `src/components/query/chat-interface.tsx` — streaming state, prompts, follow-up delay
- `src/lib/actions.ts` — added "debrief" pattern
- `src/app/(dashboard)/page.tsx` — "Command Central" rename
- `src/app/(dashboard)/query/page.tsx` — "Command Central" header

## Architecture Notes
- Landing page has 6 snap-scroll sections in `src/app/(dashboard)/page.tsx`
- Current section order: Hero, Ingestion, Intel, Fusion (Context), Tactical BIM, Feasibility (Site Docs)
- New 06_Predict section should go between BIM and Feasibility, or after Feasibility
- Each section is a full-viewport `min-h-screen` div with snap alignment
- Components live in `src/components/sections/` or `src/components/visualizations/`

## Dev Server
- Port 9002, restart after builds
- iOS Simulator testing available (see MEMORY.md)
