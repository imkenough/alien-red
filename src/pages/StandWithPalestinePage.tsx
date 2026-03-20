import React from "react";
import { Helmet } from "react-helmet-async";
import { ExternalLink, ArrowLeft, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const StandWithPalestinePage: React.FC = () => {
  const sections = [
    {
      title: "International Law & Court Rulings",
      links: [
        {
          label:
            "ICJ 2024 Advisory Opinion - Israel's occupation ruled illegal",
          url: "https://www.icj-cij.org/case/192",
        },
        {
          label:
            "ICJ 2004 Advisory Opinion - Israeli settlements ruled illegal",
          url: "https://www.icj-cij.org/case/131",
        },
        {
          label:
            "UN Security Council Resolution 2334 - Settlements violate international law",
          url: "https://undocs.org/S/RES/2334(2016)",
        },
      ],
    },
    {
      title: "UN Bodies & Reports",
      links: [
        {
          label:
            "UN Commission of Inquiry - Occupation unlawful under international law (2022)",
          url: "https://www.ohchr.org/en/press-releases/2022/10/commission-inquiry-finds-israeli-occupation-unlawful-under-international-law",
        },
        {
          label:
            "UN Legal Study - Israel's occupation exceeds legitimate self-defence (2023)",
          url: "https://www.un.org/unispal/document/ceirpp-legal-study2023/",
        },
        {
          label: "UN Question of Palestine - Full historical background",
          url: "https://www.un.org/unispal/history",
        },
      ],
    },
    {
      title: "Human Rights Organizations",
      links: [
        {
          label: "Amnesty International - Israel's occupation and apartheid",
          url: "https://www.amnesty.org/en/projects/israels-occupation-of-palestinian-territory/",
        },
        {
          label: "Human Rights Watch - Occupation documentation",
          url: "https://www.hrw.org/topic/israel-and-palestine",
        },
      ],
    },
    {
      title: "General Explainers",
      links: [
        {
          label:
            "Al Jazeera - What is the Israel-Palestine conflict? A simple guide",
          url: "https://www.aljazeera.com/news/2023/10/9/whats-the-israel-palestine-conflict-about-a-simple-guide",
        },
      ],
    },
  ];

  return (
    <>
      <Helmet>
        <title>Why We Stand With Palestine - Alien</title>
        <meta
          name="description"
          content="Understanding the legal and humanitarian case for the Palestinian cause through primary sources and international law."
        />
      </Helmet>
      <div className="min-h-screen pt-20 sm:pt-24 pb-12 sm:pb-16">
        <div className="container max-w-4xl px-4 sm:px-6">
          <Link to="/">
            <Button
              variant="ghost"
              className="mb-6 sm:mb-8 hover:bg-white/5 -ml-2 text-sm sm:text-base"
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
            </Button>
          </Link>

          <div className="space-y-8 sm:space-y-10">
            <header className="space-y-4">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent leading-tight">
                Why We Stand With Palestine
              </h1>
              <div className="prose prose-invert max-w-none text-base sm:text-lg text-muted-foreground leading-relaxed space-y-4">
                <p>
                  This is not just a gesture. The Palestinian cause is one of
                  the most thoroughly documented human rights issues of our time
                  - ruled on by international courts, investigated by
                  independent bodies, and confirmed even by Israel's own
                  classified legal documents.
                </p>
                <p>
                  Below are primary sources - not opinion pieces, that lay out
                  the legal and humanitarian case clearly.
                </p>
              </div>
            </header>

            {/* New Politics Section */}
            <section className="space-y-6 py-8 border-y border-border/50">
              <h2 className="text-2xl sm:text-3xl font-bold italic">
                "I'm not really into politics."
              </h2>
              <div className="prose prose-invert max-w-none text-base sm:text-lg text-muted-foreground leading-relaxed space-y-4">
                <p>
                  Cool. Neither were the people who looked the other way during
                  every other atrocity in history.
                </p>
                <p>
                  You don't have to have an opinion on tax policy or
                  parliamentary procedure. But when international courts, UN
                  investigators, and human rights organizations all reach the
                  same conclusion - that an occupation is illegal, that war
                  crimes are being committed, that children are being killed -
                  "not being into politics" is just a more comfortable way of
                  saying you've chosen a side. The side that benefits from your
                  silence.
                </p>
                <p className="font-medium text-foreground">
                  In the immortal words of Jonathan Pie:
                </p>
              </div>
              <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-border/50 bg-black shadow-2xl">
                <iframe
                  className="absolute inset-0 h-full w-full"
                  src="https://www.youtube.com/embed/PpC1joydTFo?autoplay=1&mute=1&cc_load_policy=1"
                  title="You’re not really into politics?"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                ></iframe>
              </div>{" "}
            </section>

            <div className="grid gap-10 sm:gap-12 mt-8 sm:mt-12">
              {sections.map((section) => (
                <section key={section.title} className="space-y-4">
                  <h2 className="text-xl sm:text-2xl font-semibold border-b border-border/50 pb-2">
                    {section.title}
                  </h2>
                  <ul className="grid gap-3">
                    {section.links.map((link) => (
                      <li key={link.url}>
                        <a
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group flex items-start justify-between p-4 rounded-lg bg-card hover:bg-accent/50 border border-border/50 transition-all gap-3"
                        >
                          <span className="text-sm sm:text-base font-medium group-hover:text-primary transition-colors line-clamp-2 sm:line-clamp-none">
                            {link.label}
                          </span>
                          <ExternalLink className="h-4 w-4 shrink-0 mt-1 opacity-50 group-hover:opacity-100 transition-opacity" />
                        </a>
                      </li>
                    ))}
                  </ul>
                </section>
              ))}
            </div>

            <footer className="mt-12 sm:mt-16 pt-8 border-t border-border/50 space-y-6">
              <div className="p-5 sm:p-8 rounded-xl bg-primary/5 border border-primary/20 space-y-4">
                <div className="flex items-center gap-2 text-primary">
                  <Heart className="h-5 w-5 fill-current" />
                  <h3 className="text-lg sm:text-xl font-semibold">
                    Do more than read
                  </h3>
                </div>
                <p className="text-sm sm:text-base text-muted-foreground">
                  If you want to do more than read, consider supporting these
                  organizations providing critical aid:
                </p>
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-6">
                  <Button
                    asChild
                    variant="default"
                    className="w-full sm:w-auto"
                  >
                    <a
                      href="https://www.pcrf.net/"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Support PCRF
                    </a>
                  </Button>
                  <Button
                    asChild
                    variant="default"
                    className="w-full sm:w-auto"
                  >
                    <a
                      href="https://www.unrwa.org/"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Support UNRWA
                    </a>
                  </Button>
                </div>
              </div>
            </footer>
          </div>
        </div>
      </div>
    </>
  );
};

export default StandWithPalestinePage;
