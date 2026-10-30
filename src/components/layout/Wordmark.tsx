/**
 * Type-only wordmark until the client's brand assets arrive (CLAUDE.md §15).
 * Hanken Grotesk, semibold and tight: the same weight as the hero headline.
 */
export function Wordmark({ className }: { className?: string }) {
  return (
    <span className={className} translate="no">
      <span className="text-[1.375rem] leading-none font-semibold tracking-[-0.04em]">Tripas-Coração</span>
    </span>
  );
}
