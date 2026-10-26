import clsx from "clsx";
import type { ReactNode } from "react";

/** Eyebrow label + large light headline + optional body, the site's standard section opener. */
export function SectionHeader({
  eyebrow,
  title,
  children,
  id,
  as: Heading = "h2",
  className,
  align = "start",
}: {
  eyebrow: string;
  title: string;
  children?: ReactNode;
  id?: string;
  as?: "h1" | "h2";
  className?: string;
  align?: "start" | "split";
}) {
  return (
    <header
      className={clsx(
        "reveal",
        align === "split" ? "grid gap-6 md:grid-cols-12 md:items-end" : "max-w-4xl",
        className,
      )}
    >
      <div className={clsx(align === "split" && "md:col-span-7")}>
        <p className="label mb-5 text-granite">{eyebrow}</p>
        <Heading id={id} className={Heading === "h1" ? "text-h1" : "text-h2"}>
          {title}
        </Heading>
      </div>
      {children ? (
        <div
          className={clsx(
            "text-lead text-granite",
            align === "split" ? "md:col-span-5 md:col-start-8" : "mt-6 max-w-2xl",
          )}
        >
          {children}
        </div>
      ) : null}
    </header>
  );
}
