import Link from "next/link";
import { PageShell } from "@/components/page-shell";
import { PolicySection } from "@/components/policy-section";
import { SITE, EVENT_NAME } from "@/lib/site-config";

export const metadata = {
  title: `Privacy Notice & Policy | ${SITE.institute}`,
  description: `How ${SITE.institute} collects, uses and protects personal data submitted through the faculty registration form.`,
};

const CONTACT = SITE.privacy.contactEmail;
const DAYS = SITE.privacy.responseDays;

const DATA_TABLE = [
  {
    category: "Your identity & contact details",
    items: "Full name, designation, mobile number (verified by OTP), official email ID, alternative contact number (optional)",
    purpose: "Register you, verify your identity, send confirmations and event communication",
  },
  {
    category: "School / institution details",
    items:
      "School name, full address, board, category, school official email and contact number, name and official email/contact of the Principal / Head of Institution",
    purpose: "Plan school outreach, coordinate visits, sessions and exhibition participation",
  },
  {
    category: "Outreach preferences",
    items:
      "Stage at which students benefit most from guidance, approximate Class XII enrolment, streams offered, career-guidance practices, interest in sessions, programme information and school visits, preferred activities, communication mode and time",
    purpose: "Design relevant guidance sessions and activities; contact you in your preferred way",
  },
  {
    category: "Consent record",
    items: "Your consent choices, privacy-notice version, date/time and IP address at which consent was given or withdrawn",
    purpose: "Demonstrate valid consent as required by law",
  },
  {
    category: "Technical & security data",
    items: "IP address, browser type, OTP request logs, timestamps",
    purpose: "Prevent misuse and spam, rate-limit OTPs, secure the system",
  },
];

const PROCESSORS = [
  ["MongoDB (database hosting)", "Secure storage of registration records"],
  ["Google Workspace / Google Sheets", "Internal record sheet for the organising team"],
  ["SMS gateway (TRAI DLT-registered)", "Delivery of one-time passwords (OTP)"],
  ["Website hosting provider", "Running this registration website"],
];

const RIGHTS = [
  ["Right to information", "Get a summary of the personal data we hold about you and the processing activities (Section 11)."],
  ["Right to correction, completion, updating and erasure", "Ask us to correct inaccurate data, complete or update it, or erase it when no longer needed (Section 12)."],
  ["Right to withdraw consent", "Withdraw consent at any time, as easily as you gave it. Processing done before withdrawal remains lawful (Section 6(4))."],
  ["Right of grievance redressal", "Raise a complaint with us, and then with the Data Protection Board of India (Section 13)."],
  ["Right to nominate", "Nominate another person to exercise your rights in the event of death or incapacity (Section 14)."],
];

export default function PrivacyPolicyPage() {
  return (
    <PageShell
      eyebrow="Privacy Notice · DPDP Act, 2023"
      title="Privacy Notice & Policy"
      intro={
        <p>
          Version {SITE.privacy.version} · Effective {SITE.privacy.effectiveDate}. This notice explains, in plain
          language, what personal data {SITE.institute} collects through the faculty registration form, why, and
          the rights you have.
        </p>
      }
    >
      <nav className="glass mb-10 rounded-2xl p-5 text-sm">
        <p className="mb-3 font-semibold">Quick summary</p>
        <ul className="grid gap-2 text-muted-foreground sm:grid-cols-2">
          <li>✔ We collect only what is needed for registration and school outreach.</li>
          <li>✔ We never sell or rent your personal data.</li>
          <li>✔ Promotional messages only with your separate, optional consent.</li>
          <li>✔ Withdraw consent or request deletion anytime.</li>
        </ul>
        <div className="mt-4 flex flex-wrap gap-3">
          <a
            href={`mailto:${CONTACT}?subject=Personal%20data%20request`}
            className="rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:brightness-110"
          >
            Withdraw consent / Data request
          </a>
          <Link
            href="/cookie-policy"
            className="rounded-full border border-border px-4 py-2 text-xs font-semibold hover:bg-secondary"
          >
            Cookie Policy
          </Link>
        </div>
      </nav>

      <article className="glass space-y-10 rounded-2xl p-6 sm:p-10">
        <PolicySection n={1} title="Who we are">
          <p>
            {SITE.institute} (&ldquo;EIT&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;), {SITE.address.line1},{" "}
            {SITE.address.line2}, is the <strong>Data Fiduciary</strong> for personal data collected through this
            website for faculty registration, the {EVENT_NAME}, and related school outreach activities.
          </p>
          <p>
            This notice is issued under the Digital Personal Data Protection Act, 2023 (&ldquo;DPDP Act&rdquo;), the
            Digital Personal Data Protection Rules, 2025, and the Information Technology Act, 2000 read with the
            Information Technology (Reasonable Security Practices and Procedures and Sensitive Personal Data or
            Information) Rules, 2011.
          </p>
        </PolicySection>

        <PolicySection n={2} title="Personal data we collect and why">
          <p>We collect the following personal data directly from you through the registration form:</p>
          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full min-w-[600px] text-left text-sm">
              <thead className="bg-secondary/50 text-xs tracking-wider text-muted-foreground uppercase">
                <tr>
                  <th className="px-4 py-3 font-semibold">Category</th>
                  <th className="px-4 py-3 font-semibold">Data items</th>
                  <th className="px-4 py-3 font-semibold">Purpose</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {DATA_TABLE.map((r) => (
                  <tr key={r.category} className="align-top">
                    <td className="px-4 py-3 font-medium">{r.category}</td>
                    <td className="px-4 py-3 text-muted-foreground">{r.items}</td>
                    <td className="px-4 py-3 text-muted-foreground">{r.purpose}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p>
            We do <strong>not</strong> collect sensitive personal data such as passwords, financial information,
            health, biometric or caste information. Details of the Principal / Head of Institution are official
            institutional contact details; by submitting them you confirm you are authorised to share them for this
            purpose. They are used only to communicate with the school.
          </p>
        </PolicySection>

        <PolicySection n={3} title="Legal basis: your consent">
          <p>
            We process your personal data on the basis of your <strong>free, specific, informed, unconditional and
            unambiguous consent</strong>, given by ticking the consent box before submitting the form (Section 6 of
            the DPDP Act). Consent to receive promotional information about EIT programmes and admissions is a{" "}
            <strong>separate, optional</strong> choice; registration does not depend on it.
          </p>
          <p>
            Mobile verification by OTP is necessary to confirm that the number belongs to you and to prevent
            duplicate or fraudulent registrations.
          </p>
        </PolicySection>

        <PolicySection n={4} title="How you can withdraw consent">
          <p>
            You may withdraw your consent at any time, as easily as you gave it, by emailing{" "}
            <a href={`mailto:${CONTACT}`}>{CONTACT}</a> from your registered email ID with the subject
            &ldquo;Withdraw consent&rdquo; (or &ldquo;Stop promotional messages&rdquo; to opt out of promotions only).
          </p>
          <p>
            On withdrawal we will stop processing and erase your personal data within a reasonable time, unless
            retention is required by law. Withdrawal does not affect processing already carried out. If you withdraw
            consent before the event, we may be unable to keep your registration active.
          </p>
        </PolicySection>

        <PolicySection n={5} title="Who we share data with">
          <p>
            We <strong>never sell, rent or trade</strong> your personal data. Access is limited to the authorised
            organising and outreach team of {SITE.institute}. We use the following service providers (Data
            Processors), bound by contract to process data only on our instructions and with reasonable security
            safeguards:
          </p>
          <ul>
            {PROCESSORS.map(([n, p]) => (
              <li key={n}>
                <strong>{n}</strong> – {p}
              </li>
            ))}
          </ul>
          <p>
            We may disclose personal data to Government agencies or courts where required by law, for example for
            verification of identity or for the prevention, detection or investigation of offences.
          </p>
        </PolicySection>

        <PolicySection n={6} title="Where your data is stored">
          <p>
            Data is stored on secure cloud infrastructure. Some of our service providers may store data on servers
            located outside India. Any such transfer is made only as permitted under Section 16 of the DPDP Act and
            not to any country or territory restricted by the Central Government.
          </p>
        </PolicySection>

        <PolicySection n={7} title="How long we keep your data">
          <ul>
            <li>
              Registration and outreach data: for <strong>{SITE.privacy.retention}</strong>, or until you withdraw
              consent, whichever is earlier, after which it is erased.
            </li>
            <li>One-time passwords: stored only in hashed form and automatically deleted within 5 minutes.</li>
            <li>OTP request logs used for rate-limiting: automatically deleted after 1 hour.</li>
            <li>
              Security and access logs: retained for at least one year, as required for security and legal
              purposes.
            </li>
          </ul>
        </PolicySection>

        <PolicySection n={8} title="How we protect your data">
          <ul>
            <li>Encrypted connections (HTTPS) between your browser and our servers.</li>
            <li>OTPs are hashed and never stored in plain text; limited attempts and expiry prevent misuse.</li>
            <li>Role-based, password-protected access for authorised staff only.</li>
            <li>Database-level uniqueness checks, rate-limiting and monitoring of access logs.</li>
            <li>Regular backups to ensure data is not lost.</li>
          </ul>
          <p>
            In the unlikely event of a personal data breach, we will inform affected individuals and the Data
            Protection Board of India without delay, as required by the DPDP Act and Rules, describing the breach,
            its likely impact and the steps you can take.
          </p>
        </PolicySection>

        <PolicySection n={9} title="Your rights">
          <ul>
            {RIGHTS.map(([t, d]) => (
              <li key={t}>
                <strong>{t}:</strong> {d}
              </li>
            ))}
          </ul>
          <p>
            To exercise any right, email <a href={`mailto:${CONTACT}`}>{CONTACT}</a> from your registered email ID.
            We may ask you to verify your identity (e.g. from your registered mobile or email) before acting on a
            request. We will respond within <strong>{DAYS} days</strong>.
          </p>
          <p>
            Under Section 15 of the DPDP Act you also have duties: provide authentic information, do not impersonate
            another person, and do not file false or frivolous complaints.
          </p>
        </PolicySection>

        <PolicySection n={10} title="SMS, WhatsApp and email communication">
          <p>
            OTP and registration messages are transactional and sent through a TRAI DLT-registered SMS sender.
            Promotional updates about EIT programmes, admissions or events are sent only if you opt in, and only
            through the modes you selected. You can opt out at any time by emailing{" "}
            <a href={`mailto:${CONTACT}`}>{CONTACT}</a> or by replying to us.
          </p>
        </PolicySection>

        <PolicySection n={11} title="Children's data">
          <p>
            This form is meant only for teachers, principals and other school staff aged 18 or above. We do not
            knowingly collect personal data of children (persons under 18) through this form. Information about
            enrolment, guidance stages or streams is collected only as aggregate, non-personal school information.
          </p>
        </PolicySection>

        <PolicySection n={12} title="Cookies">
          <p>
            This website does not use advertising or tracking cookies, and does not use third-party analytics. See
            our <Link href="/cookie-policy">Cookie Policy</Link> for details.
          </p>
        </PolicySection>

        <PolicySection id="contact" n={13} title="Contact us & complaints">
          <p>For any questions, complaints or requests about your personal data, contact us:</p>
          <div className="rounded-xl border border-primary/30 bg-primary/5 p-5 text-sm">
            <p className="font-semibold">{SITE.institute}</p>
            <p className="mt-1 text-muted-foreground">
              {SITE.address.line1}, {SITE.address.line2}
            </p>
            <p className="mt-2">
              Email: <a href={`mailto:${CONTACT}`}>{CONTACT}</a>
              <br />
              Phone: <a href={SITE.phone.href}>{SITE.phone.label}</a>
            </p>
          </div>
          <p>
            We will resolve your request or complaint within <strong>{DAYS} days</strong> of receipt. If you are not
            satisfied with our response, you may file a complaint with the <strong>Data Protection Board of
            India</strong> through the digital platform notified by the Government of India.
          </p>
        </PolicySection>

        <PolicySection n={14} title="Changes to this notice">
          <p>
            We may update this notice to reflect changes in law or in our practices. The version number and effective
            date at the top will change, and material changes will be communicated to registered users. Continued
            processing after a material change will be based on renewed consent where required.
          </p>
        </PolicySection>

        <PolicySection n={15} title="Governing law">
          <p>
            This notice is governed by the laws of India. Courts at Faridabad, Haryana shall have jurisdiction,
            without prejudice to your right to approach the Data Protection Board of India.
          </p>
        </PolicySection>
      </article>
    </PageShell>
  );
}