"use client";

import { useTranslations } from "next-intl";
import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { Link } from "@/i18n/navigation";
import { track } from "@/lib/analytics";
import { buttonClasses } from "@/components/ui/Button";
import { Reassurance } from "@/components/booking/Reassurance";
import { RateChooser, useRateLabel, useRateSelection } from "./RateSelection";

/**
 * Checkout form (DEMO). Nothing typed here is sent or stored: the submit handler only checks the
 * fields and shows a demo confirmation. In the real flow the payment step holds the provider's
 * secure card fields (GuestyPay or Stripe), and the server books with Guesty using its token.
 * `data-clarity-mask` is belt and braces: analytics never loads on checkout anyway.
 */
export function CheckoutForm({ listingId }: { listingId: string }) {
  const t = useTranslations("checkout");
  const { selected } = useRateSelection();
  const rateLabel = useRateLabel();
  const total = selected.total;
  const [reference, setReference] = useState<string | null>(null);
  const confirmation = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (reference) confirmation.current?.focus();
  }, [reference]);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!event.currentTarget.reportValidity()) return;
    track("booking_completed", { listingId, total, mock: true });
    setReference(`DEMO-${Math.random().toString(36).slice(2, 8).toUpperCase()}`);
    window.scrollTo({ top: 0 });
  }

  if (reference) {
    return (
      <section aria-labelledby="confirmation-title" className="max-w-2xl">
        <DemoTag />
        <h2 id="confirmation-title" ref={confirmation} tabIndex={-1} className="text-h3 mt-4 outline-none">
          {t("confirmedTitle")}
        </h2>
        <p className="mt-4">{t("confirmedBody")}</p>
        <p className="text-small mt-6 text-granite">
          {t("reference")} <span className="font-semibold text-ink tabular-nums">{reference}</span>
        </p>
        <p className="mt-10">
          <Link href="/" className={buttonClasses("secondary", "md")}>
            {t("backHome")}
          </Link>
        </p>
      </section>
    );
  }

  return (
    <form onSubmit={onSubmit} data-clarity-mask="true" className="max-w-2xl space-y-12">
      <Step number={1} title={t("rateTitle")}>
        <RateChooser />
      </Step>

      <Step number={2} title={t("detailsTitle")}>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label={t("firstName")} name="firstName" autoComplete="given-name" required />
          <Field label={t("lastName")} name="lastName" autoComplete="family-name" required />
          <Field label={t("email")} name="email" type="email" autoComplete="email" required />
          <Field label={t("phone")} name="phone" type="tel" autoComplete="tel" required />
        </div>
        <label className="mt-4 block rounded-[var(--radius-tile)] border border-ink/20 px-4 py-3 focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-azulejo">
          <span className="block text-[0.75rem] leading-tight font-medium">
            {t("message")} <span className="font-normal text-granite">({t("optional")})</span>
          </span>
          <textarea name="message" rows={3} className="mt-1 block w-full resize-y bg-transparent outline-none" />
        </label>
      </Step>

      {/* Reassurance sits here, at the payment step, where guests leaving Airbnb need it most. */}
      <Step number={3} title={t("paymentTitle")}>
        <p className="text-small">{t("cardSecureNote")}</p>
        {/* Stand-in for the payment provider's secure card fields (GuestyPay or Stripe), which go
            exactly here in production. Read-only on purpose: a demo must never take a real card. */}
        <div className="mt-4 overflow-hidden rounded-[var(--radius-tile)] border border-ink/20">
          <CardField label={t("cardNumber")} placeholder="1234 1234 1234 1234" />
          <div className="grid grid-cols-2 border-t border-ink/20">
            <CardField label={t("cardExpiry")} placeholder={t("cardExpiryPlaceholder")} />
            <div className="border-l border-ink/20">
              <CardField label={t("cardCvc")} placeholder="123" />
            </div>
          </div>
        </div>
        <div className="mt-5 text-[0.8125rem]">
          <Reassurance cancellation={rateLabel(selected)} />
        </div>
      </Step>

      <Step number={4} title={t("confirmTitle")}>
        <div className="space-y-3">
          <Check name="terms" required>
            {t.rich("termsConsent", {
              terms: (chunks) => (
                <Link href="/terms" target="_blank" className="link-quiet underline">
                  {chunks}
                </Link>
              ),
              privacy: (chunks) => (
                <Link href="/privacy" target="_blank" className="link-quiet underline">
                  {chunks}
                </Link>
              ),
            })}
          </Check>
          <Check name="marketing">{t("marketingConsent")}</Check>
        </div>
        <button type="submit" className={buttonClasses("primary", "lg", "mt-8 w-full sm:w-auto")}>
          {t("submit")}
        </button>
        <p className="text-small mt-3 text-granite">{t("submitNote")}</p>
      </Step>
    </form>
  );
}

function DemoTag() {
  const t = useTranslations("common");
  return <span className="label bg-white px-1.5 py-0.5 text-azulejo">{t("demo")}</span>;
}

function Step({ number, title, children }: { number: number; title: string; children: ReactNode }) {
  return (
    <section aria-labelledby={`step-${number}`}>
      <h2 id={`step-${number}`} className="flex items-baseline gap-3 border-t-2 border-ink pt-4 card-title">
        <span className="tabular-nums text-granite">{String(number).padStart(2, "0")}</span>
        {title}
      </h2>
      <div className="mt-6">{children}</div>
    </section>
  );
}

function Field({
  label,
  name,
  type = "text",
  autoComplete,
  required,
}: {
  label: string;
  name: string;
  type?: string;
  autoComplete: string;
  required?: boolean;
}) {
  return (
    <label className="block rounded-[var(--radius-tile)] border border-ink/20 px-4 py-3 focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-azulejo">
      <span className="block text-[0.75rem] leading-tight font-medium">{label}</span>
      <input
        name={name}
        type={type}
        autoComplete={autoComplete}
        required={required}
        className="mt-1 block w-full bg-transparent outline-none"
      />
    </label>
  );
}

/** Read-only card field: shows the production layout without accepting a card number. */
function CardField({ label, placeholder }: { label: string; placeholder: string }) {
  return (
    <label className="block px-4 py-3">
      <span className="block text-[0.75rem] leading-tight font-medium">{label}</span>
      <input
        readOnly
        tabIndex={-1}
        autoComplete="off"
        placeholder={placeholder}
        className="mt-1 block w-full cursor-default bg-transparent tabular-nums outline-none placeholder:text-granite"
      />
    </label>
  );
}

function Check({ name, required, children }: { name: string; required?: boolean; children: ReactNode }) {
  return (
    <label className="flex items-start gap-3 text-small">
      <input type="checkbox" name={name} required={required} className="mt-0.5 size-4 shrink-0 accent-[var(--color-ink)]" />
      <span>{children}</span>
    </label>
  );
}
