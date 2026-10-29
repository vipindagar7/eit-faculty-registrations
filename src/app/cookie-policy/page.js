import Link from "next/link";
import { PageShell } from "@/components/page-shell";
import { PolicySection } from "@/components/policy-section";
import { SITE } from "@/lib/site-config";

export const metadata = {
  title: `Cookie Policy | ${SITE.institute}`,
  description: `How ${SITE.institute}'s faculty registration website uses cookies and similar technologies.`,
};

const CONTACT = SITE.privacy.contactEmail;

const TYPES = [
  {
    type: "Strictly necessary",
    used: "Only if required by our hosting provider",
    purpose: "Security (e.g. protection against bots and attacks) and keeping the website available",
    consent: "Not required – the site cannot work securely without them",
  },
  {
    type: "Analytics / performance",
    used: "No",
    purpose: "—",
    consent: "Would be asked before use",
  },
  {
    type: "Advertising / tracking",
    used: "No",
    purpose: "—",
    consent: "Would be asked before use",
  },
  {
    type: "Social media / third-party",
    used: "No",
    purpose: "—",
    consent: "Would be asked before use",
  },
];

export default function CookiePolicyPage() {
  return (
    <PageShell
      eyebrow="Cookie Policy"
      title="Cookie Policy"
      intro={
        <p>
          Version {SITE.privacy.version} · Effective {SITE.privacy.effectiveDate}. This policy explains how the{" "}
          {SITE.institute} faculty registration website uses cookies and similar technologies. Read it together with
          our <Link href="/privacy-policy" className="text-primary hover:underline">Privacy Policy</Link>.
        </p>
      }
    >
      <nav className="glass mb-10 rounded-2xl p-5 text-sm">
        <p className="mb-3 font-semibold">In short</p>
        <ul className="grid gap-2 text-muted-foreground sm:grid-cols-2">
          <li>✔ No advertising or tracking cookies.</li>
          <li>✔ No Google Analytics or third-party trackers.</li>
          <li>✔ Your form data is never stored in cookies.</li>
          <li>✔ No cookie banner needed — nothing to opt out of.</li>
        </ul>
      </nav>

      <article className="glass space-y-10 rounded-2xl p-6 sm:p-10">
        <PolicySection n={1} title="What are cookies?">
          <p>
            Cookies are small text files that a website stores in your browser. Similar technologies include local
            storage and session storage. They can be used to remember information about your visit, to keep a site
            secure, or to track browsing across websites.
          </p>
        </PolicySection>

        <PolicySection n={2} title="Cookies we use">
          <p>
            This website is built to work <strong>without</strong> cookies. We do not set any cookies ourselves to
            identify you, track you, or show you advertisements. The table below summarises each category:
          </p>
          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full min-w-[600px] text-left text-sm">
              <thead className="bg-secondary/50 text-xs tracking-wider text-muted-foreground uppercase">
                <tr>
                  <th className="px-4 py-3 font-semibold">Type</th>
                  <th className="px-4 py-3 font-semibold">Used?</th>
                  <th className="px-4 py-3 font-semibold">Purpose</th>
                  <th className="px-4 py-3 font-semibold">Consent</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {TYPES.map((t) => (
                  <tr key={t.type} className="align-top">
                    <td className="px-4 py-3 font-medium">{t.type}</td>
                    <td className="px-4 py-3 text-muted-foreground">{t.used}</td>
                    <td className="px-4 py-3 text-muted-foreground">{t.purpose}</td>
                    <td className="px-4 py-3 text-muted-foreground">{t.consent}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </PolicySection>

        <PolicySection n={3} title="How your form data is handled">
          <p>
            The details you enter in the registration form stay in your browser&apos;s memory only while you fill it
            in, and are sent to our server when you submit. They are not saved in cookies or local storage. If you
            close or refresh the page before submitting, the entered details are cleared.
          </p>
        </PolicySection>

        <PolicySection n={4} title="Third-party content">
          <p>
            This website does not embed third-party advertising, social media widgets or tracking pixels. Fonts are
            served from our own website. Links to external sites (such as Google Maps or WhatsApp in the footer) open
            those services, which have their own cookie and privacy policies.
          </p>
        </PolicySection>

        <PolicySection n={5} title="Managing cookies in your browser">
          <p>
            You can view, block or delete cookies at any time through your browser settings. Blocking strictly
            necessary cookies set by our hosting provider may affect how securely or reliably the site loads.
          </p>
          <ul>
            <li>Chrome: Settings → Privacy and security → Third-party cookies / Site data</li>
            <li>Safari: Settings → Privacy → Manage Website Data</li>
            <li>Firefox: Settings → Privacy &amp; Security → Cookies and Site Data</li>
            <li>Edge: Settings → Cookies and site permissions</li>
          </ul>
        </PolicySection>

        <PolicySection n={6} title="Changes to this policy">
          <p>
            If we start using any non-essential cookies (for example, analytics), we will update this policy and ask
            for your consent before setting them, as required under the Digital Personal Data Protection Act, 2023.
          </p>
        </PolicySection>

        <PolicySection n={7} title="Contact us">
          <p>
            Questions about this policy? Email <a href={`mailto:${CONTACT}`}>{CONTACT}</a> or call{" "}
            <a href={SITE.phone.href}>{SITE.phone.label}</a>.
          </p>
        </PolicySection>
      </article>
    </PageShell>
  );
}
