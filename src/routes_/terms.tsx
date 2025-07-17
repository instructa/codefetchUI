import { Link, createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/terms')({
  component: TermsPage,
});

function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold tracking-tight">Terms of Service</h1>
            <p className="text-muted-foreground text-lg">
              Last updated:{' '}
              {new Date().toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>

          <div className="prose prose-gray dark:prose-invert max-w-none">
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">1. Acceptance of Terms</h2>
              <p className="text-muted-foreground leading-relaxed">
                By accessing and using CodeFetch, you accept and agree to be bound by the terms and
                provision of this agreement.
              </p>
            </section>

            <section className="space-y-4 mt-8">
              <h2 className="text-2xl font-semibold">2. Use License</h2>
              <p className="text-muted-foreground leading-relaxed">
                Permission is granted to temporarily use CodeFetch for personal, non-commercial
                transitory viewing only. This is the grant of a license, not a transfer of title,
                and under this license you may not:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>modify or copy the materials</li>
                <li>use the materials for any commercial purpose or for any public display</li>
                <li>attempt to reverse engineer any software contained on CodeFetch</li>
                <li>remove any copyright or other proprietary notations from the materials</li>
              </ul>
            </section>

            <section className="space-y-4 mt-8">
              <h2 className="text-2xl font-semibold">3. Disclaimer</h2>
              <p className="text-muted-foreground leading-relaxed">
                The materials on CodeFetch are provided on an 'as is' basis. CodeFetch makes no
                warranties, expressed or implied, and hereby disclaims and negates all other
                warranties including, without limitation, implied warranties or conditions of
                merchantability, fitness for a particular purpose, or non-infringement of
                intellectual property or other violation of rights.
              </p>
            </section>

            <section className="space-y-4 mt-8">
              <h2 className="text-2xl font-semibold">4. Limitations</h2>
              <p className="text-muted-foreground leading-relaxed">
                In no event shall CodeFetch or its suppliers be liable for any damages (including,
                without limitation, damages for loss of data or profit, or due to business
                interruption) arising out of the use or inability to use CodeFetch, even if
                CodeFetch or a CodeFetch authorized representative has been notified orally or in
                writing of the possibility of such damage. Because some jurisdictions do not allow
                limitations on implied warranties, or limitations of liability for consequential or
                incidental damages, these limitations may not apply to you.
              </p>
            </section>

            <section className="space-y-4 mt-8">
              <h2 className="text-2xl font-semibold">5. Privacy Policy</h2>
              <p className="text-muted-foreground leading-relaxed">
                Your use of CodeFetch is also governed by our Privacy Policy. Please review our
                Privacy Policy, which also governs the Site and informs users of our data collection
                practices.
              </p>
            </section>

            <section className="space-y-4 mt-8">
              <h2 className="text-2xl font-semibold">6. Governing Law</h2>
              <p className="text-muted-foreground leading-relaxed">
                These terms and conditions are governed by and construed in accordance with the laws
                of the United States and you irrevocably submit to the exclusive jurisdiction of the
                courts in that State or location.
              </p>
            </section>

            <section className="space-y-4 mt-8">
              <h2 className="text-2xl font-semibold">7. Changes to Terms</h2>
              <p className="text-muted-foreground leading-relaxed">
                CodeFetch reserves the right, at our sole discretion, to modify or replace these
                Terms at any time. If a revision is material, we will provide at least 30 days
                notice prior to any new terms taking effect.
              </p>
            </section>

            <section className="space-y-4 mt-8">
              <h2 className="text-2xl font-semibold">Contact Information</h2>
              <p className="text-muted-foreground leading-relaxed">
                If you have any questions about these Terms, please contact us at:
              </p>
              <p className="text-muted-foreground">
                Email: legal@codefetch.com
                <br />
                Address: [Your Company Address]
              </p>
            </section>
          </div>

          <div className="flex justify-center pt-8">
            <Link
              to="/"
              className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
