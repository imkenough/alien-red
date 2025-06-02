import React, { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Movie } from "@/lib/types";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MediaCard from "@/components/MediaCard";

const MoviesPage: React.FC = () => {
  const [popularMovies, setPopularMovies] = useState<Movie[]>([]);
  const [trendingMovies, setTrendingMovies] = useState<Movie[]>([]);
  const [topRatedMovies, setTopRatedMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("popular");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const fetchMovies = async () => {
      setIsLoading(true);
      try {
        let data;
        if (activeTab === "trending") {
          data = await api.getTrending("movie", "week", page);
        } else if (activeTab === "top-rated") {
          data = await api.getTopRated("movie", page);
        } else {
          data = await api.getPopular("movie", page);
        }

        const moviesWithType: Movie[] = data.results.map((movie: any) => ({
          ...movie,
          media_type: "movie",
        }));

        if (activeTab === "trending") {
          setTrendingMovies(
            page === 1 ? moviesWithType : [...trendingMovies, ...moviesWithType]
          );
        } else if (activeTab === "top-rated") {
          setTopRatedMovies(
            page === 1 ? moviesWithType : [...topRatedMovies, ...moviesWithType]
          );
        } else {
          setPopularMovies(
            page === 1 ? moviesWithType : [...popularMovies, ...moviesWithType]
          );
        }

        setTotalPages(Math.min(data.total_pages, 10)); // Limit to 10 pages
      } catch (error) {
        console.error("Error fetching movies:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovies();
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

  const getActiveMovies = () => {
    switch (activeTab) {
      case "trending":
        return trendingMovies;
      case "top-rated":
        return topRatedMovies;
      default:
        return popularMovies;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="px-4 sm:px-6 md:px-8 pt-24 pb-12">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8">Movies</h1>

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
            <MovieGrid
              movies={getActiveMovies()}
              isLoading={isLoading && page === 1}
            />
          </TabsContent>

          <TabsContent value="trending" className="mt-0">
            <MovieGrid
              movies={getActiveMovies()}
              isLoading={isLoading && page === 1}
            />
          </TabsContent>

          <TabsContent value="top-rated" className="mt-0">
            <MovieGrid
              movies={getActiveMovies()}
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

interface MovieGridProps {
  movies: Movie[];
  isLoading: boolean;
}

const MovieGrid: React.FC<MovieGridProps> = ({ movies, isLoading }) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8 sm:py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
      {movies.map((movie) => (
        <MediaCard
          key={`movie-${movie.id}`}
          id={movie.id}
          title={movie.title || "Unknown"}
          posterPath={movie.poster_path}
          rating={movie.vote_average}
          mediaType="movie"
          year={movie.release_date?.substring(0, 4)}
        />
      ))}
    </div>
  );
};

export default MoviesPage;
