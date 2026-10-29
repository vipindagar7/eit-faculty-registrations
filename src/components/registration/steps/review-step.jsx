"use client";

import { motion } from "framer-motion";
import { Controller, useWatch } from "react-hook-form";
import { Pencil, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { SectionTitle, item } from "../form-parts";
import { boardLabel, listLabel } from "@/lib/constants";
import { normalizePhone } from "@/lib/validation";
import { SITE } from "@/lib/site-config";
import { cn } from "@/lib/utils";

export function reviewSections(v) {
  return [
    {
      step: 0,
      title: "Personal & Contact",
      rows: [
        ["Full Name", v.fullName],
        ["Designation", v.designation],
        ["Mobile", v.mobile ? `+91 ${normalizePhone(v.mobile)}` : "", true],
        ["Official Email", v.email?.trim().toLowerCase()],
        ["Alternative No.", v.altContact ? `+91 ${normalizePhone(v.altContact)}` : "—"],
      ],
    },
    {
      step: 1,
      title: "School / Institution",
      rows: [
        ["School", v.schoolName],
        ["Address", v.schoolAddress],
        ["Board", boardLabel(v)],
        ["Category", v.schoolCategory],
        ["School Email", v.schoolEmail],
        ["School Contact", v.schoolContact],
        ["Principal / Head", v.principalName],
        ["Principal Contact", v.principalContact],
      ],
    },
    {
      step: 2,
      title: "Student Outreach",
      rows: [
        ["Guidance stage", v.guidanceStage],
        ["Class XII enrolment", v.class12Strength],
        ["Streams", listLabel(v.streams, v.streamsOther)],
        ["Career guidance", v.careerGuidance],
        ["EIT guidance sessions", v.guidanceSessions],
        ["Programme info", v.programmeInfo],
        ["School visit to EIT", v.schoolVisit],
        ["Activities", listLabel(v.activities)],
        ["Communication", listLabel(v.commModes)],
        ["Best time", v.contactTime === "Other" ? v.contactTimeOther : v.contactTime],
      ],
    },
  ];
}

function ConsentBox({ control, name, error, children, optional }) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <label
          className={cn(
            "flex cursor-pointer items-start gap-3 rounded-xl border p-4 text-sm leading-relaxed transition-colors",
            error ? "border-destructive/70 bg-destructive/5" : "border-border bg-background/30",
            field.value && "border-primary/50 bg-primary/5"
          )}
        >
          <Checkbox
            className="mt-0.5"
            checked={!!field.value}
            onCheckedChange={(v) => field.onChange(v === true)}
            aria-invalid={!!error}
          />
          <span>
            {children}
            {optional && <span className="ml-1 text-xs text-muted-foreground">(optional)</span>}
            {error && <span className="mt-1 block text-[13px] font-medium text-destructive">{error}</span>}
          </span>
        </label>
      )}
    />
  );
}

export function ReviewStep({ form, err, goTo }) {
  const values = useWatch({ control: form.control });

  return (
    <>
      <SectionTitle n="04" title="Review & Consent" subtitle="Check your details before submitting." />

      {reviewSections(values).map((s) => (
        <motion.div key={s.title} variants={item} className="rounded-xl border border-border bg-background/30">
          <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
            <span className="text-sm font-semibold">{s.title}</span>
            <Button type="button" variant="ghost" size="sm" onClick={() => goTo(s.step)}>
              <Pencil /> Edit
            </Button>
          </div>
          <dl className="divide-y divide-border/60 text-sm">
            {s.rows.map(([k, v, verified]) => (
              <div key={k} className="flex gap-4 px-4 py-2.5">
                <dt className="w-36 shrink-0 text-muted-foreground">{k}</dt>
                <dd className="flex min-w-0 items-center gap-2 font-medium break-words">
                  {v || "—"}
                  {verified && <ShieldCheck className="size-4 shrink-0 text-success" aria-label="Verified" />}
                </dd>
              </div>
            ))}
          </dl>
        </motion.div>
      ))}

      <motion.div variants={item} className="space-y-3">
        <p className="text-sm font-semibold">Consent (Digital Personal Data Protection Act, 2023)</p>

        <ConsentBox control={form.control} name="consentProcessing" error={err("consentProcessing")}>
          I have read the{" "}
          <a href="/privacy-policy" target="_blank" className="font-medium text-primary hover:underline">
            Privacy Notice
          </a>{" "}
          and give my consent to {SITE.institute} to process the personal data listed above for my registration
          and participation in the {SITE.shortName} school outreach programme, including the Brainstorm &amp; Science
          Exhibition. <span className="text-accent">*</span>
        </ConsentBox>

        <ConsentBox control={form.control} name="consentAccuracy" error={err("consentAccuracy")}>
          I confirm the details are true and correct, and I am authorised to share the school&apos;s and
          Principal&apos;s official contact details for this purpose. <span className="text-accent">*</span>
        </ConsentBox>

        <ConsentBox control={form.control} name="consentMarketing" optional>
          I would like to receive updates about EIT programmes, admissions and events through my selected
          communication modes. I can withdraw this anytime.
        </ConsentBox>

        <p className="text-xs leading-relaxed text-muted-foreground">
          You can withdraw consent or ask us to correct or delete your data anytime by writing to{" "}
          <a href={`mailto:${SITE.privacy.contactEmail}`} className="text-primary hover:underline">
            {SITE.privacy.contactEmail}
          </a>
          . See our{" "}
          <a href="/cookie-policy" target="_blank" className="text-primary hover:underline">
            Cookie Policy
          </a>
          .
        </p>
      </motion.div>
    </>
  );
}