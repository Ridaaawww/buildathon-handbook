# Idea Bank

An interactive board for the buildathon project ideas — 93 briefs you can search,
filter, and open in full. Built as a single self-contained HTML file with no
dependencies and no build step required to view it.

## Viewing it

`index.html` is standalone. Open it directly in a browser, or serve the folder:

```bash
python3 -m http.server 8743
```

Then visit <http://localhost:8743>.

## What's in it

- **93 ideas** across three tracks (Virality, Revenue, AI as Agency), each rated
  Easy / Medium / Hard.
- **Search and filters** by keyword, track, and level, plus a random-idea picker.
- **Full brief per idea**, opened in a side drawer: why it can win, a step-by-step
  build plan, who it's for, how the agent fits, what you'll need, memory and
  self-learning notes, partner power-ups, the demo moment, and deploy/proof/scoring.
  Each brief can be copied to the clipboard as plain text.
- **Deep links** — opening an idea sets a `#idea-N` hash you can share.
- **Light and dark themes**, following the system setting with a manual toggle.
- **Submit an idea** form at the bottom (see below).

## Editing the ideas

Don't edit `index.html` by hand — it's generated. Edit the source and rebuild:

```
src/ideas.json      the 93 idea records
src/template.html   markup, styles, and behaviour
src/build.py        inlines the JSON into the template
```

```bash
python3 src/build.py
```

This inlines `ideas.json` into `template.html` at the `/*__IDEAS_JSON__*/`
placeholder and writes `index.html`.

Each idea record has these fields:

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
| `powerups` | Partner power-ups |
| `demo` | The demo moment |
| `deploy`, `proof`, `score` | Deploy target, proof bar, scoring note |

## Idea submissions

The "Open call" form at the bottom of the page saves submissions to the
visitor's own browser via `localStorage` — **nothing is sent anywhere and
submissions are not shared between people.**

To collect them for real, set `SUBMIT_ENDPOINT` near the bottom of
`src/template.html` to a URL that accepts a JSON `POST`:

```js
const SUBMIT_ENDPOINT = 'https://example.com/api/ideas';
```

The posted body is `{ name, brief, track, difficulty, by }`. If the request
fails the entry falls back to local storage so nothing is lost. Any endpoint
works — a Cloudflare Worker, an Airtable or Sheets webhook, a form service.
Rebuild after changing it.

## Deploying

`index.html` is fully self-contained, so any static host works. For GitHub
Pages, enable Pages on the `main` branch at the repository root and the file is
served as-is.
