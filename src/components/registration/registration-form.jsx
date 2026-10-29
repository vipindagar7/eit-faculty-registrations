"use client";

import { useCallback, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "sonner";
import { ArrowLeft, ArrowRight, GraduationCap, LoaderCircle, School, Send, ShieldCheck, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import { StepIndicator } from "./step-indicator";
import { SuccessCard } from "./success-card";
import { PersonalStep } from "./steps/personal-step";
import { SchoolStep } from "./steps/school-step";
import { OutreachStep } from "./steps/outreach-step";
import { ReviewStep } from "./steps/review-step";
import { isValidEmail, isValidPhone, normalizePhone, stepSchemas } from "@/lib/validation";
import { postJSON } from "@/lib/utils";

const STEPS = [
  { label: "Personal", icon: User },
  { label: "School", icon: School },
  { label: "Outreach", icon: GraduationCap },
  { label: "Review", icon: ShieldCheck },
];

const STEP_FIELDS = [
  ["fullName", "designation", "mobile", "email", "altContact"],
  ["schoolName", "schoolAddress", "board", "otherBoard", "schoolCategory", "schoolEmail", "schoolContact", "principalName", "principalContact"],
  ["classes", "class12Strength", "streams", "streamsOther", "careerGuidance", "guidanceSessions", "programmeInfo", "schoolVisit", "activities", "commModes", "contactTime", "contactTimeOther"],
  ["consentProcessing", "consentAccuracy", "consentMarketing"],
];
const stepOf = (field) => STEP_FIELDS.findIndex((f) => f.includes(field));

const defaultValues = {
  fullName: "",
  designation: "",
  mobile: "",
  email: "",
  altContact: "",
  schoolName: "",
  schoolAddress: "",
  board: "",
  otherBoard: "",
  schoolCategory: "",
  schoolEmail: "",
  schoolContact: "",
  principalName: "",
  principalContact: "",
  classes: [],
  class12Strength: "",
  streams: [],
  streamsOther: "",
  careerGuidance: "",
  guidanceSessions: "",
  programmeInfo: "",
  schoolVisit: "",
  activities: [],
  commModes: [],
  contactTime: "",
  contactTimeOther: "",
  consentProcessing: false,
  consentAccuracy: false,
  consentMarketing: false,
};

const slide = {
  enter: (d) => ({ x: d > 0 ? 56 : -56, opacity: 0, filter: "blur(6px)" }),
  center: {
    x: 0,
    opacity: 1,
    filter: "blur(0px)",
    transition: { type: "spring", stiffness: 260, damping: 30, staggerChildren: 0.04 },
  },
  exit: (d) => ({ x: d > 0 ? -56 : 56, opacity: 0, filter: "blur(6px)", transition: { duration: 0.18 } }),
};

export function RegistrationForm() {
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [verification, setVerification] = useState(null); // { token, mobile }
  const [dupErrors, setDupErrors] = useState({});
  const [checking, setChecking] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const stepRef = useRef(0);
  const topRef = useRef(null);

  // Validate only the current step's fields (full schema on the review step).
  const resolver = useCallback(
    (values, ctx, options) => zodResolver(stepSchemas[stepRef.current])(values, ctx, options),
    []
  );

  const form = useForm({ resolver, defaultValues, mode: "onTouched" });
  const { handleSubmit, trigger, getValues, setValue, setError, clearErrors, reset, formState } = form;
  const { errors } = formState;

  const goTo = useCallback(
    (next) => {
      setDirection(next > stepRef.current ? 1 : -1);
      stepRef.current = next;
      setStep(next);
      // Drop errors produced by validating against the previous step's schema.
      requestAnimationFrame(() => {
        clearErrors();
        topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    },
    [clearErrors]
  );

  /** Uniqueness check for email / alternative number. Returns true if available. */
  async function checkAvailability(field, value) {
    const isPhone = field === "altContact";
    if (isPhone ? !isValidPhone(value) : !isValidEmail(value)) return true;
    setChecking((c) => ({ ...c, [field]: true }));
    const { ok, data } = await postJSON("/api/check-duplicate", {
      field: isPhone ? "phone" : "email",
      value: isPhone ? normalizePhone(value) : value,
    });
    setChecking((c) => ({ ...c, [field]: false }));
    const available = !ok || data.available !== false;
    setDupErrors((d) => ({
      ...d,
      [field]: available ? undefined : `This ${isPhone ? "number" : "email"} is already registered`,
    }));
    return available;
  }

  const dup = {
    checking,
    check: checkAvailability,
    clear: (field) => setDupErrors((d) => (d[field] ? { ...d, [field]: undefined } : d)),
  };

  async function next() {
    const valid = await trigger();
    if (step === 0) {
      if (!verification || verification.mobile !== normalizePhone(getValues("mobile"))) {
        setError("mobile", { type: "manual", message: "Please verify your mobile number with OTP" });
        return;
      }
      if (!valid) return;
      const v = getValues();
      const checks = await Promise.all([
        checkAvailability("email", v.email.trim().toLowerCase()),
        v.altContact ? checkAvailability("altContact", v.altContact) : true,
      ]);
      if (checks.includes(false)) return;

      // Principal registering? Pre-fill the principal fields.
      if (/principal|head of (the )?(school|institution)/i.test(v.designation) && !/vice/i.test(v.designation)) {
        if (!v.principalName) setValue("principalName", v.fullName.trim());
        if (!v.principalContact) setValue("principalContact", v.email.trim().toLowerCase());
      }
    }
    if (!valid) {
      toast.error("Please complete the highlighted fields");
      return;
    }
    goTo(step + 1);
  }

  async function onSubmit(values) {
    if (!verification) {
      goTo(0);
      return;
    }
    setSubmitting(true);
    const { ok, data } = await postJSON("/api/register", { data: values, verificationToken: verification.token });
    setSubmitting(false);

    if (!ok) {
      toast.error(data?.message || "Registration failed");
      if (data?.reverify) setVerification(null);
      const field = data?.field;
      const target = stepOf(field);
      if (target >= 0) {
        goTo(target);
        if (["email", "altContact", "mobile"].includes(field)) setDupErrors((d) => ({ ...d, [field]: data.message }));
        else requestAnimationFrame(() => requestAnimationFrame(() => setError(field, { type: "server", message: data.message })));
      }
      return;
    }
    setResult(data.registration);
  }

  function resetAll() {
    reset(defaultValues);
    setVerification(null);
    setDupErrors({});
    setResult(null);
    stepRef.current = 0;
    setStep(0);
  }

  const err = (name) => errors[name]?.message || dupErrors[name];
  const stepProps = { form, err };

  return (
    <div ref={topRef} className="glass scroll-mt-6 rounded-2xl p-5 sm:p-8">
      <AnimatePresence mode="wait">
        {result ? (
          <motion.div key="done" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}>
            <SuccessCard registration={result} onReset={resetAll} />
          </motion.div>
        ) : (
          <motion.div key="form" exit={{ opacity: 0, scale: 0.97 }}>
            <header className="mb-7 space-y-6">
              <div>
                <h2 className="font-display text-2xl font-bold sm:text-[1.7rem]">Registration Form</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Step {step + 1} of {STEPS.length} · Fields marked <span className="text-accent">*</span> are required
                </p>
              </div>
              <StepIndicator steps={STEPS} current={step} />
            </header>

            <form onSubmit={(e) => handleSubmit(onSubmit)(e)} noValidate>
              <AnimatePresence mode="wait" custom={direction} initial={false}>
                <motion.div
                  key={step}
                  custom={direction}
                  variants={slide}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  className="space-y-5"
                >
                  {step === 0 && (
                    <PersonalStep {...stepProps} verification={verification} setVerification={setVerification} dup={dup} />
                  )}
                  {step === 1 && <SchoolStep {...stepProps} />}
                  {step === 2 && <OutreachStep {...stepProps} />}
                  {step === 3 && <ReviewStep {...stepProps} goTo={goTo} />}
                </motion.div>
              </AnimatePresence>

              <div className="mt-8 flex items-center justify-between gap-3 border-t border-border pt-6">
                {step > 0 ? (
                  <Button type="button" variant="ghost" onClick={() => goTo(step - 1)} disabled={submitting}>
                    <ArrowLeft /> Back
                  </Button>
                ) : (
                  <span />
                )}
                {step < STEPS.length - 1 ? (
                  <Button type="button" size="lg" onClick={next} className="group">
                    Continue
                    <ArrowRight className="transition-transform group-hover:translate-x-1" />
                  </Button>
                ) : (
                  <Button type="submit" size="lg" variant="accent" disabled={submitting} className="min-w-44">
                    {submitting ? <LoaderCircle className="animate-spin" /> : <Send />}
                    {submitting ? "Submitting…" : "Submit Registration"}
                  </Button>
                )}
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}