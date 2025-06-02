import React, { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { TVShow } from "@/lib/types";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MediaCard from "@/components/MediaCard";

const TVShowsPage: React.FC = () => {
  const [popularShows, setPopularShows] = useState<TVShow[]>([]);
  const [trendingShows, setTrendingShows] = useState<TVShow[]>([]);
  const [topRatedShows, setTopRatedShows] = useState<TVShow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("popular");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const fetchTVShows = async () => {
      setIsLoading(true);
      try {
        let data;
        if (activeTab === "trending") {
          data = await api.getTrending("tv", "week", page);
        } else if (activeTab === "top-rated") {
          data = await api.getTopRated("tv", page);
        } else {
          data = await api.getPopular("tv", page);
        }

        const showsWithType: TVShow[] = data.results.map((show: any) => ({
          ...show,
          media_type: "tv",
        }));

        if (activeTab === "trending") {
          setTrendingShows(
            page === 1 ? showsWithType : [...trendingShows, ...showsWithType]
          );
        } else if (activeTab === "top-rated") {
          setTopRatedShows(
            page === 1 ? showsWithType : [...topRatedShows, ...showsWithType]
          );
        } else {
          setPopularShows(
            page === 1 ? showsWithType : [...popularShows, ...showsWithType]
          );
        }

        setTotalPages(Math.min(data.total_pages, 10)); // Limit to 10 pages
      } catch (error) {
        console.error("Error fetching TV shows:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTVShows();
  }, [activeTab, page]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setPage(1); // Reset to first page when changing tabs
  };

  const handleLoadMore = () => {
    if (page < totalPages) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  const getActiveShows = () => {
    switch (activeTab) {
      case "trending":
        return trendingShows;
      case "top-rated":
        return topRatedShows;
      default:
        return popularShows;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="px-4 sm:px-6 md:px-8 pt-24 pb-12">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8">
          TV Shows
        </h1>

        <Tabs
          defaultValue="popular"
          value={activeTab}
          onValueChange={handleTabChange}
        >
          <TabsList className="mb-4 sm:mb-6">
            <TabsTrigger value="popular">Popular</TabsTrigger>
            <TabsTrigger value="trending">Trending</TabsTrigger>
            <TabsTrigger value="top-rated">Top Rated</TabsTrigger>
          </TabsList>

          <TabsContent value="popular" className="mt-0">
            <TVShowGrid
              shows={getActiveShows()}
              isLoading={isLoading && page === 1}
            />
          </TabsContent>

          <TabsContent value="trending" className="mt-0">
            <TVShowGrid
              shows={getActiveShows()}
              isLoading={isLoading && page === 1}
            />
          </TabsContent>

          <TabsContent value="top-rated" className="mt-0">
            <TVShowGrid
              shows={getActiveShows()}
              isLoading={isLoading && page === 1}
            />
          </TabsContent>
        </Tabs>

        {page < totalPages && (
          <div className="mt-6 sm:mt-8 flex justify-center">
            <Button
              onClick={handleLoadMore}
              disabled={isLoading}
              className="min-w-[150px]"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Loading...
                </>
              ) : (
                "Load More"
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

interface TVShowGridProps {
  shows: TVShow[];
  isLoading: boolean;
}

const TVShowGrid: React.FC<TVShowGridProps> = ({ shows, isLoading }) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8 sm:py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
      {shows.map((show) => (
        <MediaCard
          key={`tv-${show.id}`}
          id={show.id}
          title={show.name || "Unknown"}
          posterPath={show.poster_path}
          rating={show.vote_average}
          mediaType="tv"
          year={show.first_air_date?.substring(0, 4)}
        />
      ))}
    </div>
  );
};

export default TVShowsPage;
