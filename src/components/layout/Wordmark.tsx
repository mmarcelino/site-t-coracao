/**
 * Type-only wordmark until the client's brand assets arrive (CLAUDE.md §15).
 * Semibold, tight tracking, with a softened hyphen as the only flourish.
 */
export function Wordmark({ className }: { className?: string }) {
  return (
    <span className={className} translate="no">
      <span className="text-[1.4375rem] leading-none font-semibold tracking-[-0.045em]">
        Tripas<span className="opacity-60">-</span>Coração
      </span>
    </span>
  );
}
