"use client"

import Link from "next/link"

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-black text-white">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@200;300;400;500&family=Playfair+Display:wght@200;300;400;500&display=swap');
        
        .luxury-heading {
          font-family: 'Playfair Display', serif;
          font-weight: 200;
          letter-spacing: -0.02em;
          line-height: 1.1;
        }
        
        .luxury-body {
          font-family: 'Inter', sans-serif;
          font-weight: 300;
          letter-spacing: 0.01em;
          line-height: 1.6;
        }
      `}</style>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="luxury-heading text-2xl font-light text-white hover:opacity-80 transition-opacity"
            >
              Qalm<span className="text-xs align-super text-white">™</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-6">
          <h1 className="luxury-heading text-4xl md:text-5xl font-light text-white mb-8">
            Privacy Policy & Terms of Use
          </h1>

          <div className="luxury-body text-white/90 space-y-8">
            <p className="text-lg">
              <strong>Effective Date:</strong> January 15, 2025
            </p>

            <section>
              <h2 className="luxury-heading text-2xl font-light text-white mb-4">1. Information We Collect</h2>
              <p className="mb-4">
                Qalm™ ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how
                we collect, use, and safeguard your information when you use our breathing and meditation application.
              </p>
              <p className="mb-4">
                <strong>Information You Provide:</strong> We may collect information you voluntarily provide, such as
                feedback, support requests, or account preferences.
              </p>
              <p>
                <strong>Automatically Collected Information:</strong> We may collect technical information such as
                device type, operating system, app usage patterns, and crash reports to improve our service.
              </p>
            </section>

            <section>
              <h2 className="luxury-heading text-2xl font-light text-white mb-4">2. How We Use Your Information</h2>
              <p className="mb-4">We use collected information to:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Provide and maintain the Qalm™ application</li>
                <li>Improve user experience and app functionality</li>
                <li>Respond to user inquiries and provide customer support</li>
                <li>Analyze usage patterns to enhance our services</li>
                <li>Ensure app security and prevent misuse</li>
              </ul>
            </section>

            <section>
              <h2 className="luxury-heading text-2xl font-light text-white mb-4">3. Information Sharing</h2>
              <p className="mb-4">
                We do not sell, trade, or rent your personal information to third parties. We may share information only
                in the following circumstances:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>With your explicit consent</li>
                <li>To comply with legal obligations or court orders</li>
                <li>To protect our rights, property, or safety, or that of our users</li>
                <li>
                  With trusted service providers who assist in app operations (under strict confidentiality agreements)
                </li>
              </ul>
            </section>

            <section>
              <h2 className="luxury-heading text-2xl font-light text-white mb-4">4. Data Security</h2>
              <p>
                We implement appropriate technical and organizational measures to protect your information against
                unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the
                internet or electronic storage is 100% secure.
              </p>
            </section>

            <section>
              <h2 className="luxury-heading text-2xl font-light text-white mb-4">5. Data Retention</h2>
              <p>
                We retain your information only as long as necessary to fulfill the purposes outlined in this Privacy
                Policy, comply with legal obligations, resolve disputes, and enforce our agreements.
              </p>
            </section>

            <section>
              <h2 className="luxury-heading text-2xl font-light text-white mb-4">6. Your Rights</h2>
              <p className="mb-4">Depending on your jurisdiction, you may have the right to:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Access, update, or delete your personal information</li>
                <li>Object to or restrict processing of your data</li>
                <li>Data portability</li>
                <li>Withdraw consent where processing is based on consent</li>
              </ul>
              <p className="mt-4">To exercise these rights, please contact us using the information provided below.</p>
            </section>

            <section>
              <h2 className="luxury-heading text-2xl font-light text-white mb-4">7. Children's Privacy</h2>
              <p>
                Qalm™ is not intended for children under 18 years of age. We do not knowingly collect personal
                information from children under 18. If we become aware that we have collected personal information from
                a child under 18, we will take steps to delete such information.
              </p>
            </section>

            <section>
              <h2 className="luxury-heading text-2xl font-light text-white mb-4">8. Wellness & Safety Notice</h2>
              <p>
                Qalm™ provides audio-visual content and guided breathing sequences designed for general relaxation and
                well-being. It is not a medical device and is not intended to diagnose, treat, or prevent any condition.
                Users with respiratory issues, neurological conditions (such as epilepsy), audio sensitivity, or other
                medical concerns should use the App with discretion. Discontinue use if you experience discomfort or
                adverse effects.
              </p>
            </section>

            <section>
              <h2 className="luxury-heading text-2xl font-light text-white mb-4">9. Policy Updates</h2>
              <p>
                We may update this Privacy Policy from time to time. We will notify you of any material changes by
                posting the new Privacy Policy within the app and updating the "Effective Date" above. Your continued
                use of Qalm™ after any changes constitutes acceptance of the updated policy.
              </p>
            </section>

            <section>
              <h2 className="luxury-heading text-2xl font-light text-white mb-4">10. Contact</h2>
              <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                <h3 className="luxury-heading text-xl font-light text-white mb-4">BNDR LLC</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <span className="text-lg">✉️</span>
                    <a
                      href="mailto:bndrbots@gmail.com"
                      className="text-white/90 hover:text-white transition-colors underline decoration-white/30 hover:decoration-white"
                    >
                      bndrbots@gmail.com
                    </a>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-lg">🖥️</span>
                    <a
                      href="https://bndrdesigns.carrd.co/#"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white/90 hover:text-white transition-colors underline decoration-white/30 hover:decoration-white"
                    >
                      BNDR LLC
                    </a>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
