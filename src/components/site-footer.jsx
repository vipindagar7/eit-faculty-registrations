import Image from "next/image";
import Link from "next/link";
import { Globe, Mail, MapPin, MessageCircle, Phone, ShieldCheck } from "lucide-react";
import { SITE } from "@/lib/site-config";

const CONTACTS = [
  { icon: Phone, label: SITE.phone.label, href: SITE.phone.href, title: "Call" },
  { icon: MessageCircle, label: SITE.whatsapp.label, href: SITE.whatsapp.href, title: "WhatsApp" },
  { icon: Mail, label: SITE.email.label, href: SITE.email.href, title: "Email" },
  { icon: Globe, label: SITE.website.label, href: SITE.website.href, title: "Website" },
];

export function SiteFooter() {
  return (
    <footer className="relative mt-6 border-t border-border/60 bg-background/40 backdrop-blur-md">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.3fr_1fr_1fr] lg:px-10">
        <div className="space-y-4">
          <div className="space-y-3">
            <Image
              src="/logos/eit-ggsipu-logo.png"
              alt="Echelon Institute of Technology – Affiliated to GGSIPU"
              width={1400}
              height={320}
              className="h-auto w-full max-w-[320px]"
            />
            <p className="text-sm text-muted-foreground">
              {SITE.institute} · {SITE.approval}
            </p>
          </div>
          <a
            href={SITE.address.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-start gap-2.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <MapPin className="mt-0.5 size-4 shrink-0 text-primary" />
            <span>
              {SITE.address.line1}
              <br />
              {SITE.address.line2}
            </span>
          </a>
        </div>

        <div>
          <p className="mb-4 text-xs font-semibold tracking-widest text-muted-foreground uppercase">Contact</p>
          <ul className="space-y-2.5">
            {CONTACTS.map(({ icon: Icon, label, href, title }) => (
              <li key={title}>
                <a
                  href={href}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  <Icon className="size-4 text-primary" />
                  <span className="sr-only">{title}: </span>
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="mb-4 text-xs font-semibold tracking-widest text-muted-foreground uppercase">Privacy</p>
          <ul className="space-y-2.5 text-sm">
            <li>
              <Link href="/privacy-policy" className="text-muted-foreground transition-colors hover:text-foreground">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link href="/cookie-policy" className="text-muted-foreground transition-colors hover:text-foreground">
                Cookie Policy
              </Link>
            </li>
          </ul>
          <p className="mt-4 flex items-start gap-2 text-xs leading-relaxed text-muted-foreground">
            <ShieldCheck className="mt-0.5 size-3.5 shrink-0 text-success" />
            Your data is processed under the Digital Personal Data Protection Act, 2023.
          </p>
        </div>
      </div>
      <div className="border-t border-border/60 py-5 text-center text-xs text-muted-foreground">
        © {SITE.copyrightYear} {SITE.institute}, Faridabad. All rights reserved.
      </div>
    </footer>
  );
}
