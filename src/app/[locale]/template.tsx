import { ViewTransition } from "react";

/**
 * Soft page transitions. A template remounts on every navigation (a layout doesn't), so the old
 * page leaves and the new one enters through the View Transitions API: a slow cross-fade, styled
 * in globals.css (`page-enter` / `page-exit`). Query-string changes (filters) don't remount it, so
 * they don't animate. Browsers without support just swap pages.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <ViewTransition enter="page-enter" exit="page-exit" default="none">
      {children}
    </ViewTransition>
  );
}
