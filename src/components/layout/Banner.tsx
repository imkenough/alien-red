import React from "react";
import { X, ExternalLink } from "lucide-react";
import { useLayout } from "@/contexts/LayoutContext";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const PalestineFlag: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    width="24"
    height="16"
    viewBox="0 0 60 40"
    className={className}
    aria-hidden="true"
  >
    <rect width="60" height="13.33" fill="#000000" />
    <rect y="13.33" width="60" height="13.33" fill="#ffffff" />
    <rect y="26.66" width="60" height="13.33" fill="#149954" />
    <polygon points="0,0 25,20 0,40" fill="#e4312b" />
  </svg>
);

const Banner: React.FC = () => {
  const { bannerMessage, isBannerVisible, setBannerVisible } = useLayout();

  if (!isBannerVisible || !bannerMessage) return null;

  return (
    <div className="relative z-[110] bg-[#141414] text-white py-2 px-4 shadow-md border-b border-white/10 animate-in fade-in slide-in-from-top duration-500">
      <div className="container mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <PalestineFlag className="shrink-0 shadow-sm rounded-[1px]" />
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <p className="text-sm font-medium leading-tight">{bannerMessage}</p>
            <Link
              to="/stand-with-palestine"
              className="text-sm hover:underline flex items-center gap-0.5 transition-all"
            >
              Learn why
              <ExternalLink className="h-2.5 w-2.5" />
            </Link>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 text-white/70 hover:bg-white/10 hover:text-white shrink-0 rounded-full transition-colors"
          onClick={() => setBannerVisible(false)}
          aria-label="Dismiss banner"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default Banner;
