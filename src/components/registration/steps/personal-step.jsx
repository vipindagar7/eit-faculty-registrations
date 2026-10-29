"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Controller, useWatch } from "react-hook-form";
import {
  BookUser,
  ClipboardList,
  Crown,
  GraduationCap,
  LoaderCircle,
  Mail,
  Phone,
  ShieldCheck,
  User,
  UserCog,
  Users,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupCard } from "@/components/ui/radio-group";
import { Field } from "../field";
import { MobileOtpField } from "../mobile-otp-field";
import { SectionTitle, item } from "../form-parts";
import { DESIGNATIONS } from "@/lib/constants";
import { cn } from "@/lib/utils";

const ICONS = {
  Principal: Crown,
  "Vice Principal": UserCog,
  HOD: Users,
  Coordinator: ClipboardList,
  Teacher: GraduationCap,
  Other: BookUser,
};

const digitsOnly = (e) => (e.currentTarget.value = e.currentTarget.value.replace(/\D/g, "").slice(0, 10));

export function PersonalStep({ form, err, verification, setVerification, dup }) {
  const { register, control, getValues, setError, clearErrors } = form;
  const designation = useWatch({ control, name: "designation" });

  return (
    <>
      <SectionTitle n="01" title="Faculty Personal & Contact Details" />

      <motion.div
        variants={item}
        className="flex items-start gap-2.5 rounded-xl border border-primary/25 bg-primary/5 px-4 py-3 text-[13px] leading-relaxed text-muted-foreground"
      >
        <ShieldCheck className="mt-0.5 size-4 shrink-0 text-primary" />
        <p>
          We collect only the details needed for this registration and school outreach. Read our{" "}
          <a href="/privacy-policy" target="_blank" className="font-medium text-primary underline-offset-2 hover:underline">
            Privacy Notice
          </a>{" "}
          to know how your data is used and your rights under the DPDP Act, 2023.
        </p>
      </motion.div>

      <motion.div variants={item}>
        <Field label="Full Name" htmlFor="fullName" required icon={User} error={err("fullName")}>
          <Input
            id="fullName"
            placeholder="e.g. Dr. Anjali Sharma"
            autoComplete="name"
            className="pl-10"
            aria-invalid={!!err("fullName")}
            {...register("fullName")}
          />
        </Field>
      </motion.div>

      <motion.div variants={item}>
        <Field label="Designation" required error={err("designation")}>
          <Controller
            control={control}
            name="designation"
            render={({ field }) => (
              <RadioGroup
                value={field.value}
                onValueChange={(v) => {
                  field.onChange(v);
                  clearErrors("designation");
                }}
                className="grid grid-cols-2 gap-2.5 sm:grid-cols-3"
                aria-label="Designation"
              >
                {DESIGNATIONS.map((d) => {
                  const Icon = ICONS[d];
                  const active = field.value === d;
                  return (
                    <RadioGroupCard
                      key={d}
                      value={d}
                      className={cn(
                        "flex cursor-pointer items-center gap-2.5 rounded-xl border px-3.5 py-3 text-left text-sm font-medium transition-all outline-none",
                        "focus-visible:ring-[3px] focus-visible:ring-ring/40",
                        active
                          ? "border-primary bg-primary/12 text-foreground shadow-[0_0_24px_-6px_var(--primary)]"
                          : "border-input bg-background/30 text-muted-foreground hover:border-primary/50 hover:text-foreground"
                      )}
                    >
                      <motion.span
                        animate={active ? { rotate: [0, -12, 10, 0], scale: 1.1 } : { scale: 1 }}
                        transition={{ duration: 0.45 }}
                      >
                        <Icon className={cn("size-[18px]", active && "text-primary")} />
                      </motion.span>
                      {d}
                    </RadioGroupCard>
                  );
                })}
              </RadioGroup>
            )}
          />
        </Field>
      </motion.div>

      <AnimatePresence initial={false}>
        {designation === "Other" && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden px-0.5 pb-0.5"
          >
            <Field label="Your Designation" htmlFor="designationOther" required icon={BookUser} error={err("designationOther")}>
              <Input
                id="designationOther"
                placeholder="e.g. Career Counsellor"
                className="pl-10"
                aria-invalid={!!err("designationOther")}
                {...register("designationOther")}
              />
            </Field>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div variants={item}>
        <MobileOtpField
          register={register}
          getMobile={() => getValues("mobile")}
          error={err("mobile")}
          verified={!!verification}
          onVerified={(token, mobile) => {
            setVerification({ token, mobile });
            clearErrors("mobile");
            dup.clear("mobile");
          }}
          onReset={() => {
            setVerification(null);
            dup.clear("mobile");
          }}
          onError={(message) => setError("mobile", { type: "manual", message })}
        />
      </motion.div>

      <motion.div variants={item}>
        <Field
          label="Official Email ID"
          htmlFor="email"
          required
          icon={Mail}
          error={err("email")}
          aside={dup.checking.email && <LoaderCircle className="size-4 animate-spin text-muted-foreground" />}
        >
          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="name@school.edu.in"
            className="pl-10"
            aria-invalid={!!err("email")}
            {...register("email", {
              onChange: () => dup.clear("email"),
              onBlur: (e) => dup.check("email", e.target.value.trim().toLowerCase()),
            })}
          />
        </Field>
      </motion.div>

      <motion.div variants={item}>
        <Field
          label={
            <>
              Alternative Contact Number <span className="font-normal text-muted-foreground">(optional)</span>
            </>
          }
          htmlFor="altContact"
          icon={Phone}
          error={err("altContact")}
          aside={dup.checking.altContact && <LoaderCircle className="size-4 animate-spin text-muted-foreground" />}
        >
          <span className="pointer-events-none absolute top-1/2 left-10 -translate-y-1/2 text-[15px] text-muted-foreground">
            +91
          </span>
          <Input
            id="altContact"
            inputMode="numeric"
            maxLength={10}
            placeholder="98765 43210"
            className="pl-[4.4rem] tracking-wide"
            aria-invalid={!!err("altContact")}
            {...register("altContact", {
              onChange: () => dup.clear("altContact"),
              onBlur: (e) => dup.check("altContact", e.target.value),
            })}
            onInput={digitsOnly}
          />
        </Field>
      </motion.div>
    </>
  );
}
