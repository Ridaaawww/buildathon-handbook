import { DIFFICULTIES, DIFF_COUNTS, IDEAS, TRACKS, TRACK_COUNTS } from '../lib/ideas';

export function Toolbar({ query, track, difficulty, onQuery, onTrack, onDifficulty, shown, onRandom }) {
  return (
    <div className="toolbar">
      <div className="toolbar-row">
        <div className="search-field">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <circle cx="11" cy="11" r="7" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            value={query}
            onChange={(e) => onQuery(e.target.value)}
            placeholder="Search ideas…"
            aria-label="Search ideas"
            autoComplete="off"
          />
        </div>

        <select
          className="select"
          value={track}
          onChange={(e) => onTrack(e.target.value)}
          aria-label="Filter by track"
        >
          <option value="all">All tracks</option>
          {TRACKS.map((t) => (
            <option key={t} value={t}>{`${t} (${TRACK_COUNTS[t]})`}</option>
          ))}
        </select>

        <select
          className="select"
          value={difficulty}
          onChange={(e) => onDifficulty(e.target.value)}
          aria-label="Filter by level"
        >
          <option value="all">All levels</option>
          {DIFFICULTIES.map((d) => (
            <option key={d} value={d}>{`${d} (${DIFF_COUNTS[d]})`}</option>
          ))}
        </select>

        <div className="toolbar-meta">
          <span className="result-line" aria-live="polite">
            <strong>{shown}</strong> of {IDEAS.length} ideas shown
          </span>
          <button type="button" className="link-btn" onClick={onRandom}>
            Random idea
          </button>
        </div>
      </div>
    </div>
  );
}
