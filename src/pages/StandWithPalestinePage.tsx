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
      <div className="min-h-screen pt-24 pb-16">
        <div className="container max-w-4xl">
          <Link to="/">
            <Button variant="ghost" className="mb-8 hover:bg-white/5 -ml-2">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
            </Button>
          </Link>

          <div className="space-y-8">
            <header className="space-y-4">
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                Why We Stand With Palestine
              </h1>
              <div className="prose prose-invert max-w-none text-lg text-muted-foreground leading-relaxed">
                <p>
                  This is not just a gesture. The Palestinian cause is one of
                  the most thoroughly documented human rights issues of our time
                  - ruled on by international courts, investigated by
                  independent bodies, and confirmed even by Israel's own
                  classified legal documents.
                </p>
                <p>
                  Below are primary sources - not opinion pieces, articles and
                  documents that lay out the legal and humanitarian case
                  clearly.
                </p>
              </div>
            </header>

            <div className="grid gap-8 mt-12">
              {sections.map((section) => (
                <section key={section.title} className="space-y-4">
                  <h2 className="text-2xl font-semibold border-b border-border/50 pb-2">
                    {section.title}
                  </h2>
                  <ul className="grid gap-3">
                    {section.links.map((link) => (
                      <li key={link.url}>
                        <a
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group flex items-center justify-between p-4 rounded-lg bg-card hover:bg-accent/50 border border-border/50 transition-all"
                        >
                          <span className="text-sm md:text-base font-medium group-hover:text-primary transition-colors">
                            {link.label}
                          </span>
                          <ExternalLink className="h-4 w-4 shrink-0 opacity-50 group-hover:opacity-100 transition-opacity" />
                        </a>
                      </li>
                    ))}
                  </ul>
                </section>
              ))}
            </div>

            <footer className="mt-16 pt-8 border-t border-border/50 space-y-6">
              <div className="p-6 rounded-xl bg-primary/5 border border-primary/20 space-y-4">
                <div className="flex items-center gap-2 text-primary">
                  <Heart className="h-5 w-5 fill-current" />
                  <h3 className="text-xl font-semibold">Do more than read</h3>
                </div>
                <p className="text-muted-foreground">
                  If you want to do more than read, consider supporting these
                  organizations providing critical aid:
                </p>
                <div className="flex flex-wrap gap-4 mt-4">
                  <Button asChild variant="default">
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
                    variant="outline"
                    className="bg-transparent border-primary/50 text-primary hover:bg-primary/10"
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
