import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/compliance/privacy")({
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center border-b pb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Privacy Policy
          </h1>
          <p className="text-muted-foreground">
            Last updated: December 13, 2025
          </p>
        </div>

        {/* Introduction */}
        <div className="space-y-4">
          <p className="text-foreground leading-relaxed">
            At <strong className="text-foreground">Focusd</strong>, we respect your privacy and are committed to protecting your personal data. This Privacy Policy explains how we collect, use, and safeguard information when you use the Focusd desktop applications, web application, and related services (collectively, the “Service”).
          </p>
          <p className="text-foreground leading-relaxed">
            This Privacy Policy should be read together with our Terms of Service.
          </p>
        </div>

        {/* 1. Information We Collect */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-foreground">1. Information We Collect</h2>
          <p className="text-foreground leading-relaxed">
            Focusd is <strong className="text-foreground">local-first by default</strong>. Most data is stored on your device unless you explicitly enable cloud sync or connect third-party services.
          </p>
          <p className="text-foreground leading-relaxed">
            We may collect the following categories of information:
          </p>

          <div className="space-y-4">
            <div className="space-y-2">
              <h3 className="text-xl font-medium text-foreground">a. Account Information</h3>
              <ul className="list-disc list-inside space-y-2 text-foreground ml-4">
                <li>Email address</li>
                <li>Authentication identifiers provided by our authentication provider (e.g. Stytch)</li>
              </ul>
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-medium text-foreground">b. Usage Data</h3>
              <ul className="list-disc list-inside space-y-2 text-foreground ml-4">
                <li>Feature usage and interaction data</li>
                <li>Session metadata and diagnostics</li>
                <li>Error and crash reports</li>
              </ul>
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-medium text-foreground">c. Device and Technical Data</h3>
              <ul className="list-disc list-inside space-y-2 text-foreground ml-4">
                <li>Device type and operating system</li>
                <li>Application version</li>
                <li>IP address (used for security and abuse prevention)</li>
              </ul>
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-medium text-foreground">d. Integration Data (Optional)</h3>
              <p className="text-foreground leading-relaxed">
                If you connect third-party services (such as GitHub, Slack, or Notion), we process only the data required to provide the requested functionality.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-medium text-foreground">e. Subscription Information</h3>
              <ul className="list-disc list-inside space-y-2 text-foreground ml-4">
                <li>Subscription status</li>
                <li>Billing state and timestamps</li>
              </ul>
            </div>
          </div>

          <p className="text-foreground leading-relaxed">
            <strong className="text-foreground">Important:</strong> Focusd does <strong className="text-foreground">not</strong> collect or store payment card details or banking information.
          </p>
        </section>

        {/* 2. Payment Processing */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-foreground">2. Payment Processing</h2>
          <p className="text-foreground leading-relaxed">
            Payments are processed by third-party payment providers such as <strong className="text-foreground">Stripe</strong> or <strong className="text-foreground">Paddle</strong>.
          </p>
          <ul className="list-disc list-inside space-y-2 text-foreground ml-4">
            <li>Payment details are transmitted directly to the payment provider</li>
            <li>Focusd does not store or process payment card data</li>
            <li>We only receive confirmation of payment and subscription status</li>
          </ul>
          <p className="text-foreground leading-relaxed">
            Payment data is governed by the payment provider’s own privacy policies and security standards.
          </p>
        </section>

        {/* 3. How We Use Your Information */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-foreground">3. How We Use Your Information</h2>
          <p className="text-foreground leading-relaxed">
            We use collected information to:
          </p>
          <ul className="list-disc list-inside space-y-2 text-foreground ml-4">
            <li>Provide and operate the Service</li>
            <li>Enable optional cloud sync and integrations</li>
            <li>Improve performance, reliability, and usability</li>
            <li>Detect, prevent, and address technical or security issues</li>
            <li>Communicate important service-related information</li>
          </ul>
          <p className="text-foreground leading-relaxed">
            We do <strong className="text-foreground">not</strong> use your data for advertising.
          </p>
        </section>

        {/* 4. AI Usage and User-Provided API Keys */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-foreground">4. AI Usage and User-Provided API Keys</h2>
          <p className="text-foreground leading-relaxed">
            Focusd offers features that integrate with third-party AI providers (such as <strong className="text-foreground">Google Gemini</strong>).
          </p>
          <p className="text-foreground leading-relaxed">
            Depending on configuration:
          </p>
          <ul className="list-disc list-inside space-y-2 text-foreground ml-4">
            <li>Focusd may process data via its own AI integrations, or</li>
            <li>You may choose to <strong className="text-foreground">provide your own API key</strong> for a supported AI provider</li>
          </ul>
          <p className="text-foreground leading-relaxed">
            When you provide your own API key:
          </p>
          <ul className="list-disc list-inside space-y-2 text-foreground ml-4">
            <li>Requests are sent directly using your credentials</li>
            <li>Data is processed under <strong className="text-foreground">your agreement</strong> with that AI provider</li>
            <li>Focusd does not control how third-party AI providers handle or retain data</li>
          </ul>
          <p className="text-foreground leading-relaxed">
            Regardless of configuration:
          </p>
          <ul className="list-disc list-inside space-y-2 text-foreground ml-4">
            <li><strong className="text-foreground">Focusd does not sell user data</strong></li>
            <li><strong className="text-foreground">Focusd does not use user data to train AI models</strong></li>
          </ul>
        </section>

        {/* 5. Data Sharing and Disclosure */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-foreground">5. Data Sharing and Disclosure</h2>
          <p className="text-foreground leading-relaxed">
            We may share data only in the following circumstances:
          </p>

          <div className="space-y-4">
            <div className="space-y-2">
              <h3 className="text-xl font-medium text-foreground">a. Service Providers</h3>
              <p className="text-foreground leading-relaxed">
                With trusted third parties who help operate the Service, including:
              </p>
              <ul className="list-disc list-inside space-y-2 text-foreground ml-4">
                <li>Authentication providers</li>
                <li>Payment processors</li>
                <li>Cloud infrastructure providers</li>
                <li>AI service providers, where applicable</li>
              </ul>
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-medium text-foreground">b. Legal Requirements</h3>
              <p className="text-foreground leading-relaxed">
                If required by law, regulation, or valid legal process.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-medium text-foreground">c. Business Transfers</h3>
              <p className="text-foreground leading-relaxed">
                In connection with a merger, acquisition, or sale of assets, where permitted by law.
              </p>
            </div>
          </div>

          <p className="text-foreground leading-relaxed">
            We do not sell personal data to third parties.
          </p>
        </section>

        {/* 6. Data Storage and Security */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-foreground">6. Data Storage and Security</h2>
          <p className="text-foreground leading-relaxed">
            We implement appropriate technical and organizational measures to protect your data. However, no system is completely secure, and we cannot guarantee absolute security.
          </p>
          <p className="text-foreground leading-relaxed">
            Local-first data remains on your device unless cloud sync is explicitly enabled by you.
          </p>
        </section>

        {/* 7. Data Retention */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-foreground">7. Data Retention</h2>
          <p className="text-foreground leading-relaxed">
            We retain personal data only for as long as necessary to:
          </p>
          <ul className="list-disc list-inside space-y-2 text-foreground ml-4">
            <li>Provide the Service</li>
            <li>Meet legal, accounting, or regulatory obligations</li>
          </ul>
          <p className="text-foreground leading-relaxed">
            You may request deletion of your account and associated data at any time.
          </p>
        </section>

        {/* 8. Your Rights (UK / GDPR) */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-foreground">8. Your Rights (UK / GDPR)</h2>
          <p className="text-foreground leading-relaxed">
            Depending on your location, you may have the right to:
          </p>
          <ul className="list-disc list-inside space-y-2 text-foreground ml-4">
            <li>Access your personal data</li>
            <li>Request correction or deletion</li>
            <li>Object to or restrict processing</li>
            <li>Request data portability</li>
            <li>Withdraw consent where applicable</li>
          </ul>
          <p className="text-foreground leading-relaxed">
            To exercise your rights, contact us at <a href="mailto:support@focusd.so" className="text-primary hover:underline font-medium">support@focusd.so</a>.
          </p>
        </section>

        {/* 9. Children’s Privacy */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-foreground">9. Children’s Privacy</h2>
          <p className="text-foreground leading-relaxed">
            Focusd is not intended for individuals under the age of 18. We do not knowingly collect personal data from children.
          </p>
        </section>

        {/* 10. Changes to This Privacy Policy */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-foreground">10. Changes to This Privacy Policy</h2>
          <p className="text-foreground leading-relaxed">
            We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated “Last updated” date. Continued use of the Service constitutes acceptance of the updated policy.
          </p>
        </section>

        {/* 11. Contact Us */}
        <section className="space-y-6 border-t pt-8">
          <h2 className="text-2xl font-semibold text-foreground">11. Contact Us</h2>
          <p className="text-foreground leading-relaxed">
            If you have any questions about this Privacy Policy or our data practices, contact us at:
          </p>
          <p className="text-foreground leading-relaxed">
            <a href="mailto:support@focusd.so" className="text-primary hover:underline font-medium">
              support@focusd.so
            </a>
          </p>
        </section>

        <div className="space-y-4 pt-8 text-center text-muted-foreground">
          <p>
            By using Focusd, you agree to this Privacy Policy and our Terms of Service.
          </p>
        </div>
      </div>
    </div>
  );
}

