# Faculty Registration – Brainstorm & Science Exhibition

Next.js 16 (JavaScript) · shadcn/ui + Radix UI · GSAP + Framer Motion · MongoDB · Google Sheets · OTP

## Setup

```bash
npm install
cp .env.example .env.local   # fill in values
npm run dev
```

OTP is sent via the Saakshi Software SMS gateway (`SMS_PROVIDER="saakshi"`, set `SMS_USER`, `SMS_PASS`, `SENDER_ID`).
For local testing without SMS, use `SMS_PROVIDER="console"` — the OTP is printed in the terminal and shown as a toast.

## Flow

1. **Personal & Contact** – name, designation, mobile (+ OTP), official email, alternative number (optional)
2. **School / Institution** – name, address, city, state/UT, board, category, school email & phone, Principal name & contact
3. **Student Outreach** – classes, Class XII strength, streams, guidance/visit interest, activities, communication mode & time
4. **Review & Consent** – DPDP consent (required), accuracy declaration (required), marketing consent (optional)

Pages: `/` form · `/privacy-policy` Privacy Policy · `/cookie-policy` Cookie Policy.
Institute contact details and the privacy contact email live in `src/lib/site-config.js`.

## Uniqueness

- MongoDB unique indexes on `email`, `mobile` and `phones` (`[mobile, altContact]`),
  so a number can't be reused as mobile in one entry and alternative number in another.
- Live checks on blur + pre-check before insert + duplicate-key handling for race conditions.
- OTP can't be requested for an already-registered number.

## OTP security

HMAC-hashed OTP, 5-min expiry (TTL index), max 5 wrong attempts, 60 s resend cooldown,
5 sends/hour per number, 20/hour per IP. On success a signed token (30 min) is required by `/api/register`.

## Google Sheets

Create a service account, enable Sheets API, share the sheet with the service-account email (Editor),
create a tab named `Registrations`. Header row is written automatically. If Sheets fails,
the record is still saved in MongoDB with `sheetSynced: false`.

## API

| Route | Purpose |
| --- | --- |
| `POST /api/otp/send` | `{ mobile }` |
| `POST /api/otp/verify` | `{ mobile, otp }` → `{ token }` |
| `POST /api/check-duplicate` | `{ field: "email" \| "phone", value }` |
| `POST /api/register` | `{ data, verificationToken }` → `{ registration: { regId, … } }` |
