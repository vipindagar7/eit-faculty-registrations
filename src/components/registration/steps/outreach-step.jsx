"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useWatch } from "react-hook-form";
import { Clock, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Field } from "../field";
import { ChoiceField, SectionTitle } from "../form-parts";
import { OUTREACH } from "@/lib/constants";

const QUESTIONS = [
  { name: "classes", label: "Classes from which students may seek guidance", type: "multiple", hint: "Select all that apply" },
  { name: "class12Strength", label: "Approximate number of Class XII students in the school" },
  { name: "streams", label: "Streams offered by the school", type: "multiple", hint: "Select all that apply" },
  { name: "careerGuidance", label: "Do you handle career guidance or higher-education counselling?" },
  { name: "guidanceSessions", label: "Would your school be interested in EIT career guidance sessions?" },
  { name: "programmeInfo", label: "Would you like information about EIT programmes and admissions?" },
  { name: "schoolVisit", label: "Would you be interested in organising a school visit to EIT?" },
  { name: "activities", label: "Preferred activities for your students", type: "multiple", hint: "Select all that apply" },
  { name: "commModes", label: "Preferred mode of future communication", type: "multiple", hint: "Select all that apply" },
  { name: "contactTime", label: "Best time to contact you" },
];

function OtherInput({ show, name, label, placeholder, form, err, icon }) {
  return (
    <AnimatePresence initial={false}>
      {show && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="-mt-2 overflow-hidden px-0.5 pb-0.5"
        >
          <Field label={label} htmlFor={name} required icon={icon} error={err(name)}>
            <Input
              id={name}
              placeholder={placeholder}
              className="pl-10"
              aria-invalid={!!err(name)}
              {...form.register(name)}
            />
          </Field>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function OutreachStep({ form, err }) {
  const { control, clearErrors } = form;
  const [streams, contactTime] = useWatch({ control, name: ["streams", "contactTime"] });

  return (
    <>
      <SectionTitle
        n="03"
        title="Student Outreach & Admission Potential"
        subtitle="Helps us plan guidance sessions and activities for your students."
      />
      {QUESTIONS.map((q) => (
        <div key={q.name} className="space-y-5">
          <ChoiceField
            control={control}
            name={q.name}
            label={q.label}
            type={q.type}
            hint={q.hint}
            options={OUTREACH[q.name]}
            error={err(q.name)}
            onValueChange={() => clearErrors(q.name)}
          />
          {q.name === "streams" && (
            <OtherInput
              show={streams?.includes("Other")}
              name="streamsOther"
              label="Other stream(s)"
              placeholder="e.g. Vocational, Fine Arts"
              icon={Sparkles}
              form={form}
              err={err}
            />
          )}
          {q.name === "contactTime" && (
            <OtherInput
              show={contactTime === "Other"}
              name="contactTimeOther"
              label="Preferred time"
              placeholder="e.g. After 4 PM on weekdays"
              icon={Clock}
              form={form}
              err={err}
            />
          )}
        </div>
      ))}
    </>
  );
}
