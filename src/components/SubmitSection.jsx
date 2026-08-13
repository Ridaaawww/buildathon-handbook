import { useRef, useState } from 'react';
import { DIFFICULTIES, TRACKS } from '../lib/ideas';
import { useSubmissions } from '../hooks/useSubmissions';

// Point this at a URL and submissions POST there as JSON instead of being
// saved locally. The body is { name, brief, track, difficulty, by }.
const SUBMIT_ENDPOINT = '';

const EMPTY = { name: '', brief: '', track: TRACKS[0], difficulty: 'Medium', by: '' };

export function SubmitSection() {
  const { submissions, add, removeAt } = useSubmissions();
  const [form, setForm] = useState(EMPTY);
  const [label, setLabel] = useState('Add to the bank');
  const [note, setNote] = useState('');
  const honeypot = useRef(null);
  const nameRef = useRef(null);
  const briefRef = useRef(null);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    if (honeypot.current?.value) return; // bot filled the hidden field

    const entry = {
      name: form.name.trim(),
      brief: form.brief.trim(),
      track: form.track,
      difficulty: form.difficulty,
      by: form.by.trim(),
    };

    if (!entry.name || !entry.brief) {
      setNote('Add a name and a one-line description.');
      (entry.name ? briefRef : nameRef).current?.focus();
      return;
    }

    if (SUBMIT_ENDPOINT) {
      setLabel('Sending…');
      try {
        const res = await fetch(SUBMIT_ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(entry),
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        setNote('Sent.');
      } catch (err) {
        add(entry);
        setForm(EMPTY);
        setLabel('Add to the bank');
        setNote(`Could not send — ${err.message}. Saved locally instead.`);
        return;
      }
    } else {
      setNote('Saved in this browser.');
    }

    add(entry);
    setForm(EMPTY);
    setLabel('Added');
    setTimeout(() => setLabel('Add to the bank'), 1600);
  };

  return (
    <section className="submit-sec">
      <div className="submit-inner">
        <div className="submit-head">
          <p className="bracket">[ Open call ]</p>
          <h2 className="submit-title">Got an idea you want someone else to build?</h2>
          <p className="submit-sub">
            Drop it here and it goes into the bank alongside the rest. The best
            submissions are one concrete thing a person could ship in a day, not a
            category.
          </p>
        </div>

        <div>
          <form className="form-grid" onSubmit={submit} noValidate>
            <div className="field">
              <label className="field-label" htmlFor="f-name">Idea name</label>
              <input
                className="f-input"
                id="f-name"
                ref={nameRef}
                value={form.name}
                onChange={set('name')}
                placeholder="Roast My Landing Page"
                maxLength={80}
              />
            </div>

            <div className="field">
              <label className="field-label" htmlFor="f-brief">What is it, in one line</label>
              <textarea
                className="f-textarea"
                id="f-brief"
                ref={briefRef}
                value={form.brief}
                onChange={set('brief')}
                placeholder="A public URL where founders paste a site and get a brutal, funny, useful teardown with share cards."
                maxLength={400}
              />
            </div>

            <div className="f-row">
              <div className="field">
                <label className="field-label" htmlFor="f-track">Track</label>
                <select className="f-select" id="f-track" value={form.track} onChange={set('track')}>
                  {TRACKS.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
              <div className="field">
                <label className="field-label" htmlFor="f-diff">Level</label>
                <select className="f-select" id="f-diff" value={form.difficulty} onChange={set('difficulty')}>
                  {DIFFICULTIES.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="field">
              <label className="field-label" htmlFor="f-by">
                Your name or handle{' '}
                <span style={{ textTransform: 'none', letterSpacing: 0 }}>(optional)</span>
              </label>
              <input
                className="f-input"
                id="f-by"
                value={form.by}
                onChange={set('by')}
                placeholder="@yourhandle"
                maxLength={40}
              />
            </div>

            <input
              className="hp"
              type="text"
              ref={honeypot}
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
            />

            <div className="form-actions">
              <button className="submit-btn" type="submit">
                <span className="orb" />
                <span>{label}</span>
              </button>
              <span className="form-note" aria-live="polite">{note}</span>
            </div>
          </form>

          {submissions.length > 0 && (
            <div className="subs">
              <div className="subs-head">
                Submitted from this browser — {submissions.length}
              </div>
              {submissions.map((s, i) => (
                <div className="sub-card" key={`${s.name}-${i}`}>
                  <div className="sub-top">
                    <span className="sub-name">{s.name}</span>
                    <span className="sub-meta">{s.difficulty} · {s.track}</span>
                  </div>
                  <p className="sub-brief">{s.brief}</p>
                  <div className="sub-foot">
                    <span className="sub-by">{s.by || 'anonymous'}</span>
                    <button type="button" className="sub-remove" onClick={() => removeAt(i)}>
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
