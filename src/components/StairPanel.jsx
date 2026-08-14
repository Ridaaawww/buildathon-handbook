'use client';

import { useEffect, useRef, useState } from 'react';
import { BRIEF_PARTS, IDEAS } from '../lib/ideas';
import { useReducedMotion } from '../hooks/useReducedMotion';

/** Numbered staircase of the nine parts every brief contains. */
export function StairPanel() {
  const reduced = useReducedMotion();
  const listRef = useRef(null);
  const [revealed, setRevealed] = useState(() => new Set());

  useEffect(() => {
    if (reduced || !('IntersectionObserver' in window)) return undefined;
    const items = listRef.current?.querySelectorAll('li') ?? [];
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const index = Number(entry.target.dataset.index);
          setRevealed((current) => new Set(current).add(index));
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: '0px 0px -12% 0px' },
    );
    items.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, [reduced]);

  // Without the observer every item renders visible.
  const animate = !reduced && typeof window !== 'undefined' && 'IntersectionObserver' in window;

  return (
    <section className="panel">
      <div className="panel-inner">
        <div className="panel-head">
          <h2 className="panel-title">
            Every brief already specced. So you can skip to the building.
          </h2>
          <p className="panel-sub">
            {IDEAS.length} ideas, each one broken down the same nine ways. Open any card
            and the thinking is already done, so the only thing left to choose is which
            one is worth your day.
          </p>
        </div>

        <ul className={animate ? 'stair reveal-ready' : 'stair'} ref={listRef}>
          {BRIEF_PARTS.map(([title, text], i) => (
            <li key={title} data-index={i} className={revealed.has(i) ? 'in' : undefined}>
              <p className="stair-num">
                <span className="idx">{String(i + 1).padStart(3, '0')}</span> / {title}
              </p>
              <p className="stair-text">{text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}