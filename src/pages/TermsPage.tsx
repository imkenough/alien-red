import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Helmet } from 'react-helmet-async';

const TermsPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <>
      <Helmet>
        <title>Terms of Service - Alien Streaming</title>
        <meta name="description" content="Read the terms of service for Alien. Understand the rules and guidelines for using this site." />
        <meta property="og:title" content="Terms of Service - Alien Streaming" />
        <meta property="og:description" content="Read the terms of service for Alien. Understand the rules and guidelines for using this site." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://yourdomain.com/terms" />
        <meta property="og:image" content="/favicon.svg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Terms of Service - Alien Streaming" />
        <meta name="twitter:description" content="Read the terms of service for Alien. Understand the rules and guidelines for using this site." />
        <meta name="twitter:image" content="/favicon.svg" />
      </Helmet>
      <div className="container px-4 sm:px-6 md:px-8 py-8 sm:py-12 md:py-16">
        <Button variant="ghost" className="mb-8" onClick={() => navigate(-1)}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Terms of Service</h1>

          <div className="prose prose-invert max-w-none space-y-8">
            <section>
              <h2 className="text-2xl font-semibold mb-4">
                Educational Purpose Disclaimer
              </h2>
              <p>
                This website is created and maintained solely for educational
                purposes. It is designed to demonstrate web development skills,
                user interface design, and API integration techniques. The site
                does not host, stream, or provide access to any copyrighted
                content.
              </p>
              <p className="mt-4">
                All content displayed on this website is for demonstration
                purposes only and is sourced from publicly available APIs. This
                project is not intended for commercial use or distribution of
                copyrighted materials.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">
                1. Acceptance of Terms
              </h2>
              <p>
                By accessing and using this website, you agree to be bound by
                these Terms of Service and all applicable laws and regulations. If
                you do not agree with any of these terms, you are prohibited from
                using or accessing this site.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">
                2. Educational Use Only
              </h2>
              <p>
                This website is provided as an educational demonstration project.
                All materials and content are for learning and demonstration
                purposes only. Under this license you may not:
              </p>
              <ul className="list-disc pl-6 mt-4 space-y-2">
                <li>Use the materials for any commercial purpose</li>
                <li>
                  Attempt to decompile or reverse engineer any software contained
                  on the website
                </li>
                <li>
                  Remove any copyright or other proprietary notations from the
                  materials
                </li>
                <li>
                  Transfer the materials to another person or "mirror" the
                  materials on any other server
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">
                3. Content Disclaimer
              </h2>
              <p>
                This website does not host, stream, or provide access to any
                copyrighted content. All media information displayed is sourced
                from publicly available APIs for demonstration purposes only. We
                do not condone or support any form of copyright infringement or
                piracy.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">
                4. Third-Party Content
              </h2>
              <p>
                Any third-party content or links displayed on this website are for
                educational purposes only. We do not endorse or claim ownership of
                any third-party content. Users are responsible for ensuring they
                comply with all applicable laws and regulations when accessing
                third-party content.
              </p>
            </section>

            {/* <section>
              <h2 className="text-2xl font-semibold mb-4">5. Modifications</h2>
              <p>
                We may revise these terms of service at any time without notice.
                By using this website, you are agreeing to be bound by the then
                current version of these terms of service.
              </p>
            </section> */}

            {/* <section>
              <h2 className="text-2xl font-semibold mb-4">6. Contact</h2>
              <p>
                For any questions or concerns regarding these terms or the
                educational nature of this project, please contact the site
                administrator.
              </p>
            </section> */}
          </div>
        </div>
      </div>
    </>
  );
};

export default TermsPage;
