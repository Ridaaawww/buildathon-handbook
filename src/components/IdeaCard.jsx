import { DIFF_LEVEL, partnerMeta } from '../lib/ideas';
import { Meter } from './Meter';

export function IdeaCard({ idea, position, onOpen }) {
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onOpen(idea.id);
    }
  };

  return (
    <div
      className={`card diff-${idea.difficulty}`}
      style={{ animationDelay: `${Math.min(position, 24) * 16}ms` }}
      role="button"
      tabIndex={0}
      aria-label={`${idea.name}, open full brief`}
      onClick={() => onOpen(idea.id)}
      onKeyDown={handleKeyDown}
    >
      <div className="card-top">
        <span className="diff-pill">
          <Meter level={DIFF_LEVEL[idea.difficulty]} />
          {idea.difficulty}
        </span>
        <span className="track-tag">{idea.track}</span>
      </div>
      <h3 className="card-title">{idea.name}</h3>
      <p className="card-desc">{idea.build}</p>
      <div className="card-foot">
        <span className="card-meta">{partnerMeta(idea)}</span>
        <span className="card-cta">Open brief →</span>
      </div>
    </div>
  );
}
