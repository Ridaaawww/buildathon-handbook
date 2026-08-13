import { IDEAS, TRACKS } from '../lib/ideas';

export function TitleBlock() {
  return (
    <header className="titleblock">
      <div className="tb-left">
        <p className="tb-eyebrow">Buildathon · Project Index</p>
        <h1 className="tb-title">Idea Bank</h1>
        <p className="tb-sub">
          Every project spec from the builder handbook — brief, build plan, integration
          notes, and demo moment — in one browsable list.{' '}
          <strong>{IDEAS.length} ideas</strong> across {TRACKS.length} tracks.
        </p>
      </div>
    </header>
  );
}
