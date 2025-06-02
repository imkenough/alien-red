import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const PrivacyPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="container px-4 sm:px-6 md:px-8 py-8 sm:py-12 md:py-16">
      <Button variant="ghost" className="mb-8" onClick={() => navigate(-1)}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>

      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Privacy Policy</h1>

        <div className="prose prose-invert max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-semibold mb-4">
              There is no information collected from you.
            </h2>
            <p>
              all watched movies and shows are saved to your browser. that's it,
              in the browser cookies; its called local storage.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPage;
