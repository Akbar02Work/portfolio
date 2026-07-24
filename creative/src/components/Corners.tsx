/** Decorative corner brackets — the “finished object” feel. */
export function Corners({ className = "" }: { className?: string }) {
  return (
    <div className={`corners ${className}`} aria-hidden="true">
      <span className="corners__tl" />
      <span className="corners__tr" />
      <span className="corners__bl" />
      <span className="corners__br" />
    </div>
  );
}
