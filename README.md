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

## Railway

This repo is configured to work with Railway using the included `start` script:

```bash
npm run build
npm start
```

Railway will provide the `PORT` environment variable. For a static production deployment, you can also configure a build command of `npm run build` and serve the `dist` directory.

## GitHub Pages / Static Hosting

Run:

```bash
npm run build
```

The production files will be in `dist/`.

## Notes

- The waitlist form is intentionally frontend-only for zero integration setup. It shows a confirmation state locally.
- Replace the placeholder social/legal links in `src/App.tsx` before launch.
- Replace the example leaderboard metrics with live, verified data once the backend is available.
- The $AGENT section is intentionally framed as utility and ecosystem design rather than investment solicitation.
