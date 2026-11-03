import { useTranslations } from "next-intl";
import { site } from "@/content/site";
import { Icon } from "@/components/ui/Icon";
import { WhatsAppLink } from "@/components/WhatsAppLink";

const link = "transition-colors hover:text-pop";

/**
 * The contact column shared by the footer and the full-screen menu: address, phone, email and
 * WhatsApp on one line grid (fixed row height, no extra gaps), so rows align with the columns beside it.
 */
export function ContactDetails({ page }: { page: string }) {
  const t = useTranslations();
  return (
    <address className="not-italic">
      <ul className="text-small leading-9">
        {/* One block, set tight, but still two rows tall (pt + 24px lines + pb = 72px) so the
            lines below stay on the shared grid. */}
        <li className="pt-1.5 pb-4.5 leading-6">
          {site.address.street}
          <br />
          {site.address.postalCode} {site.address.city}, {site.address.country}
        </li>
        <li>
          <a href={site.phoneHref} className={link}>
            {site.phone}
          </a>
        </li>
        <li>
          <a href={`mailto:${site.email}`} className={link}>
            {site.email}
          </a>
        </li>
        {/* Flex row of the grid's height: an inline-flex link would make the line box taller. */}
        <li className="flex h-9 items-center">
          <WhatsAppLink
            message={t("whatsapp.messageGeneric")}
            page={page}
            icon={false}
            className={`inline-flex items-center gap-2.5 ${link}`}
          >
            <Icon name="whatsapp" size={18} strokeWidth={1.25} />
            {t("whatsapp.short")}
          </WhatsAppLink>
        </li>
      </ul>
    </address>
  );
}

/** Instagram and Facebook as bare icons, for the bottom rows of the footer and the menu. */
export function SocialLinks() {
  const t = useTranslations("footer");
  const icon = "grid h-9 w-6.5 place-items-center transition-colors hover:text-pop";
  return (
    <ul aria-label={t("social")} className="-mx-0.75 flex text-paper">
      <li>
        <a href={site.social.instagram} target="_blank" rel="noopener noreferrer" className={icon}>
          <Icon name="instagram" size={20} strokeWidth={1.25} title="Instagram" />
        </a>
      </li>
      <li>
        <a href={site.social.facebook} target="_blank" rel="noopener noreferrer" className={icon}>
          <Icon name="facebook" size={20} strokeWidth={1.25} title="Facebook" />
        </a>
      </li>
    </ul>
  );
}
