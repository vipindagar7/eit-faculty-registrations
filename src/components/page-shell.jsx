import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { BackgroundFX } from "@/components/registration/background-fx";
import { SiteFooter } from "@/components/site-footer";

/** Layout for content pages (privacy policy, data rights). */
export function PageShell({ eyebrow, title, intro, children }) {
  return (
    <main className="relative isolate min-h-dvh">
      <BackgroundFX />
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-14">
        <div className="mb-10 flex flex-wrap items-center justify-between gap-4">
          <Link href="/" aria-label="Back to registration home">
            <Image
              src="/logos/eit-ggsipu-logo.png"
              alt="Echelon Institute of Technology – Affiliated to GGSIPU"
              width={1400}
              height={320}
              priority
              className="h-auto w-[260px] sm:w-[320px]"
            />
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-4" /> Back to registration
          </Link>
        </div>
        <header className="mb-8 space-y-3">
          {eyebrow && (
            <p className="text-xs font-semibold tracking-widest text-primary uppercase">{eyebrow}</p>
          )}
          <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">{title}</h1>
          {intro && <div className="text-muted-foreground">{intro}</div>}
        </header>
        {children}
      </div>
      <SiteFooter />
    </main>
  );
}
