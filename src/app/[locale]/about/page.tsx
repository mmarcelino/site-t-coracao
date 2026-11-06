import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { locale as rootLocale } from "next/root-params";
import { about } from "@/content/about";
import { site } from "@/content/site";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { getListings } from "@/lib/data";
import { createFormatter } from "@/lib/format";
import { alternates } from "@/lib/seo";
import { PageIntro } from "@/components/page/PageIntro";
import { WhatsAppLink } from "@/components/WhatsAppLink";
import { buttonClasses } from "@/components/ui/Button";

export async function generateMetadata(): Promise<Metadata> {
  const locale = (await rootLocale()) as Locale;
  return { title: about.meta.title[locale], description: about.meta.description[locale], alternates: alternates(locale, "/about") };
}

/**
 * About: the name and what it means · one wide photo · the story ("would we live here?") · the
 * figures · the team · how stays are looked after · come and stay. Copy in `src/content/about.ts`.
 */
export default async function AboutPage() {
  const locale = (await rootLocale()) as Locale;
  const t = await getTranslations("aboutPage");
  const tw = await getTranslations("whatsapp");
  const format = createFormatter(locale);
  // Buildings are counted from the listings rather than `getBuildings()`: both read the same cached
  // Guesty data, and a second read here trips Next's "use cache" check for shared promises.
  const listings = await getListings(locale);
  const buildings = new Set(listings.map((l) => l.buildingId).filter(Boolean)).size;

  const figures = [
    { value: String(site.foundedYear), label: t("founded") },
    { value: `${format.number(site.guestsPerYear)}+`, label: t("guests") },
    { value: format.number(listings.length), label: t("homes") },
    { value: format.number(buildings), label: t("buildings") },
  ];

  return (
    <>
      <PageIntro
        title={about.title[locale]}
        lead={about.titleNote[locale]}
        image={{ src: about.image.src, alt: about.image.alt[locale] }}
      >
        <p className="mt-6">{about.lead[locale]}</p>
      </PageIntro>

      <section aria-labelledby="story-title" className="container-page section-y grid gap-10 lg:grid-cols-12">
        <h2 id="story-title" className="text-h2 reveal lg:col-span-5">
          {about.story.title[locale]}
        </h2>
        <div className="space-y-6 lg:col-span-6 lg:col-start-7">
          {about.story.body[locale].map((p, i) => (
            <p key={i} className={i === 0 ? "text-lead" : undefined}>
              {p}
            </p>
          ))}
        </div>
      </section>

      <section aria-label={t("figuresLabel")} className="container-page">
        <dl className="grid grid-cols-2 gap-x-8 gap-y-12 lg:grid-cols-4">
          {figures.map((f) => (
            <div key={f.label} className="reveal flex flex-col-reverse border-t-2 border-ink pt-5">
              <dt className="mt-2 text-granite">{f.label}</dt>
              <dd className="text-h1 tabular-nums">{f.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section aria-labelledby="team-title" className="container-page section-y grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <h2 id="team-title" className="text-h2 reveal">
            {about.team.title[locale]}
          </h2>
          <div className="mt-8 space-y-5">
            {about.team.body[locale].map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </div>
        <ul className="self-end border-t-2 border-ink lg:col-span-6 lg:col-start-7">
          {about.team.members.map((m) => (
            <li key={m.name} className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-b border-ink/15 py-4">
              <span className="text-[1.25rem] leading-snug font-medium">{m.name}</span>
              <span className="text-granite">{m.role[locale]}</span>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="care-title" className="bg-sand">
        <div className="container-page section-y-tight grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <h2 id="care-title" className="text-h2 reveal">
              {about.care.title[locale]}
            </h2>
            <p className="text-lead mt-6">{about.care.body[locale]}</p>
          </div>
          <div className="relative hidden aspect-[4/5] overflow-hidden rounded-[var(--radius-card)] lg:col-span-6 lg:col-start-7 lg:row-span-2 lg:block">
            <Image
              src="/images/placeholder/sao-bento-duplex-01.jpg"
              alt=""
              fill
              sizes="(min-width: 1024px) 45vw, 0px"
              className="object-cover"
            />
          </div>
          <ol className="grid gap-10 sm:grid-cols-3 lg:col-span-5 lg:grid-cols-1 lg:gap-8">
            {about.care.points.map((p) => (
              <li key={p.title.en} className="reveal border-t-2 border-ink pt-5">
                <h3 className="card-title">{p.title[locale]}</h3>
                <p className="mt-3">{p.body[locale]}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section aria-labelledby="cta-title" className="container-page section-y">
        <h2 id="cta-title" className="text-h2 reveal max-w-3xl">
          {t("ctaTitle")}
        </h2>
        <div className="mt-10 flex flex-wrap gap-3">
          <Link href="/apartments" className={buttonClasses("primary", "lg")}>
            {t("ctaApartments")}
          </Link>
          <WhatsAppLink message={tw("messageGeneric")} page="about" className={buttonClasses("secondary", "lg")}>
            {tw("cta")}
          </WhatsAppLink>
        </div>
      </section>
    </>
  );
}
