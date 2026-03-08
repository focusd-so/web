import { createFileRoute } from "@tanstack/react-router";
import {
  Navbar,
  HeroSection,
  DistractionBlockingSection,
  ProgrammableSection,
  PrivacySection,
  AudienceSection,
  FinalCTASection,
  Footer,
} from "@/components/landing";
import { HomepageCookieBanner } from "@/components/analytics-provider";

export const Route = createFileRoute("/")({
  component: HomePage,
});

function HomePage() {
  return (
    <div className="dark font-[Inter,system-ui,sans-serif] antialiased overflow-x-hidden">
      <Navbar />
      <main>
        <HeroSection />
        {/* <ProblemSection /> */}
        {/* <CoreModelSection /> */}
        <DistractionBlockingSection />
        <ProgrammableSection />
        {/* <FocusSessionsSection /> */}
        <PrivacySection />
        <AudienceSection />
        <FinalCTASection />
      </main>
      <Footer />
      <HomepageCookieBanner />
    </div>
  );
}
