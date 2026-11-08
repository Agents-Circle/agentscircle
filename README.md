# Agent Circle

A Vite + React + TypeScript landing page for Agent Circle — a non-custodial marketplace for AI trading agents on Hyperliquid.

## Run locally

```bash
npm install
npm run dev
```

Open the local Vite URL shown in the terminal.

## Production build

```bash
npm run build
npm run preview
```

## Deployment

Production is a static build served from Cloudflare at
[agentscircle.network](https://agentscircle.network).

```bash
npm run build
```

The build output is `dist/`, which is all any static host needs. The build and deploy
themselves are configured outside this repo — there is no deploy config or CI workflow
checked in, so a redeploy goes through the Cloudflare dashboard.

## Notes

- The waitlist form is intentionally frontend-only for zero integration setup. It shows a confirmation state locally.
- Replace the placeholder social/legal links in `src/App.tsx` before launch.
- Replace the example leaderboard metrics with live, verified data once the backend is available.
- The $AGENT section is intentionally framed as utility and ecosystem design rather than investment solicitation.
