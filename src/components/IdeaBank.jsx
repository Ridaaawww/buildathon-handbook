'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { SORTED_IDEAS, IDEAS } from '../lib/ideas';
import { useTheme } from '../hooks/useTheme';
import { ThemeToggle } from './ThemeToggle';
import { TitleBlock } from './TitleBlock';
import { Toolbar } from './Toolbar';
import { IdeaGrid } from './IdeaGrid';
import { IdeaDrawer } from './IdeaDrawer';
import { StairPanel } from './StairPanel';
import { SubmitSection } from './SubmitSection';

function ideaIdFromHash() {
  const match = window.location.hash.match(/^#idea-(\d+)$/);
  if (!match) return null;
  const id = Number(match[1]);
  return Number.isInteger(id) && id >= 0 && id < IDEAS.length ? id : null;
}

export default function IdeaBank() {
  const { theme, cycle } = useTheme();
  const [query, setQuery] = useState('');
  const [track, setTrack] = useState('all');
  const [difficulty, setDifficulty] = useState('all');
  // Starts closed: the hash cannot be read during a server prerender, so the
  // deep link is resolved after mount instead.
  const [openId, setOpenId] = useState(null);

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

  // Resolve any incoming deep link once, after mount, and follow back/forward.
  const [hashRead, setHashRead] = useState(false);
  useEffect(() => {
    setOpenId(ideaIdFromHash());
    setHashRead(true);
    const onHashChange = () => setOpenId(ideaIdFromHash());
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  // Keep the URL hash in step with the open drawer. Held back until the
  // incoming hash has been read, or this would strip it on first mount.
  useEffect(() => {
    if (!hashRead) return;
    if (openId === null) {
      if (window.location.hash) {
        window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}`);
      }
    } else if (window.location.hash !== `#idea-${openId}`) {
      window.history.replaceState(null, '', `#idea-${openId}`);
    }
  }, [openId, hashRead]);

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
