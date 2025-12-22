import { createFileRoute } from "@tanstack/react-router";
import {
  Navbar,
  HeroSection,
  ProblemSection,
  CoreModelSection,
  DistractionBlockingSection,
  FocusSessionsSection,
  PrivacySection,
  AudienceSection,
  FinalCTASection,
  Footer,
} from "@/components/landing";

export const Route = createFileRoute("/")({
  component: HomePage,
});

function HomePage() {
  return (
    <div className="dark font-[Inter,system-ui,sans-serif] antialiased overflow-x-hidden">
      <Navbar />
      <main>
        <HeroSection />
        <ProblemSection />
        <CoreModelSection />
        <DistractionBlockingSection />
        <FocusSessionsSection />
        <PrivacySection />
        <AudienceSection />
        <FinalCTASection />
      </main>
      <Footer />
    </div>
  );
}
