/** Three-segment difficulty meter: filled segments encode the level. */
export function Meter({ level }) {
  return (
    <span className="meter" aria-hidden="true">
      {[1, 2, 3].map((i) => (
        <i key={i} className={i <= level ? 'seg on' : 'seg'} />
      ))}
    </span>
  );
}
