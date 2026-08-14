'use client';

import { useEffect, useRef, useState } from 'react';
import { DIFF_LEVEL, buildBrief, labelsFor, parsePowerup } from '../lib/ideas';
import { Meter } from './Meter';

/** Copy helper with a clipboard fallback for non-secure contexts. */
async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    let ok = false;
    try {
      ok = document.execCommand('copy');
    } catch {
      ok = false;
    }
    document.body.removeChild(ta);
    return ok;
  }
}

/** The copy-and-go build prompt shown at the top of a starter brief. */
function PromptBlock({ prompt }) {
  const [label, setLabel] = useState('Copy prompt');
  const copy = async () => {
    const ok = await copyText(prompt);
    setLabel(ok ? 'Copied' : 'Press ⌘C');
    setTimeout(() => setLabel('Copy prompt'), 1500);
  };
  return (
    <div className="prompt-block">
      <div className="prompt-head">
        <span className="prompt-label">Build prompt</span>
        <button type="button" className="prompt-copy" onClick={copy}>{label}</button>
      </div>
      <pre className="prompt-body">{prompt}</pre>
      <p className="prompt-hint">
        Paste this into Claude Code, Cursor, or any coding agent to get v1 running.
      </p>
    </div>
  );
}

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
    const ok = await copyText(buildBrief(idea));
    setCopyLabel(ok ? 'Copied' : 'Press ⌘C');
    setTimeout(() => setCopyLabel('Copy brief'), 1500);
  };

  const L = idea ? labelsFor(idea) : null;

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

              {idea.prompt && <PromptBlock prompt={idea.prompt} />}

              {idea.why && (
                <Section label={L.why}>
                  <p>{idea.why}</p>
                </Section>
              )}

              {idea.plan?.length > 0 && (
                <Section label={L.plan}>
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
                <Section label={L.need}>
                  <ul className="checklist">
                    {idea.need.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </Section>
              )}

              {idea.levelups?.length > 0 && (
                <Section label={L.levelups}>
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

              <Section label={idea.kind === 'starter' ? 'Stack and scope' : 'Deploy and proof'}>
                <div className="spec-table">
                  {[
                    [L.deploy, idea.deploy],
                    ['API', idea.api],
                    [L.proof, idea.proof],
                    [L.score, idea.score],
                  ]
                    .filter(([, value]) => value)
                    .map(([key, value]) => (
                      <div className="spec-row" key={key}>
                        <div className="spec-key">{key}</div>
                        <div className="spec-val">{value}</div>
                      </div>
                    ))}
                </div>
              </Section>
            </div>
          </>
        )}
      </div>
    </>
  );
}