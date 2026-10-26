import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { buttonClasses } from "@/components/ui/Button";

/** Localized 404. During phased build-out it doubles as "coming soon" for unbuilt routes. */
export default async function NotFound() {
  const t = await getTranslations("notFound");
  return (
    <section className="container-page section-y min-h-[60vh]">
      <p className="label mb-6 text-granite">404</p>
      <h1 className="text-h1 max-w-3xl">{t("title")}</h1>
      <p className="text-lead mt-6 max-w-xl text-granite">{t("body")}</p>
      <div className="mt-10 flex flex-wrap items-center gap-6">
        <Link href="/apartments" className={buttonClasses("primary", "lg")}>
          {t("cta")}
        </Link>
        <Link href="/" className="link-quiet">
          {t("home")}
        </Link>
      </div>
    </section>
  );
}
