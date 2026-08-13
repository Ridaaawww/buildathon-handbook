import { useCallback, useEffect, useMemo, useState } from 'react';
import { SORTED_IDEAS, IDEAS } from './lib/ideas';
import { useTheme } from './hooks/useTheme';
import { ThemeToggle } from './components/ThemeToggle';
import { TitleBlock } from './components/TitleBlock';
import { Toolbar } from './components/Toolbar';
import { IdeaGrid } from './components/IdeaGrid';
import { IdeaDrawer } from './components/IdeaDrawer';
import { StairPanel } from './components/StairPanel';
import { SubmitSection } from './components/SubmitSection';

function ideaIdFromHash() {
  const match = window.location.hash.match(/^#idea-(\d+)$/);
  if (!match) return null;
  const id = Number(match[1]);
  return Number.isInteger(id) && id >= 0 && id < IDEAS.length ? id : null;
}

export default function App() {
  const { theme, cycle } = useTheme();
  const [query, setQuery] = useState('');
  const [track, setTrack] = useState('all');
  const [difficulty, setDifficulty] = useState('all');
  const [openId, setOpenId] = useState(ideaIdFromHash);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return SORTED_IDEAS.filter((idea) => {
      if (track !== 'all' && idea.track !== track) return false;
      if (difficulty !== 'all' && idea.difficulty !== difficulty) return false;
      if (q && !idea.haystack.includes(q)) return false;
      return true;
    });
  }, [query, track, difficulty]);

  const openIdea = useCallback((id) => setOpenId(id), []);
  const closeDrawer = useCallback(() => setOpenId(null), []);

  const openRandom = useCallback(() => {
    const pool = visible.length ? visible : SORTED_IDEAS;
    setOpenId(pool[Math.floor(Math.random() * pool.length)].id);
  }, [visible]);

  // Keep the URL hash in step with the open drawer, and follow back/forward.
  useEffect(() => {
    const target = openId === null ? `${window.location.pathname}${window.location.search}` : `#idea-${openId}`;
    if (openId === null) {
      if (window.location.hash) window.history.replaceState(null, '', target);
    } else if (window.location.hash !== target) {
      window.history.replaceState(null, '', target);
    }
  }, [openId]);

  useEffect(() => {
    const onHashChange = () => setOpenId(ideaIdFromHash());
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const openIdea_ = openId === null ? null : IDEAS[openId];

  return (
    <>
      <ThemeToggle theme={theme} onCycle={cycle} />

      <div className="wrap">
        <TitleBlock />
        <Toolbar
          query={query}
          track={track}
          difficulty={difficulty}
          onQuery={setQuery}
          onTrack={setTrack}
          onDifficulty={setDifficulty}
          shown={visible.length}
          onRandom={openRandom}
        />
        <IdeaGrid ideas={visible} onOpen={openIdea} />
      </div>

      <StairPanel />
      <SubmitSection />

      <IdeaDrawer idea={openIdea_} onClose={closeDrawer} />
    </>
  );
}
