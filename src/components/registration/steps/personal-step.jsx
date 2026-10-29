"use client";

import { motion } from "framer-motion";
import { BookUser, LoaderCircle, Mail, Phone, ShieldCheck, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Field } from "../field";
import { MobileOtpField } from "../mobile-otp-field";
import { SectionTitle, item } from "../form-parts";

const digitsOnly = (e) => (e.currentTarget.value = e.currentTarget.value.replace(/\D/g, "").slice(0, 10));

export function PersonalStep({ form, err, verification, setVerification, dup }) {
  const { register, getValues, setError, clearErrors } = form;

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
        <Field label="Designation" htmlFor="designation" required icon={BookUser} error={err("designation")}>
          <Input
            id="designation"
            placeholder="e.g. Principal, PGT Physics, Career Counsellor"
            autoComplete="organization-title"
            className="pl-10"
            aria-invalid={!!err("designation")}
            {...register("designation")}
          />
        </Field>
      </motion.div>

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