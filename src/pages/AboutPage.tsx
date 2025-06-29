import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Cat } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AboutPage: React.FC = () => {
  const navigate = useNavigate();

  return (
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
              I sourced the following media data from TMDb (The Movie Database),
              ensuring accurate and up-to-date information about movies and TV
              shows. It's free. Please don't cut my API access TMDB.
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
            <ul className="list-disc pl-6 mt-4 space-y-2">
              <li>
                GitHub:{" "}
                <a
                  href="https://github.com/imkenough"
                  className="text-primary hover:underline"
                >
                  @imkenough
                </a>
              </li>
              <li>
                Instagram:{" "}
                <a
                  href="https://www.instagram.com/ryangoslingoffical__/"
                  className="text-primary hover:underline"
                >
                  @ryangoslingoffical__
                </a>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
            <p>Have questions, suggestions, or feedback? stfu.</p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
