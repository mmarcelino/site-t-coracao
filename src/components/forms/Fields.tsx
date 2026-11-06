"use client";

import { useTranslations } from "next-intl";
import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { buttonClasses } from "@/components/ui/Button";

/**
 * Form pieces shared by the request forms (experiences, owners): the checkout's field style, a
 * labelled box with the label inside. Forms are UI only for now (CLAUDE.md §2): submitting checks
 * the fields and shows a preview notice; nothing is sent.
 */
const box =
  "block rounded-[var(--radius-tile)] border border-ink/20 px-4 py-3 focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-azulejo";

function Label({ label, optional }: { label: string; optional?: boolean }) {
  const t = useTranslations("forms");
  return (
    <span className="block text-[0.75rem] leading-tight font-medium">
      {label}
      {optional ? <span className="font-normal text-granite"> ({t("optional")})</span> : null}
    </span>
  );
}

export function Field({
  label,
  name,
  type = "text",
  autoComplete,
  placeholder,
  required,
  min,
}: {
  label: string;
  name: string;
  type?: string;
  autoComplete?: string;
  placeholder?: string;
  required?: boolean;
  min?: number;
}) {
  return (
    <label className={box}>
      <Label label={label} optional={!required} />
      <input
        name={name}
        type={type}
        autoComplete={autoComplete ?? "off"}
        placeholder={placeholder}
        required={required}
        min={min}
        className="mt-1 block w-full bg-transparent outline-none placeholder:text-granite"
      />
    </label>
  );
}

export function TextArea({ label, name }: { label: string; name: string }) {
  return (
    <label className={box}>
      <Label label={label} optional />
      <textarea name={name} rows={4} className="mt-1 block w-full resize-y bg-transparent outline-none" />
    </label>
  );
}

/** Checkboxes (`multiple`) or radios as pill toggles under a legend. */
export function Choices({
  legend,
  name,
  options,
  multiple,
  required,
}: {
  legend: string;
  name: string;
  options: Array<{ value: string; label: string }>;
  multiple?: boolean;
  required?: boolean;
}) {
  return (
    <fieldset>
      <legend className="text-[0.75rem] leading-tight font-medium">{legend}</legend>
      <div className="mt-3 flex flex-wrap gap-2">
        {options.map((o) => (
          <label key={o.value} className="cursor-pointer">
            <input
              type={multiple ? "checkbox" : "radio"}
              name={name}
              value={o.value}
              required={required && !multiple}
              className="peer sr-only"
            />
            <span className="inline-flex h-10 items-center rounded-full border border-ink/20 px-4 text-[0.9375rem] transition-colors duration-[var(--duration-fast)] peer-checked:border-ink peer-checked:bg-ink peer-checked:text-paper peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-azulejo hover:border-ink">
              {o.label}
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

/**
 * A preview form: validates, calls `onSent` (analytics), then swaps itself for a clearly marked
 * notice. `data-clarity-mask` keeps what people type out of session recordings (CLAUDE.md §11).
 */
export function PreviewForm({
  onSent,
  submitLabel,
  children,
}: {
  onSent: (data: FormData) => void;
  submitLabel: string;
  children: ReactNode;
}) {
  const t = useTranslations("forms");
  const tc = useTranslations("common");
  const [sent, setSent] = useState(false);
  const notice = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (sent) notice.current?.focus();
  }, [sent]);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!event.currentTarget.reportValidity()) return;
    onSent(new FormData(event.currentTarget));
    setSent(true);
  }

  if (sent) {
    return (
      <div role="status" className="border-t-2 border-ink pt-6">
        <span className="label bg-white px-1.5 py-0.5 text-azulejo">{tc("demo")}</span>
        <h3 ref={notice} tabIndex={-1} className="card-title mt-4 outline-none">
          {t("sent")}
        </h3>
        <p className="mt-3 max-w-xl">{t("sentBody")}</p>
        <button type="button" onClick={() => setSent(false)} className="link-quiet mt-6 font-semibold underline underline-offset-4">
          {t("again")}
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} data-clarity-mask="true" className="space-y-6">
      {children}
      <div className="pt-2">
        <button type="submit" className={buttonClasses("primary", "lg")}>
          {submitLabel}
        </button>
        <p className="text-small mt-3 text-granite">{t("previewNote")}</p>
      </div>
    </form>
  );
}
