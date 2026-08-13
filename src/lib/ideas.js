import rawIdeas from '../data/ideas.json';

export const DIFF_ORDER = { Easy: 0, Medium: 1, Hard: 2 };
export const DIFF_LEVEL = { Easy: 1, Medium: 2, Hard: 3 };
export const DIFFICULTIES = ['Easy', 'Medium', 'Hard'];

/** Ideas with a stable id and a prebuilt lowercase search haystack. */
export const IDEAS = rawIdeas.map((idea, index) => ({
  ...idea,
  id: index,
  haystack: `${idea.name} ${idea.build} ${idea.why || ''}`.toLowerCase(),
}));

export const TRACKS = [...new Set(IDEAS.map((idea) => idea.track))];

export const TRACK_COUNTS = TRACKS.reduce((acc, track) => {
  acc[track] = IDEAS.filter((idea) => idea.track === track).length;
  return acc;
}, {});

export const DIFF_COUNTS = DIFFICULTIES.reduce((acc, level) => {
  acc[level] = IDEAS.filter((idea) => idea.difficulty === level).length;
  return acc;
}, {});

/** Easy first, then alphabetical — the order the board renders in. */
export const SORTED_IDEAS = [...IDEAS].sort((a, b) => {
  if (DIFF_ORDER[a.difficulty] !== DIFF_ORDER[b.difficulty]) {
    return DIFF_ORDER[a.difficulty] - DIFF_ORDER[b.difficulty];
  }
  return a.name.localeCompare(b.name);
});

/** Sponsor names for the card footer, or a fallback count of build steps. */
export function partnerMeta(idea) {
  const powerups = idea.powerups || [];
  if (!powerups.length) return `${(idea.need || []).length} build steps`;
  return powerups.map((s) => s.split(' (')[0]).join(' · ');
}

/** Split "Convex (+25): does a thing" into its parts for display. */
export function parsePowerup(text) {
  const match = text.match(/^([^(]+)\(\+(\d+)\):\s*(.*)$/);
  if (!match) return { name: null, points: null, description: text };
  return { name: match[1].trim(), points: match[2], description: match[3] };
}

/** The full brief as plain text, for the drawer's copy button. */
export function buildBrief(idea) {
  const lines = [
    idea.name,
    `${idea.difficulty} idea · ${idea.track} track`,
    '',
    idea.build,
    '',
  ];
  const section = (title, body) => {
    lines.push(title, body, '');
  };
  const list = (title, items, bullet = '- ') => {
    lines.push(title);
    items.forEach((item, i) => {
      lines.push(bullet === 'n' ? `${i + 1}. ${item}` : `${bullet}${item}`);
    });
    lines.push('');
  };

  if (idea.why) section('Why it can win', idea.why);
  if (idea.plan?.length) list('How to build it, step by step', idea.plan, 'n');
  if (idea.scenario) section('Who this is for', idea.scenario);
  if (idea.hermes) section('How the agent fits', idea.hermes);
  if (idea.need?.length) list('What you will need', idea.need);
  if (idea.levelups?.length) list('Memory and self-learning', idea.levelups);
  if (idea.powerups?.length) list('Partner power-ups', idea.powerups);
  if (idea.demo) section('Your demo moment', idea.demo);

  lines.push(`Deploy: ${idea.deploy}`);
  lines.push(`Proof bar: ${idea.proof}`);
  lines.push(`Scoring note: ${idea.score}`);
  return lines.join('\n');
}

/** The nine parts every brief is broken into — content for the staircase panel. */
export const BRIEF_PARTS = [
  ['Why it can win', 'The wedge in one paragraph: what makes this idea land, the mistake most teams make with it, and the metric that actually moves.'],
  ['How to build it, step by step', 'The whole day in order, from the announcement post you write before any code to the demo you rehearse at the end.'],
  ['Who this is for', 'A named person in a real situation, not a persona. You build for someone specific or you build for nobody.'],
  ['How the agent fits', 'Which parts are genuinely agent work: browsing, clustering, drafting, scoring, remembering between runs.'],
  ['What you will need', 'The build checklist, broken into pieces small enough that each one ships on its own.'],
  ['Memory and self-learning', 'How the thing gets sharper the more it is used, and an honest note on where its ceiling sits.'],
  ['Partner power-ups', 'Which sponsor tools earn points on this idea, and the specific job each one does inside it.'],
  ['Your demo moment', 'The thirty seconds you put on the screen, and the dashboard you flip to once the room is watching.'],
  ['Deploy and proof', 'Where it runs, the proof bar you have to clear, and the note on how judges will read your score.'],
];
