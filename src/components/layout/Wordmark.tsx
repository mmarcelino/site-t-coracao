/**
 * Type-only wordmark until the client's brand assets arrive (CLAUDE.md §15).
 * Regular weight, tight tracking, with a softened hyphen as the only flourish.
 */
export function Wordmark({ className }: { className?: string }) {
  return (
    <span className={className} translate="no">
      <span className="text-[1.3125rem] leading-none font-normal tracking-[-0.04em]">
        Tripas<span className="opacity-60">-</span>Coração
      </span>
    </span>
  );
}
