import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Helmet } from 'react-helmet-async';

const PrivacyPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <>
      <Helmet>
        <title>Privacy Policy - Alien Red</title>
        <meta name="description" content="Read the privacy policy for Alien. Learn how your data is handled and protected." />
        <meta property="og:title" content="Privacy Policy - Alien Streaming" />
        <meta property="og:description" content="Read the privacy policy for Alien. Learn how your data is handled and protected." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://alienred.ddnsfree.com/privacy" />
        <meta property="og:image" content="/favicon.svg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Privacy Policy - Alien Streaming" />
        <meta name="twitter:description" content="Read the privacy policy for Alien. Learn how your data is handled and protected." />
        <meta name="twitter:image" content="/favicon.svg" />
      </Helmet>
      <div className="container px-4 sm:px-6 md:px-8 py-8 sm:py-12 md:py-16">
        <Button variant="ghost" className="mb-8" onClick={() => navigate(-1)}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Privacy Policy</h1>

          <div
            className="prose prose-invert max-w-none space-y-8 prose-li:list-disc prose-li:ml-4"
          >
            <section>
              <h2 className="text-2xl font-semibold mb-4">Introduction</h2>
              <p>
                Welcome to Alien Red. We are committed to protecting your
                privacy. This Privacy Policy explains how we collect, use, and
                safeguard your information when you use our website.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">
                Information We Collect
              </h2>
              <p>
                We collect information that you provide to us directly, <em>such as when you create an account
                </em>. This information may include:
              </p>
              <ul>
                <li>Your name</li>
                <li>Your email address</li>
              </ul>
              <p>
                We use{' '}
                <a
                  href="https://supabase.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Supabase
                </a>{' '}
                for authentication and database services. Supabase may collect
                information about you on our behalf. You can learn more about
                Supabase's privacy practices by reading their{' '}
                <a
                  href="https://supabase.com/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Privacy Policy
                </a>
                .
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">
                How We Use Your Information
              </h2>
              <p>We use the information we collect to:</p>
              <ul>
                <li>Create and manage your account</li>
                <li>Provide, operate, and maintain our services</li>
                {/* <li>
                  Communicate with you, including for customer service
                </li> */}
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">
                Data Storage and Security
              </h2>
              <p>
                Your data is stored and managed by Supabase. Supabase implements a
                variety of security measures to maintain the safety of your
                personal information. You can learn more about Supabase's security
                practices{' '}
                <a
                  href="https://supabase.com/docs/guides/platform/security"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  here
                </a>
                .
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Your Data Rights</h2>
              <p>
                You have the right to access, update, or delete your personal
                information. If you wish to exercise any of these rights, please
                contact us.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">
                Changes to This Privacy Policy
              </h2>
              <p>
                We may update this Privacy Policy from time to time. We will
                notify you of any changes by posting the new Privacy Policy on
                this page.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
              <p>
                If you have any questions about this Privacy Policy, please
                {' '}
                <a
                  href="/contact"
                  target=""
                  rel="noopener noreferrer"
                >
                  contact us
                </a>.
              </p>
            </section>
          </div>
        </div>
      </div>
    </>
  );
};

export default PrivacyPage;
