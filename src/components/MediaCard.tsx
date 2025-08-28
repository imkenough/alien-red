import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, PlayCircle, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { getPosterUrl } from "@/lib/api";
import { useWatchlist } from "@/contexts/WatchlistContext";
import { MediaType, ContinueWatchingItem } from "@/lib/types";

interface MediaCardProps {
  id: number;
  title: string;
  posterPath: string | undefined;
  rating: number;
  mediaType: MediaType;
  year?: string;
  className?: string;
  continueWatchingData?: ContinueWatchingItem;
  onRemoveContinueWatching?: () => void;
}

const MediaCard = ({
  id,
  title,
  posterPath,
  rating,
  mediaType,
  year,
  className,
  continueWatchingData,
  onRemoveContinueWatching,
}: MediaCardProps) => {
  const { isInWatchlist, addToWatchlist, removeFromWatchlist } = useWatchlist();
  const inWatchlist = isInWatchlist(id);

  const handleWatchlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (inWatchlist) {
      removeFromWatchlist(id);
    } else {
      addToWatchlist({
        id,
        title,
        poster_path: posterPath === null ? undefined : posterPath,
        media_type: mediaType === "movie" ? "movie" : "tv",
        added_at: Date.now(),
        watched: false,
        watch_later: false,
      });
    }
  };

  const handleRemoveContinueWatching = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onRemoveContinueWatching?.();
  };

  const formattedRating = rating > 0 ? rating.toFixed(1) : "N/A";

  return (
    <div className="relative">
      {continueWatchingData && onRemoveContinueWatching && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 h-8 w-8 rounded-full bg-background/60 text-foreground hover:text-destructive hover:bg-background/80 z-10"
          onClick={handleRemoveContinueWatching}
        >
          <X className="h-4 w-4" />
        </Button>
      )}
      <Link
        to={`/${mediaType}/${id}`}
        state={
          continueWatchingData ? { continueWatchingData, play: true } : undefined
        }
      >
        <Card
          className={cn(
            "overflow-hidden transition-all duration-300 group hover:scale-[1.02] sm:hover:scale-105 hover:shadow-lg border-0 bg-transparent",
            className
          )}
        >
          <div className="relative w-full aspect-[2/3] overflow-hidden rounded-md">
            {posterPath ? (
              <img
                src={getPosterUrl(posterPath, "w342") || undefined}
                alt={title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-muted text-sm sm:text-base">
                No Poster
              </div>
            )}

            <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-2 sm:p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1 bg-background/60 rounded-full px-1.5 sm:px-2 py-0.5 sm:py-1 text-[10px] sm:text-xs">
                  <span className="text-foreground capitalize">
                    {mediaType}
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 sm:h-8 sm:w-8 rounded-full bg-background/60 text-foreground hover:text-primary hover:bg-background/80"
                    onClick={handleWatchlistToggle}
                  >
                    <Heart
                      className={cn(
                        "h-3 w-3 sm:h-4 sm:w-4",
                        inWatchlist ? "fill-red-500 text-red-500" : ""
                      )}
                    />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <CardContent className="p-1.5 sm:p-2">
            <h3 className="text-xs sm:text-sm font-medium line-clamp-1 mt-0.5 sm:mt-1 text-foreground">
              {title}
            </h3>
            <div className="flex items-center justify-between mt-0.5 sm:mt-1">
              <p className="text-[10px] sm:text-xs text-muted-foreground">
                {year}
              </p>
              {rating > 0 && (
                <div className="flex items-center">
                  <span className="text-[10px] sm:text-xs text-yellow-500 mr-0.5 sm:mr-1">
                    ★
                  </span>
                  <span className="text-[10px] sm:text-xs text-foreground">
                    {formattedRating}
                  </span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </Link>
    </div>
  );
};

export default MediaCard;
