/** Spinner — pass size + border colour via `className`. */
export function Spinner({ className = "" }: { className?: string }) {
  return (
    <div className={`rounded-full animate-spin ${className}`} aria-hidden="true" />
  );
}
