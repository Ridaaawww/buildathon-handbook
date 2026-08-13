# Idea Bank

An interactive board for the buildathon project ideas — 93 briefs you can search,
filter, and open in full. Built with React and Vite.

## Running it

```bash
npm install
npm run dev
```

Then visit <http://localhost:8743>.

| Script | What it does |
| --- | --- |
| `npm run dev` | Dev server with hot reload |
| `npm run build` | Production build into `dist/` |
| `npm run preview` | Serve the built `dist/` locally |

## What's in it

- **93 ideas** across three tracks (Virality, Revenue, AI as Agency), each rated
  Easy / Medium / Hard.
- **Search and filters** by keyword, track, and level, plus a random-idea picker.
- **Full brief per idea** in a side drawer: why it can win, a step-by-step build
  plan, who it's for, how the agent fits, what you'll need, memory and
  self-learning notes, partner power-ups, the demo moment, and
  deploy/proof/scoring. Each brief copies to the clipboard as plain text.
- **Deep links** — an open idea sets a `#idea-N` hash you can share, and
  back/forward navigation follows it.
- **Light and dark themes**, following the system setting with a manual toggle.
  The stored theme is applied before first paint so there's no flash.
- **Submit an idea** form at the bottom (see below).

## Project layout

```
index.html              Vite entry, plus the pre-paint theme script
vite.config.js          Dev server port, relative base, chunk splitting
src/
  main.jsx              React root
  App.jsx               Filter state, drawer state, hash sync
  data/ideas.json       The 93 idea records
  lib/ideas.js          Derived data, sorting, brief text builder
  hooks/                useTheme, useSubmissions, useReducedMotion
  components/           TitleBlock, Toolbar, IdeaGrid, IdeaCard,
                        IdeaDrawer, StairPanel, SubmitSection,
                        ThemeToggle, Meter
  styles/index.css      Design tokens and all component styles
```

## Editing the ideas

Edit `src/data/ideas.json`. Each record has these fields:

| Field | Purpose |
| --- | --- |
| `name` | Idea title |
| `track` | Virality, Revenue, or AI as Agency |
| `difficulty` | Easy, Medium, or Hard |
| `build` | One-line brief shown on the card |
| `why` | Why it can win |
| `plan` | Ordered build steps |
| `scenario` | Who this is for |
| `hermes` | How the agent fits |
| `need` | Build checklist |
| `levelups` | Memory and self-learning |
| `powerups` | Partner power-ups, formatted `Name (+25): description` |
| `demo` | The demo moment |
| `deploy`, `proof`, `score` | Deploy target, proof bar, scoring note |

`lib/ideas.js` derives track lists, per-track and per-level counts, sort order,
and each idea's search haystack, so adding a new track needs no other changes.

Ideas are keyed by their array index, which is what `#idea-N` deep links point
at. Reordering the file changes existing links; appending to the end does not.

## Idea submissions

The "Open call" form saves submissions to the visitor's own browser via
`localStorage` — **nothing is sent anywhere and submissions are not shared
between people.**

To collect them for real, set `SUBMIT_ENDPOINT` at the top of
`src/components/SubmitSection.jsx` to a URL that accepts a JSON `POST`:

```js
const SUBMIT_ENDPOINT = 'https://example.com/api/ideas';
```

The body is `{ name, brief, track, difficulty, by }`. If the request fails the
entry falls back to local storage so nothing is lost. Any endpoint works — a
Cloudflare Worker, an Airtable or Sheets webhook, a form service. The form also
carries a hidden honeypot field that silently drops bot submissions.

## Deploying

`npm run build` emits a static `dist/`. Because `base` is `'./'`, the output
works from any path, including a GitHub Pages project subdirectory. Deploy
`dist/` to any static host — Pages, Netlify, Vercel, Cloudflare Pages.
