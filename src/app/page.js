import { BackgroundFX } from "@/components/registration/background-fx";
import { HeroPanel } from "@/components/registration/hero-panel";
import { RegistrationForm } from "@/components/registration/registration-form";
import { SiteFooter } from "@/components/site-footer";

export default function Home() {
  return (
    <main className="relative isolate min-h-dvh">
      <BackgroundFX />
      <div className="mx-auto grid max-w-7xl items-start gap-10 px-4 py-10 sm:px-6 sm:py-14 lg:grid-cols-[1fr_1.15fr] lg:gap-16 lg:px-10 lg:py-20">
        <HeroPanel />
        <RegistrationForm />
      </div>
      <SiteFooter />
    </main>
  );
}
