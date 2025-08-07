import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
import { FaDiscord, FaInstagram, FaEnvelope} from "react-icons/fa6";
import { Helmet } from 'react-helmet-async';

const ContactPage: React.FC = () => {
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    alert("Thank you for your message! We'll get back to you soon.");
  };

  return (
    <>
      <Helmet>
        <title>Contact - Alien Streaming</title>
        <meta name="description" content="Contact the Alien team for questions, suggestions, or feedback. Get in touch with us here." />
        <meta property="og:title" content="Contact - Alien Streaming" />
        <meta property="og:description" content="Contact the Alien team for questions, suggestions, or feedback. Get in touch with us here." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://alienred.ddnsfree.com/contact" />
        <meta property="og:image" content="/favicon.svg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Contact - Alien Streaming" />
        <meta name="twitter:description" content="Contact the Alien team for questions, suggestions, or feedback. Get in touch with us here." />
        <meta name="twitter:image" content="/favicon.svg" />
      </Helmet>
      <div className="container px-4 sm:px-6 md:px-8 py-8 sm:py-12 md:py-16">
        <Button variant="ghost" className="mb-8" onClick={() => navigate(-1)}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Contact Us</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-xl font-semibold mb-4">Get in Touch</h2>
              <p className="text-muted-foreground mb-6">
                Have questions, suggestions, or feedback? Mail me? or discord!
              </p>

              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <FaEnvelope className="h-5 w-5 text-primary" />
                  <a
                    href="mailto:redjohn9818@proton.me"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    redjohn9818@proton.me
                  </a>
                </div>
                <div className="flex items-center space-x-3">
                  <FaDiscord className="h-5 w-5 text-primary" />
                  <a
                    href="https://discord.com/users/clueless1006"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    clueless1006
                  </a>
                </div>
                <div className="flex items-center space-x-3">
                  <FaInstagram className="h-5 w-5 text-primary" />
                  <a
                    href="https://www.instagram.com/ryangoslingoffical__/"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    @ryangoslingoffical__
                  </a>
                  <sup> *jk i'm pbviously not Ryan Gosling</sup>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ContactPage;
