import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Cat } from "lucide-react";
import { FaDiscord, FaInstagram, FaEnvelope} from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";

const AboutPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <>
      <Helmet>
        <title>About Alien - Streaming Platform</title>
        <meta
          name="description"
          content="Learn more about Alien, our mission, data sources, and commitment to providing a modern streaming experience."
        />
        <meta property="og:title" content="About Alien - Streaming Platform" />
        <meta
          property="og:description"
          content="Learn more about Alien, our mission, data sources, and commitment to providing a modern streaming experience."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://alienred.ddnsfree.com/about" />
        <meta property="og:image" content="/favicon.svg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="About Alien - Streaming Platform" />
        <meta
          name="twitter:description"
          content="Learn more about Alien, our mission, data sources, and commitment to providing a modern streaming experience."
        />
        <meta name="twitter:image" content="/favicon.svg" />
      </Helmet>
      <div className="container px-4 sm:px-6 md:px-8 py-8 sm:py-12 md:py-16">
        <Button variant="ghost" className="mb-8" onClick={() => navigate(-1)}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">About Us</h1>

          <div className="prose prose-invert max-w-none space-y-8">
            <section>
              <div>
                <h2 className="text-2xl font-semibold mb-4">Kenny made this</h2>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
              <p>
                There is no mission, i just made this website for fun. I like
                making stuff. Also yes the logo of the website is a cigarette.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Ads</h2>
              <p>
                I have nothing to do with the ads, they're because of the api
                providers. Use adblocker or something.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">What Alien Does</h2>
              <p>Alien is a modern streaming platform that offers:</p>
              <ul className="list-disc pl-6 mt-4 space-y-2">
                <li>Extensive collection of movies and TV shows</li>
                <li>Personalized recommendations</li>
                <li>Easy-to-use watchlist feature</li>
                <li>Continue watching functionality</li>
                <li>Advanced search capabilities</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Data Source</h2>
              <p>
                I sourced the following media data from TMDb (The Movie
                Database), ensuring accurate and up-to-date information about
                movies and TV shows. It's free. Please don't cut my API access
                TMDB.
              </p>
              <ul className="list-disc pl-6 mt-4 space-y-2">
                <li>Cast and crew information</li>
                <li>Release dates and ratings</li>
                <li>Plot summaries and reviews</li>
                <li>High-quality images and posters</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Our Commitment</h2>
              <p>We are committed to:</p>
              <ul className="list-disc pl-6 mt-4 space-y-2">
                <li>doing ur mom lol</li>
                {/* <li>Protecting user privacy</li>
                <li>Continuous improvement of our platform</li> */}
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Socials</h2>
              <p></p>
              {/* <ul className="list-disc pl-6 mt-4 space-y-2">
                <li>
                  Instagram:{" "}
                  <a
                    href="https://www.instagram.com/ryangoslingoffical__/"
                    className="text-primary hover:underline"
                  >
                    @ryangoslingoffical__
                  </a>
                  <sup> *jk i'm pbviously not Ryan Gosling</sup>
                </li>
              </ul> */}
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
            </section>

            {/* <section>
              <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
              <p>Have questions, suggestions, or feedback?</p>
            </section> */}
          </div>
        </div>
      </div>
    </>
  );
};

export default AboutPage;
