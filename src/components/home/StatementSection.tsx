import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Icon } from "@/components/ui/Icon";

/** Never break the brand name at its hyphen. */
function keepBrandTogether(text: string) {
  const [before, after] = text.split("Tripas-Coração");
  if (after === undefined) return text;
  return (
    <>
      {before}
      <span className="whitespace-nowrap">Tripas-Coração</span>
      {after}
    </>
  );
}

/**
 * Numa-style statement on the signature colour: lines darken one by one as they scroll into
 * place (CSS scroll-driven; static and fully dark with reduced motion or without support).
 */
export async function StatementSection() {
  const t = await getTranslations("home");
  const lines = [t("statement1"), t("statement2"), t("statement3"), t("statement4")];

  return (
    <section aria-labelledby="statement-title" className="overflow-hidden bg-wash">
      <div className="container-page section-y grid gap-14 lg:grid-cols-12 lg:items-center">
        <div className="lg:col-span-7">
          <h2 id="statement-title" className="text-statement">
            {lines.map((line) => (
              <span key={line} className="scroll-ink block">
                {keepBrandTogether(line)}
              </span>
            ))}
          </h2>
          <p className="text-lead mt-10 max-w-xl text-ink-soft-text">{t("intro")}</p>
          <Link href="/about" className="text-lead mt-8 inline-flex items-center gap-2 font-semibold hover:text-azulejo">
            <Icon name="arrowUpRight" size={22} />
            {t("introLink")}
          </Link>
        </div>
        <div className="relative hidden h-[34rem] lg:col-span-5 lg:block" aria-hidden>
          <div className="reveal absolute top-0 right-0 aspect-[4/5] w-[62%] overflow-hidden rounded-[var(--radius-card)]">
            <Image
              src="/images/placeholder/breiner-skylight-06.jpg"
              alt=""
              fill
              sizes="22vw"
              className="object-cover"
            />
          </div>
          <div className="reveal absolute bottom-0 left-0 aspect-square w-[48%] overflow-hidden rounded-[var(--radius-card)]">
            <Image src="/images/placeholder/sao-bento-duplex-06.jpg" alt="" fill sizes="18vw" className="object-cover" />
          </div>
        </div>
      </div>
    </section>
  );
}
