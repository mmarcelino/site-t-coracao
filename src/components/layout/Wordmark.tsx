/**
 * Type-only wordmark until the client's brand assets arrive (CLAUDE.md §15).
 * Branch ahotels: Hanken Grotesk bold, mixed case and tight, so it reads as a mark and not as
 * another (compressed caps) nav link.
 */
export function Wordmark({ className }: { className?: string }) {
  return (
    <span className={className} translate="no">
      <span className="text-[1.375rem] leading-none font-bold tracking-[-0.045em]">Tripas-Coração</span>
    </span>
  );
}
