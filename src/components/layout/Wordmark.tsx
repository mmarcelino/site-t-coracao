/**
 * Type-only wordmark until the client's brand assets arrive (CLAUDE.md §15).
 * Branch ahotels: compressed bold caps (Barlow Condensed), like the nav.
 */
export function Wordmark({ className }: { className?: string }) {
  return (
    <span className={className} translate="no">
      <span className="nav-type text-[1.375rem] leading-none">Tripas-Coração</span>
    </span>
  );
}
