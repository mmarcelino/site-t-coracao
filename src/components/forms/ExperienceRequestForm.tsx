"use client";

import { useTranslations } from "next-intl";
import { track } from "@/lib/analytics";
import { Choices, Field, PreviewForm, TextArea } from "./Fields";

/** "Help me plan" (experiences page): the current site's fields, UI only for now. */
export function ExperienceRequestForm({ experiences }: { experiences: Array<{ value: string; label: string }> }) {
  const t = useTranslations("experiencesPage");
  const tf = useTranslations("forms");
  return (
    <PreviewForm
      submitLabel={t("submit")}
      onSent={(data) => track("experience_request_submitted", { experiences: data.getAll("experiences").length })}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label={t("nameOnBooking")} name="name" autoComplete="name" required />
        <Field label={tf("email")} name="email" type="email" autoComplete="email" required />
        <Field label={t("guests")} name="guests" type="number" min={1} required />
        <div className="grid grid-cols-2 gap-4">
          <Field label={t("arrival")} name="arrival" type="date" required />
          <Field label={t("departure")} name="departure" type="date" required />
        </div>
      </div>
      <Choices legend={t("interests")} name="experiences" options={experiences} multiple />
      <Choices
        legend={t("format")}
        name="format"
        options={[
          { value: "private", label: t("private") },
          { value: "shared", label: t("shared") },
          { value: "not-sure", label: t("notSure") },
        ]}
      />
      <TextArea label={t("message")} name="message" />
    </PreviewForm>
  );
}
