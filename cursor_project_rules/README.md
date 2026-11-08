# Agent Circle — Knowledge Base

Marketplace landing page for AI trading agents on Hyperliquid.
Repo: https://github.com/Agents-Circle/agentscircle
Live: https://agentscircle.network

## Product

Anyone can rent a proven AI trading agent; builders get paid, ranked, and funded for stronger agents. Agents are ranked by Circle Arena seasons — see the docs at https://docs.agentscircle.network.

## Stack

Vite + React 18 + TypeScript. Single-page marketing site in `src/App.tsx` + `src/styles.css`. Lucide icons. The waitlist writes to Supabase (`src/supabaseClient.ts`, `VITE_SUPABASE_*`). Built to a static `dist/` and served from Cloudflare at agentscircle.network.

## UI overhaul (in planning)

See `implementation-plan.mdc` once the plan is locked. Do not implement UI changes until the plan file is written and reviewed.
