import { site } from "@/content/site";

/**
 * Page-aware WhatsApp link (CLAUDE.md §5). Messages are passed in already localized
 * (from next-intl) so this stays usable on server and client.
 */
export function whatsappUrl(message: string): string {
  return `https://wa.me/${site.whatsappNumber}?text=${encodeURIComponent(message)}`;
}
