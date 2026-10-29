"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Controller, useWatch } from "react-hook-form";
import { AtSign, BookOpen, Building2, Crown, Map, MapPin, PhoneCall, School } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Field } from "../field";
import { ChoiceField, SectionTitle, item } from "../form-parts";
import { BOARDS, SCHOOL_CATEGORIES, STATES } from "@/lib/constants";

export function SchoolStep({ form, err }) {
  const { register, control, clearErrors } = form;
  const [board, state] = useWatch({ control, name: ["board", "state"] });
  const stateInfo = STATES.find((s) => s.value === state);

  return (
    <>
      <SectionTitle n="02" title="School / Institution Details" />

      <motion.div variants={item}>
        <Field label="Name of School / Institution" htmlFor="schoolName" required icon={School} error={err("schoolName")}>
          <Input
            id="schoolName"
            placeholder="e.g. Delhi Public School, Sector 19"
            autoComplete="organization"
            className="pl-10"
            aria-invalid={!!err("schoolName")}
            {...register("schoolName")}
          />
        </Field>
      </motion.div>

      <motion.div variants={item}>
        <Field label="School Address" htmlFor="schoolAddress" required error={err("schoolAddress")}>
          <MapPin className="pointer-events-none absolute top-3 left-3.5 size-[18px] text-muted-foreground" />
          <Textarea
            id="schoolAddress"
            rows={2}
            placeholder="Street / sector, locality, PIN code"
            autoComplete="street-address"
            className="min-h-20 pl-10"
            aria-invalid={!!err("schoolAddress")}
            {...register("schoolAddress")}
          />
        </Field>
      </motion.div>

      <motion.div variants={item} className="grid gap-5 sm:grid-cols-2">
        <Field label="City / District" htmlFor="city" required icon={Building2} error={err("city")}>
          <Input
            id="city"
            placeholder="e.g. Faridabad"
            autoComplete="address-level2"
            className="pl-10"
            aria-invalid={!!err("city")}
            {...register("city")}
          />
        </Field>

        <Field label="State / UT" required icon={Map} error={err("state")}>
          <Controller
            control={control}
            name="state"
            render={({ field }) => (
              <Select
                value={field.value}
                onValueChange={(v) => {
                  field.onChange(v);
                  clearErrors("state");
                }}
              >
                <SelectTrigger id="state" className="pl-10" aria-invalid={!!err("state")}>
                  <SelectValue placeholder="Select state / UT" />
                </SelectTrigger>
                <SelectContent className="max-h-72">
                  <SelectGroup>
                    <SelectLabel>States</SelectLabel>
                    {STATES.filter((s) => !s.ut).map((s) => (
                      <SelectItem key={s.value} value={s.value}>
                        {s.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                  <SelectGroup>
                    <SelectLabel>Union Territories</SelectLabel>
                    {STATES.filter((s) => s.ut).map((s) => (
                      <SelectItem key={s.value} value={s.value}>
                        {s.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}
          />
        </Field>
      </motion.div>

      <motion.div variants={item}>
        <Field
          label="School Board"
          required
          icon={BookOpen}
          error={err("board")}
          hint={
            board === "STATE"
              ? stateInfo
                ? `State board for ${stateInfo.name}: ${stateInfo.board}`
                : "Select the state above to pick its board automatically"
              : undefined
          }
        >
          <Controller
            control={control}
            name="board"
            render={({ field }) => (
              <Select
                value={field.value}
                onValueChange={(v) => {
                  field.onChange(v);
                  clearErrors(["board", "otherBoard"]);
                }}
              >
                <SelectTrigger id="board" className="pl-10" aria-invalid={!!err("board")}>
                  <SelectValue placeholder="Select board" />
                </SelectTrigger>
                <SelectContent>
                  {BOARDS.map((b) => (
                    <SelectItem key={b.value} value={b.value}>
                      {b.value === "STATE" && stateInfo ? `State Board – ${stateInfo.board}` : b.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </Field>
      </motion.div>

      <AnimatePresence initial={false}>
        {board === "OTHER" && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden px-0.5 pb-0.5"
          >
            <Field label="Board Name" htmlFor="otherBoard" required icon={BookOpen} error={err("otherBoard")}>
              <Input
                id="otherBoard"
                placeholder="Enter the board name"
                className="pl-10"
                aria-invalid={!!err("otherBoard")}
                {...register("otherBoard")}
              />
            </Field>
          </motion.div>
        )}
      </AnimatePresence>

      <ChoiceField
        control={control}
        name="schoolCategory"
        label="School Category"
        options={SCHOOL_CATEGORIES}
        error={err("schoolCategory")}
        onValueChange={() => clearErrors("schoolCategory")}
      />

      <motion.div variants={item} className="grid gap-5 sm:grid-cols-2">
        <Field label="School Official Email ID" htmlFor="schoolEmail" required icon={AtSign} error={err("schoolEmail")}>
          <Input
            id="schoolEmail"
            type="email"
            placeholder="info@school.edu.in"
            className="pl-10"
            aria-invalid={!!err("schoolEmail")}
            {...register("schoolEmail")}
          />
        </Field>
        <Field label="School Contact Number" htmlFor="schoolContact" required icon={PhoneCall} error={err("schoolContact")}>
          <Input
            id="schoolContact"
            inputMode="tel"
            maxLength={16}
            placeholder="0129-2xxxxxx or mobile"
            className="pl-10"
            aria-invalid={!!err("schoolContact")}
            {...register("schoolContact")}
          />
        </Field>
      </motion.div>

      <motion.div variants={item} className="grid gap-5 sm:grid-cols-2">
        <Field
          label="Principal / Head of Institution"
          htmlFor="principalName"
          required
          icon={Crown}
          error={err("principalName")}
        >
          <Input
            id="principalName"
            placeholder="e.g. Mr. R. K. Gupta"
            className="pl-10"
            aria-invalid={!!err("principalName")}
            {...register("principalName")}
          />
        </Field>
        <Field
          label="Principal's Email / Contact"
          htmlFor="principalContact"
          required
          icon={AtSign}
          error={err("principalContact")}
        >
          <Input
            id="principalContact"
            placeholder="Email or phone number"
            className="pl-10"
            aria-invalid={!!err("principalContact")}
            {...register("principalContact")}
          />
        </Field>
      </motion.div>
    </>
  );
}
