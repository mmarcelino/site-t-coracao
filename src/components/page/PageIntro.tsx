import Image from "next/image";
import type { ReactNode } from "react";

/**
 * Opening of the editorial pages (about, experiences, owners, FAQ), laid out like the home page's
 * first section: a large light headline with the text beside it, bottoms aligned, all at the home
 * intro's size (20px); the text drops below on narrow screens. Then (optionally) one wide photo,
 * the LCP.
 */
export function PageIntro({
  title,
  lead,
  children,
  image,
}: {
  title: string;
  /** One or more paragraphs, all the same size. */
  lead: string | string[];
  /** Under the text: a proof line, buttons… */
  children?: ReactNode;
  image?: { src: string; alt: string };
}) {
  return (
    <>
      <header className="container-page pt-[clamp(3rem,7vw,6rem)]">
        <div className="flex flex-wrap items-end gap-x-16 gap-y-8">
          <h1 className="text-h1 max-w-4xl flex-[1_1_28rem] text-balance">{title}</h1>
          <div className="max-w-xl flex-[1_1_23rem] lg:ml-auto lg:max-w-[38rem]">
            <div className="space-y-5 text-[1.25rem] leading-[1.5]">
              {(Array.isArray(lead) ? lead : [lead]).map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
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
