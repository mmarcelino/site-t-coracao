/**
 * Type-only wordmark until the client's brand assets arrive (CLAUDE.md §15).
 * Branch ahotels: compressed bold caps, like a stamped hotel sign.
 */
export function Wordmark({ className }: { className?: string }) {
  return (
    <span className={className} translate="no">
      <span className="condensed text-[1.75rem] leading-none tracking-[0.005em]">Tripas-Coração</span>
    </span>
  );
}
