import React, { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import MediaCard from "@/components/MediaCard";
import { Movie, TVShow } from "@/lib/types";
import { cn } from "@/lib/utils";

interface MediaCarouselProps {
  title: string;
  items: (Movie | TVShow)[];
  className?: string;
  renderItem?: (item: Movie | TVShow) => React.ReactNode;
}

const MediaCarousel: React.FC<MediaCarouselProps> = ({
  title,
  items,
  className,
  renderItem,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const updateScrollButtons = () => {
    if (containerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 10); // -10 for buffer
    }
  };

  useEffect(() => {
    updateScrollButtons();
    const container = containerRef.current;
    if (container) {
      container.addEventListener("scroll", updateScrollButtons);
    }

    // Watch for resize events
    const handleResize = () => {
      setTimeout(updateScrollButtons, 100);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      if (container) {
        container.removeEventListener("scroll", updateScrollButtons);
      }
      window.removeEventListener("resize", handleResize);
    };
  }, [items]);

  const scroll = (direction: "left" | "right") => {
    if (containerRef.current) {
      const { clientWidth } = containerRef.current;
      const scrollAmount = clientWidth * 0.8;

      containerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  if (!items.length) return null;

  return (
    <div className={cn("relative px-4 sm:px-6 md:px-8", className)}>
      <h2 className="text-xl font-bold text-foreground mb-4 text-center">
        {title}
      </h2>
      <div className="relative">
        {/* Left Arrow */}
        <button
          type="button"
          onClick={() => scroll("left")}
          className="absolute -left-4 sm:left-2 top-1/2 -translate-y-1/2 z-50 bg-black/80 text-white rounded-full p-2 shadow-lg transition hover:bg-black/90"
        >
          <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
        </button>
        {/* Right Arrow */}
        <button
          type="button"
          onClick={() => scroll("right")}
          className="absolute -right-4 sm:right-2 top-1/2 -translate-y-1/2 z-50 bg-black/80 text-white rounded-full p-2 shadow-lg transition hover:bg-black/90"
        >
          <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
        </button>
        <div
          ref={containerRef}
          className="flex space-x-3 sm:space-x-4 overflow-x-auto scrollbar-hide pb-4 -mx-4 sm:-mx-6 md:-mx-8 px-4 sm:px-6 md:px-8"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {items.map((item) => {
            if (renderItem) {
              return (
                <div
                  key={item.id}
                  className="flex-shrink-0 w-[140px] sm:w-[150px] md:w-[180px]"
                >
                  {renderItem(item)}
                </div>
              );
            }

            const mediaType =
              item.media_type || ("title" in item ? "movie" : "tv");
            const title = "title" in item ? item.title : item.name;
            const year =
              "release_date" in item
                ? item.release_date?.substring(0, 4)
                : item.first_air_date?.substring(0, 4);

            return (
              <div
                key={item.id}
                className="flex-shrink-0 w-[140px] sm:w-[150px] md:w-[180px]"
              >
                <MediaCard
                  id={item.id}
                  title={title || "Unknown"}
                  posterPath={
                    item.poster_path === null ? undefined : item.poster_path
                  }
                  rating={item.vote_average}
                  mediaType={mediaType as "movie" | "tv"}
                  year={year}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MediaCarousel;
