import { IdeaCard } from './IdeaCard';

export function IdeaGrid({ ideas, onOpen }) {
  if (!ideas.length) {
    return (
      <div className="grid">
        <div className="empty-state">
          No ideas match those filters. Try clearing the search or track.
        </div>
      </div>
    );
  }

  return (
    <div className="grid">
      {ideas.map((idea, i) => (
        <IdeaCard key={idea.id} idea={idea} position={i} onOpen={onOpen} />
      ))}
    </div>
  );
}
