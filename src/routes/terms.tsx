import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/terms")({
  component: TermsPage,
});

function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center border-b pb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Terms of Service
          </h1>
          <p className="text-muted-foreground">
            Last updated: December 13, 2025
          </p>
        </div>

        {/* Introduction */}
        <div className="space-y-4">
          <p className="text-foreground leading-relaxed">
            Welcome to <strong className="text-foreground">Focusd</strong>. These Terms of Service (“Terms”) govern your access to and use of the Focusd desktop applications, web application, and related services (collectively, the “Service”). By accessing or using Focusd, you agree to be bound by these Terms. If you do not agree, do not use the Service.
          </p>
        </div>

        {/* 1. Acceptance of Terms */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-foreground">1. Acceptance of Terms</h2>
          <p className="text-foreground leading-relaxed">
            By accessing or using Focusd, you confirm that you have read, understood, and agree to these Terms. We may update these Terms from time to time. Any changes take effect when posted. Your continued use of the Service after changes constitutes acceptance of the updated Terms.
          </p>
        </section>

        {/* 2. Description of the Service */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-foreground">2. Description of the Service</h2>
          <p className="text-foreground leading-relaxed">
            Focusd is a productivity and focus platform designed to help users track work, reduce distractions, and surface actionable work items using integrations and artificial intelligence.
          </p>
          <p className="text-foreground leading-relaxed">
            The Service is provided through:
          </p>
          <ul className="list-disc list-inside space-y-2 text-foreground ml-4">
            <li>Desktop applications</li>
            <li>A web application</li>
          </ul>
          <p className="text-foreground leading-relaxed">
            Some features require connecting third-party services or enabling optional cloud sync.
          </p>
        </section>

        {/* 3. Accounts and Eligibility */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-foreground">3. Accounts and Eligibility</h2>
          <p className="text-foreground leading-relaxed">
            You must be at least 18 years old to use Focusd. You are responsible for maintaining the confidentiality of your account credentials and for all activity that occurs under your account.
          </p>
        </section>

        {/* 4. Free Trial, Pricing, and Billing */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-foreground">4. Free Trial, Pricing, and Billing</h2>
          <p className="text-foreground leading-relaxed">
            Focusd offers a <strong className="text-foreground">7-day free trial</strong>. After the trial period ends, continued access to paid features requires an active subscription.
          </p>
          <ul className="list-disc list-inside space-y-2 text-foreground ml-4">
            <li>Subscriptions are billed in advance on a recurring basis.</li>
            <li>Payments are processed by third-party payment providers such as <strong className="text-foreground">Stripe</strong> or <strong className="text-foreground">Paddle</strong>.</li>
            <li>Prices may change with reasonable advance notice.</li>
          </ul>
          <div className="space-y-2">
            <h3 className="text-lg font-medium text-foreground">No Refunds:</h3>
            <p className="text-foreground leading-relaxed">
              All fees are <strong className="text-foreground">non-refundable</strong>, including after the free trial period. We do not provide refunds, credits, or prorated billing for unused subscription time.
            </p>
          </div>
        </section>

        {/* 5. User Conduct */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-foreground">5. User Conduct</h2>
          <p className="text-foreground leading-relaxed">
            You agree not to use the Service to:
          </p>
          <ul className="list-disc list-inside space-y-2 text-foreground ml-4">
            <li>Violate any applicable law or regulation</li>
            <li>Infringe upon the rights of others</li>
            <li>Attempt to gain unauthorized access to systems or data</li>
            <li>Interfere with or disrupt the Service</li>
            <li>Reverse engineer, resell, or misuse the Service except as permitted by law</li>
          </ul>
          <p className="text-foreground leading-relaxed">
            We reserve the right to suspend or terminate access for violations of these Terms.
          </p>
        </section>

        {/* 6. Data, Privacy, and AI Usage */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-foreground">6. Data, Privacy, and AI Usage</h2>
          <p className="text-foreground leading-relaxed">
            Focusd is <strong className="text-foreground">local-first by default</strong>. Your data remains on your device unless you explicitly enable cloud sync or connect third-party services.
          </p>
          <p className="text-foreground leading-relaxed">
            We commit that:
          </p>
          <ul className="list-disc list-inside space-y-2 text-foreground ml-4">
            <li>We <strong className="text-foreground">do not sell user data</strong></li>
            <li>User data is <strong className="text-foreground">not used to train AI models</strong></li>
            <li>Any data processed on our servers is used <strong className="text-foreground">solely to provide the Service</strong></li>
          </ul>
          <p className="text-foreground leading-relaxed">
            Focusd uses third-party AI providers (such as <strong className="text-foreground">Google Gemini</strong>) to power certain features. Data shared with these providers is limited to what is necessary for functionality and is handled in accordance with our Privacy Policy.
          </p>
          <p className="text-foreground leading-relaxed">
            Your use of the Service is also governed by our <strong className="text-foreground">Privacy Policy</strong>, which is incorporated into these Terms by reference.
          </p>
        </section>

        {/* 7. Third-Party Services */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-foreground">7. Third-Party Services</h2>
          <p className="text-foreground leading-relaxed">
            Focusd relies on third-party services for authentication, payments, integrations, and AI functionality. These services operate under their own terms and policies. We are not responsible for third-party services or their practices.
          </p>
        </section>

        {/* 8. Intellectual Property */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-foreground">8. Intellectual Property</h2>
          <p className="text-foreground leading-relaxed">
            All software, content, branding, and functionality provided by Focusd are the exclusive property of Focusd or its licensors and are protected by applicable intellectual property laws. You may not copy, modify, distribute, or resell any part of the Service without prior written permission.
          </p>
        </section>

        {/* 9. Disclaimers */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-foreground">9. Disclaimers</h2>
          <p className="text-foreground leading-relaxed">
            The Service is provided <strong className="text-foreground">“as is”</strong> and <strong className="text-foreground">“as available.”</strong> We make no warranties, express or implied, regarding the reliability, availability, or accuracy of the Service.
          </p>
          <p className="text-foreground leading-relaxed">
            Focusd is not intended to be a substitute for professional, legal, medical, or financial advice.
          </p>
        </section>

        {/* 10. Limitation of Liability */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-foreground">10. Limitation of Liability</h2>
          <p className="text-foreground leading-relaxed">
            To the maximum extent permitted by law, Focusd shall not be liable for any indirect, incidental, consequential, or special damages, including loss of data, profits, or productivity, arising from your use of or inability to use the Service.
          </p>
        </section>

        {/* 11. Termination */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-foreground">11. Termination</h2>
          <p className="text-foreground leading-relaxed">
            We may suspend or terminate your access to the Service at any time if you violate these Terms or if we discontinue the Service. You may stop using Focusd at any time.
          </p>
        </section>

        {/* 12. Governing Law */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-foreground">12. Governing Law</h2>
          <p className="text-foreground leading-relaxed">
            These Terms are governed by and construed in accordance with the laws of <strong className="text-foreground">England and Wales</strong>, without regard to conflict of law principles.
          </p>
        </section>

        {/* 13. Contact */}
        <section className="space-y-6 border-t pt-8">
          <h2 className="text-2xl font-semibold text-foreground">13. Contact</h2>
          <p className="text-foreground leading-relaxed">
            For questions or support, contact us at:
          </p>
          <p className="text-foreground leading-relaxed">
            <a href="mailto:support@focusd.so" className="text-primary hover:underline font-medium">
              support@focusd.so
            </a>
          </p>
        </section>

        <div className="space-y-4 pt-8 text-center text-muted-foreground">
          <p>
            By using Focusd, you agree to these Terms of Service and our Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
}

