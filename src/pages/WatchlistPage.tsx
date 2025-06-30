import React, { useState } from "react";
import { useWatchlist } from "@/contexts/WatchlistContext";
import MediaCard from "@/components/MediaCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  X,
  Check,
  Clock,
  Star,
  Filter,
  SortAsc,
  SortDesc,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { WatchlistFilterOptions } from "@/lib/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Helmet } from 'react-helmet-async';

const WatchlistPage: React.FC = () => {
  const {
    watchlist,
    continueWatching,
    removeFromWatchlist,
    removeFromContinueWatching,
    toggleWatched,
    toggleWatchLater,
    updateRating,
    getFilteredWatchlist,
    isLoading,
  } = useWatchlist();
  const navigate = useNavigate();

  const [filterOptions, setFilterOptions] = useState<WatchlistFilterOptions>({
    showWatched: true,
    showWatchLater: true,
    sortBy: "added",
    sortOrder: "desc",
    mediaType: "all",
  });

  const filteredWatchlist = getFilteredWatchlist(filterOptions);

  const handleSortChange = (value: string) => {
    const [sortBy, sortOrder] = value.split("-");
    setFilterOptions((prev) => ({
      ...prev,
      sortBy: sortBy as "added" | "title" | "rating",
      sortOrder: sortOrder as "asc" | "desc",
    }));
  };

  const handleMediaTypeChange = (value: string) => {
    setFilterOptions((prev) => ({
      ...prev,
      mediaType: value as "movie" | "tv" | "all",
    }));
  };

  if (isLoading) {
    return (
      <div className="container pt-24 pb-12 flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading your watchlist...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>My Watchlist - Alien Streaming</title>
        <meta name="description" content="View and manage your personal watchlist. Keep track of movies and TV shows you want to watch on Alien." />
        <meta property="og:title" content="My Watchlist - Alien Streaming" />
        <meta property="og:description" content="View and manage your personal watchlist. Keep track of movies and TV shows you want to watch on Alien." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://yourdomain.com/watchlist" />
        <meta property="og:image" content="/favicon.svg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="My Watchlist - Alien Streaming" />
        <meta name="twitter:description" content="View and manage your personal watchlist. Keep track of movies and TV shows you want to watch on Alien." />
        <meta name="twitter:image" content="/favicon.svg" />
      </Helmet>
      <div className="container pt-24 pb-12">
        <h1 className="text-3xl font-bold mb-8">My Lists</h1>

        <Tabs defaultValue="watchlist">
          <TabsList className="mb-6">
            <TabsTrigger value="watchlist">Watchlist</TabsTrigger>
            <TabsTrigger value="continue-watching">Continue Watching</TabsTrigger>
          </TabsList>

          <TabsContent value="watchlist" className="mt-0">
            <div className="flex flex-wrap gap-4 mb-6">
              <div className="flex items-center space-x-2">
                <Switch
                  id="show-watched"
                  checked={filterOptions.showWatched}
                  onCheckedChange={(checked) =>
                    setFilterOptions((prev) => ({
                      ...prev,
                      showWatched: checked,
                    }))
                  }
                />
                <Label htmlFor="show-watched">Show Watched</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="show-watch-later"
                  checked={filterOptions.showWatchLater}
                  onCheckedChange={(checked) =>
                    setFilterOptions((prev) => ({
                      ...prev,
                      showWatchLater: checked,
                    }))
                  }
                />
                <Label htmlFor="show-watch-later">Show Watch Later</Label>
              </div>

              <Select
                value={`${filterOptions.sortBy}-${filterOptions.sortOrder}`}
                onValueChange={handleSortChange}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="added-desc">Recently Added</SelectItem>
                  <SelectItem value="added-asc">Oldest First</SelectItem>
                  <SelectItem value="title-asc">Title A-Z</SelectItem>
                  <SelectItem value="title-desc">Title Z-A</SelectItem>
                  <SelectItem value="rating-desc">Highest Rated</SelectItem>
                  <SelectItem value="rating-asc">Lowest Rated</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={filterOptions.mediaType}
                onValueChange={handleMediaTypeChange}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Media Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="movie">Movies</SelectItem>
                  <SelectItem value="tv">TV Shows</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {filteredWatchlist.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {filteredWatchlist.map((item) => (
                  <div key={item.id} className="relative group">
                    <MediaCard
                      id={item.id}
                      title={item.title}
                      posterPath={item.poster_path}
                      rating={item.rating || 0}
                      mediaType={item.media_type}
                      className="transition-all duration-300"
                    />
                    <div className="absolute top-2 right-2 flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className={cn(
                          "h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity",
                          item.watched
                            ? "text-green-500"
                            : "text-muted-foreground"
                        )}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          toggleWatched(item.id);
                        }}
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className={cn(
                          "h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity",
                          item.watch_later
                            ? "text-yellow-500"
                            : "text-muted-foreground"
                        )}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          toggleWatchLater(item.id);
                        }}
                      >
                        <Clock className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="icon"
                        className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          removeFromWatchlist(item.id);
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <h2 className="text-xl font-medium mb-2">
                  Your watchlist is empty
                </h2>
                <p className="text-muted-foreground mb-6">
                  Add movies and TV shows to your watchlist to keep track of what
                  you want to watch.
                </p>
                <Button onClick={() => navigate("/")}>Browse Content</Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="continue-watching" className="mt-0">
            {continueWatching.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {continueWatching.map((item) => (
                  <div key={item.id} className="relative group">
                    <MediaCard
                      id={item.id}
                      title={item.title}
                      posterPath={item.poster_path}
                      rating={0}
                      mediaType={item.media_type}
                      className="transition-all duration-300"
                      continueWatchingData={item}
                      onRemoveContinueWatching={() =>
                        removeFromContinueWatching(item.id)
                      }
                    />

                    {/* Progress bar */}
                    <div className="absolute bottom-14 left-0 right-0 bg-background/80 h-1">
                      <div
                        className="h-full bg-primary"
                        style={{ width: `${item.progress}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <h2 className="text-xl font-medium mb-2">
                  You haven't watched anything yet
                </h2>
                <p className="text-muted-foreground mb-6">
                  Your recently watched movies and TV shows will appear here.
                </p>
                <Button onClick={() => navigate("/")}>Browse Content</Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default WatchlistPage;
