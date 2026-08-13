import { useEffect, useRef, useState } from 'react';
import { DIFF_LEVEL, buildBrief, parsePowerup } from '../lib/ideas';
import { Meter } from './Meter';

function Section({ label, children }) {
  return (
    <div className="d-section">
      <div className="d-label">{label}</div>
      {children}
    </div>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" width="16" height="16">
      <line x1="5" y1="5" x2="19" y2="19" />
      <line x1="19" y1="5" x2="5" y2="19" />
    </svg>
  );
}

export function IdeaDrawer({ idea, onClose }) {
  const [copyLabel, setCopyLabel] = useState('Copy brief');
  const bodyRef = useRef(null);
  const closeRef = useRef(null);
  const open = Boolean(idea);

  // Reset scroll and copy state whenever a different idea is opened.
  useEffect(() => {
    if (!idea) return;
    setCopyLabel('Copy brief');
    if (bodyRef.current) bodyRef.current.scrollTop = 0;
    closeRef.current?.focus();
  }, [idea]);

  // Escape closes; lock background scroll while open.
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = previous;
    };
  }, [open, onClose]);

  const copy = async () => {
    const text = buildBrief(idea);
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand('copy');
      } catch {
        setCopyLabel('Press ⌘C');
        document.body.removeChild(ta);
        return;
      }
      document.body.removeChild(ta);
    }
    setCopyLabel('Copied');
    setTimeout(() => setCopyLabel('Copy brief'), 1500);
  };

  return (
    <>
      <div className={open ? 'backdrop open' : 'backdrop'} onClick={onClose} />
      <div
        className={open ? 'drawer open' : 'drawer'}
        role="dialog"
        aria-modal="true"
        aria-hidden={!open}
        aria-label={idea ? idea.name : undefined}
      >
        {idea && (
          <>
            <div className="drawer-top">
              <div className="drawer-top-left">
                <span className="diff-pill">
                  <Meter level={DIFF_LEVEL[idea.difficulty]} />
                  {idea.difficulty}
                </span>
                <span className="track-tag">{idea.track}</span>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button type="button" className="drawer-copy" onClick={copy}>
                  {copyLabel}
                </button>
                <button
                  type="button"
                  className="drawer-close"
                  onClick={onClose}
                  aria-label="Close"
                  ref={closeRef}
                >
                  <CloseIcon />
                </button>
              </div>
            </div>

            <div className="drawer-body" ref={bodyRef}>
              <h2 className="drawer-title">{idea.name}</h2>
              <p className="drawer-lead">{idea.build}</p>

              {idea.why && (
                <Section label="Why it can win">
                  <p>{idea.why}</p>
                </Section>
              )}

              {idea.plan?.length > 0 && (
                <Section label="How to build it, step by step">
                  <ol>
                    {idea.plan.map((step, i) => (
                      <li key={i}>{step}</li>
                    ))}
                  </ol>
                </Section>
              )}

              {idea.scenario && (
                <Section label="Who this is for">
                  <p>{idea.scenario}</p>
                </Section>
              )}

              {idea.hermes && (
                <Section label="How the agent fits">
                  <p>{idea.hermes}</p>
                </Section>
              )}

              {idea.need?.length > 0 && (
                <Section label="What you will need">
                  <ul className="checklist">
                    {idea.need.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </Section>
              )}

              {idea.levelups?.length > 0 && (
                <Section label="Memory and self-learning">
                  <ul>
                    {idea.levelups.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </Section>
              )}

              {idea.powerups?.length > 0 && (
                <Section label="Partner power-ups">
                  <div className="powerup-list">
                    {idea.powerups.map((raw, i) => {
                      const { name, points, description } = parsePowerup(raw);
                      return (
                        <div className="powerup" key={i}>
                          {name && <span className="powerup-name">{name}</span>}
                          {points && <span className="powerup-pts">+{points}</span>}
                          <span className="powerup-desc">{description}</span>
                        </div>
                      );
                    })}
                  </div>
                </Section>
              )}

              {idea.demo && (
                <Section label="Your demo moment">
                  <p>{idea.demo}</p>
                </Section>
              )}

              <Section label="Deploy and proof">
                <div className="spec-table">
                  <div className="spec-row">
                    <div className="spec-key">Deploy</div>
                    <div className="spec-val">{idea.deploy}</div>
                  </div>
                  <div className="spec-row">
                    <div className="spec-key">Proof bar</div>
                    <div className="spec-val">{idea.proof}</div>
                  </div>
                  <div className="spec-row">
                    <div className="spec-key">Scoring note</div>
                    <div className="spec-val">{idea.score}</div>
                  </div>
                </div>
              </Section>
            </div>
          </>
        )}
      </div>
    </>
  );
}
