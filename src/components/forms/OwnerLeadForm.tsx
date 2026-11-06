"use client";

import { useTranslations } from "next-intl";
import { track } from "@/lib/analytics";
import { Choices, Field, PreviewForm, TextArea } from "./Fields";

/** Owners page lead form, UI only for now (the current site only has an email link). */
export function OwnerLeadForm() {
  const t = useTranslations("ownersPage");
  const tf = useTranslations("forms");
  return (
    <PreviewForm submitLabel={t("submit")} onSent={() => track("owner_lead_submitted", {})}>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label={tf("name")} name="name" autoComplete="name" required />
        <Field label={tf("email")} name="email" type="email" autoComplete="email" required />
        <Field label={tf("phone")} name="phone" type="tel" autoComplete="tel" />
        <Field label={t("type")} name="type" placeholder={t("typePlaceholder")} />
      </div>
      <Field label={t("location")} name="location" placeholder={t("locationPlaceholder")} required />
      <Choices
        legend={t("status")}
        name="status"
        required
        options={[
          { value: "operating", label: t("operating") },
          { value: "starting", label: t("starting") },
        ]}
      />
      <TextArea label={t("message")} name="message" />
    </PreviewForm>
  );
}
