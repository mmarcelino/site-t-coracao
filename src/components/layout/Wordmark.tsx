/**
 * Type-only wordmark until the client's brand assets arrive (CLAUDE.md §15).
 * Instrument Serif, upright, echoing the serif in the hero headline.
 */
export function Wordmark({ className }: { className?: string }) {
  return (
    <span className={className} translate="no">
      <span className="font-serif text-[1.75rem] leading-none font-normal tracking-[-0.01em] not-italic">
        Tripas-Coração
      </span>
    </span>
  );
}
