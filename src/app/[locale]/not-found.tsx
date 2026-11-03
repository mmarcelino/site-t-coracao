import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { buttonClasses } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";

/**
 * Localized not-found page (also shown for routes not built yet). No error number: a closed door,
 * one line about it, and one way out (the apartments) with a quiet link home. The whole page fits
 * the first screen under the header: on phones the photo takes whatever height the text leaves;
 * on desktop it fills the column beside it.
 */
export default async function NotFound() {
  const t = await getTranslations("notFound");

  return (
    <section className="container-page flex min-h-[calc(100svh-var(--header-h))] flex-col gap-8 py-[var(--gutter)] lg:grid lg:grid-cols-12 lg:gap-10">
      <div className="lg:col-span-6 lg:self-center">
        <p className="label text-granite">{t("label")}</p>
        <h1 className="mt-4 text-h1 max-w-2xl">{t("title")}</h1>
        <p className="mt-5 max-w-xl text-lead">{t("body")}</p>

        <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-5 lg:mt-12">
          <Link href="/apartments" className={buttonClasses("primary", "lg")}>
            {t("apartments")}
          </Link>
          <Link href="/" className="group inline-flex items-center gap-3 font-semibold">
            {t("home")}
            <Icon
              name="arrowRight"
              size={20}
              strokeWidth={1.75}
              className="transition-transform duration-[var(--duration-base)] ease-[var(--ease-soft)] group-hover:translate-x-1.5"
            />
          </Link>
        </div>
      </div>

      {/* A door that stays shut: above the text on phones (filling the height left; short phones
          leave it out), a tall photo beside it on desktop. */}
      <div className="relative -order-1 min-h-28 flex-1 [@media(max-height:640px)]:max-lg:hidden overflow-hidden rounded-[var(--radius-card)] bg-limestone lg:order-none lg:col-span-5 lg:col-start-8">
        <Image
          src="/images/placeholder/mouzinho-rooftop-e-03.jpg"
          alt={t("imageAlt")}
          fill
          priority
          sizes="(min-width: 1024px) 40vw, 100vw"
          className="object-cover"
        />
      </div>
    </section>
  );
}
