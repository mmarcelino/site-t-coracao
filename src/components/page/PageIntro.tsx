import Image from "next/image";
import type { ReactNode } from "react";

/**
 * Opening of the editorial pages (about, experiences, owners, FAQ): a large light headline, the
 * lead set to the right on wide screens, then (optionally) one wide photo, the LCP.
 */
export function PageIntro({
  title,
  lead,
  children,
  image,
}: {
  title: string;
  lead: string;
  /** Under the lead: a proof line, buttons… */
  children?: ReactNode;
  image?: { src: string; alt: string };
}) {
  return (
    <>
      <header className="container-page pt-[clamp(3rem,7vw,6rem)]">
        <h1 className="text-h1 max-w-5xl text-balance">{title}</h1>
        <div className="mt-8 grid lg:mt-12 lg:grid-cols-12">
          <div className="lg:col-span-6 lg:col-start-7">
            <p className="text-lead">{lead}</p>
            {children}
          </div>
        </div>
      </header>
      {image ? (
        <div className="container-page mt-[clamp(3rem,6vw,5rem)]">
          <div className="relative aspect-[4/3] overflow-hidden rounded-[var(--radius-card)] bg-sand md:aspect-[21/9]">
            <Image src={image.src} alt={image.alt} fill priority sizes="(min-width: 96rem) 92rem, 100vw" className="object-cover" />
          </div>
        </div>
      ) : null}
    </>
  );
}
