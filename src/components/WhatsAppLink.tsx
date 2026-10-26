"use client";

import clsx from "clsx";
import type { ReactNode } from "react";
import { track } from "@/lib/analytics";
import { whatsappUrl } from "@/lib/whatsapp";
import { Icon } from "./ui/Icon";

/**
 * WhatsApp as concierge (CLAUDE.md §5): styled like the rest of the UI, never a green bubble.
 * The prefilled message is localized and page-aware (passed in by the caller).
 * A custom `className` must include its own display utility (e.g. "inline-flex").
 */
export function WhatsAppLink({
  message,
  page,
  listingId,
  className,
  children,
  icon = true,
}: {
  message: string;
  page: string;
  listingId?: string;
  className?: string;
  children: ReactNode;
  icon?: boolean;
}) {
  return (
    <a
      href={whatsappUrl(message)}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => track("whatsapp_clicked", { page, listingId })}
      className={clsx("items-center gap-2.5", className ?? "inline-flex")}
      data-testid="whatsapp-link"
    >
      {icon ? <Icon name="whatsapp" size={20} className="shrink-0" /> : null}
      {children}
    </a>
  );
}
