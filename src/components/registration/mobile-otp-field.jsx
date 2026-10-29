"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "sonner";
import { BadgeCheck, LoaderCircle, Pencil, Phone, RefreshCw, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Field } from "./field";
import { OTP_LENGTH } from "@/lib/constants";
import { isValidPhone, normalizePhone } from "@/lib/validation";
import { postJSON } from "@/lib/utils";

/**
 * Mobile input + OTP flow.
 * `register` = react-hook-form register("mobile"), `getMobile` returns the current value.
 */
export function MobileOtpField({ register, getMobile, error, verified, onVerified, onReset, onError }) {
  const [phase, setPhase] = useState("idle"); // idle | sent
  const [otp, setOtp] = useState("");
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [otpError, setOtpError] = useState("");
  const [sentTo, setSentTo] = useState("");
  const otpRef = useRef(null);

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  async function sendOtp() {
    const mobile = normalizePhone(getMobile());
    if (!isValidPhone(mobile)) {
      onError("Enter a valid 10-digit Indian mobile number");
      return;
    }
    setSending(true);
    setOtpError("");
    const { ok, data } = await postJSON("/api/otp/send", { mobile });
    setSending(false);

    if (!ok) {
      if (data?.retryAfter) setCooldown(data.retryAfter);
      if (data?.field === "mobile") onError(data.message);
      else toast.error(data?.message || "Could not send OTP");
      return;
    }
    setSentTo(mobile);
    setPhase("sent");
    setOtp("");
    setCooldown(data.resendIn ?? 60);
    toast.success(`OTP sent to +91 ${mobile}`);
    if (data.devOtp) toast.info(`Dev mode OTP: ${data.devOtp}`, { duration: 15000 });
    setTimeout(() => otpRef.current?.focus(), 250);
  }

  async function verifyOtp(code = otp) {
    if (code.length !== OTP_LENGTH || verifying) return;
    setVerifying(true);
    setOtpError("");
    const { ok, data } = await postJSON("/api/otp/verify", { mobile: sentTo, otp: code });
    setVerifying(false);
    if (!ok) {
      setOtpError(data?.message || "Verification failed");
      setOtp("");
      return;
    }
    toast.success("Mobile number verified");
    setPhase("idle");
    onVerified(data.token, sentTo);
  }

  function change() {
    setPhase("idle");
    setOtp("");
    setOtpError("");
    onReset();
  }

  const mobileReg = register("mobile", {
    onChange: () => {
      if (phase === "sent") {
        setPhase("idle");
        setOtp("");
      }
    },
  });

  return (
    <div className="space-y-3">
      <Field
        label="Mobile Number"
        htmlFor="mobile"
        required
        error={error}
        hint={!verified && phase === "idle" ? "We'll send a 6-digit OTP to verify this number." : undefined}
        aside={
          verified && (
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-1 rounded-full bg-success/15 px-2 py-0.5 text-xs font-semibold text-success"
            >
              <BadgeCheck className="size-3.5" /> Verified
            </motion.span>
          )
        }
      >
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Phone className="pointer-events-none absolute top-1/2 left-3.5 size-[18px] -translate-y-1/2 text-muted-foreground" />
            <span className="pointer-events-none absolute top-1/2 left-10 -translate-y-1/2 text-[15px] text-muted-foreground">
              +91
            </span>
            <Input
              id="mobile"
              inputMode="numeric"
              autoComplete="tel-national"
              maxLength={10}
              placeholder="98765 43210"
              className="pl-[4.4rem] tracking-wide"
              readOnly={verified}
              aria-invalid={!!error}
              {...mobileReg}
              onInput={(e) => (e.currentTarget.value = e.currentTarget.value.replace(/\D/g, "").slice(0, 10))}
            />
          </div>
          {verified ? (
            <Button type="button" variant="outline" onClick={change} className="shrink-0">
              <Pencil /> Change
            </Button>
          ) : (
            <Button
              type="button"
              variant="accent"
              onClick={sendOtp}
              disabled={sending || (phase === "sent" && cooldown > 0)}
              className="w-[118px] shrink-0"
            >
              {sending ? (
                <LoaderCircle className="animate-spin" />
              ) : phase === "sent" ? (
                cooldown > 0 ? (
                  `Resend ${cooldown}s`
                ) : (
                  <>
                    <RefreshCw /> Resend
                  </>
                )
              ) : (
                <>
                  <ShieldCheck /> Send OTP
                </>
              )}
            </Button>
          )}
        </div>
      </Field>

      <AnimatePresence initial={false}>
        {phase === "sent" && !verified && (
          <motion.div
            key="otp"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 28 }}
            className="overflow-hidden"
          >
            <div className="rounded-xl border border-primary/30 bg-primary/5 p-4">
              <p className="mb-3 text-sm text-muted-foreground">
                Enter the OTP sent to <span className="font-semibold text-foreground">+91 {sentTo}</span>
              </p>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <motion.div
                  animate={otpError ? { x: [0, -8, 8, -6, 6, 0] } : { x: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <InputOTP
                    ref={otpRef}
                    maxLength={OTP_LENGTH}
                    value={otp}
                    onChange={(v) => {
                      setOtp(v.replace(/\D/g, ""));
                      setOtpError("");
                    }}
                    onComplete={verifyOtp}
                    inputMode="numeric"
                    pattern="^[0-9]+$"
                    autoComplete="one-time-code"
                    disabled={verifying}
                  >
                    <InputOTPGroup>
                      {Array.from({ length: OTP_LENGTH }, (_, i) => (
                        <InputOTPSlot key={i} index={i} aria-invalid={!!otpError} />
                      ))}
                    </InputOTPGroup>
                  </InputOTP>
                </motion.div>
                <Button
                  type="button"
                  onClick={() => verifyOtp()}
                  disabled={otp.length !== OTP_LENGTH || verifying}
                  className="sm:ml-auto"
                >
                  {verifying ? <LoaderCircle className="animate-spin" /> : <BadgeCheck />}
                  Verify
                </Button>
              </div>
              <AnimatePresence>
                {otpError && (
                  <motion.p
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="mt-2 text-[13px] font-medium text-destructive"
                  >
                    {otpError}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
