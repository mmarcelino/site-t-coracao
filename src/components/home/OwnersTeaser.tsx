import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Icon } from "@/components/ui/Icon";

/** Owners teaser: full-bleed architecture photo, one strong line, one action. */
export async function OwnersTeaser() {
  const t = await getTranslations("home");
  return (
    <section aria-labelledby="owners-title" className="on-dark relative overflow-hidden bg-ink text-paper">
      {/* Original granite wall at Cordoaria: the "heritage asset" in one image. Decorative. */}
      <Image
        src="/images/placeholder/cordoaria-mezzanine-05.jpg"
        alt=""
        fill
        sizes="100vw"
        className="object-cover object-[70%_50%]"
      />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(27,26,24,0.88)_0%,rgba(27,26,24,0.7)_45%,rgba(27,26,24,0.15)_100%)]" />
      <div className="container-page section-y relative">
        <div className="reveal max-w-3xl">
          <p className="label mb-5 text-paper/80">{t("ownersEyebrow")}</p>
          <h2 id="owners-title" className="text-h1">
            {t("ownersTitle")}
          </h2>
          <p className="text-lead mt-8 max-w-xl text-paper/85">{t("ownersBody")}</p>
          <Link
            href="/property-management"
            className="text-lead mt-10 inline-flex items-center gap-3 border-b border-paper/40 pb-1 transition-colors hover:border-paper"
          >
            {t("ownersCta")}
            <Icon name="arrowRight" size={20} />
          </Link>
        </div>
      </div>
    </section>
  );
}
