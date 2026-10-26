/**
 * Type-only wordmark until the client's brand assets arrive (CLAUDE.md §15).
 * Hanken Grotesk, regular weight and tight tracking: the same voice as the headline's sans line.
 */
export function Wordmark({ className }: { className?: string }) {
  return (
    <span className={className} translate="no">
      <span className="text-[1.625rem] leading-none font-normal tracking-[-0.04em]">Tripas-Coração</span>
    </span>
  );
}
