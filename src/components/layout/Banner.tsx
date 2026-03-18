import React from "react";
import { X, Info } from "lucide-react";
import { useLayout } from "@/contexts/LayoutContext";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const Banner: React.FC = () => {
  const { bannerMessage, isBannerVisible, setBannerVisible } = useLayout();

  if (!isBannerVisible || !bannerMessage) return null;

  return (
    <div className="relative z-[110] bg-primary text-primary-foreground py-2 px-4 shadow-md overflow-hidden animate-in fade-in slide-in-from-top duration-500">
      <div className="container mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Info className="h-4 w-4 shrink-0 opacity-90" />
          <p className="text-sm font-medium leading-tight">
            {bannerMessage}
          </p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 text-primary-foreground hover:bg-white/20 hover:text-primary-foreground shrink-0 rounded-full"
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
