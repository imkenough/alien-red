import React, { useEffect, useState } from "react";
import MetaTags from "../components/MetaTags"; // Import MetaTags
import { api } from "@/lib/api";
import { Genre, Movie, TVShow } from "@/lib/types";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import MediaCard from "@/components/MediaCard";
import { useNavigate, useParams } from "react-router-dom";
import { Link } from "react-router-dom";

const GenresPage: React.FC = () => {
  const [movieGenres, setMovieGenres] = useState<Genre[]>([]);
  const [tvGenres, setTvGenres] = useState<Genre[]>([]);
  const [selectedGenre, setSelectedGenre] = useState<Genre | null>(null);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [tvShows, setTvShows] = useState<TVShow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("movie");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [sortBy, setSortBy] = useState("popularity.desc");
  const navigate = useNavigate();
  const { genreId } = useParams();

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const [movieGenresData, tvGenresData] = await Promise.all([
          api.getMovieGenres(),
          api.getTvGenres(),
        ]);
        setMovieGenres(movieGenresData);
        setTvGenres(tvGenresData);

        if (genreId) {
          // If genreId is provided in URL, find and select that genre
          const genre = [...movieGenresData, ...tvGenresData].find(
            (g) => g.id === parseInt(genreId)
          );
          if (genre) {
            setSelectedGenre(genre);
            // Check if the genre exists in both lists
            const isMovieGenre = movieGenresData.some(
              (g: Genre) => g.id === genre.id
            );
            const isTvGenre = tvGenresData.some(
              (g: Genre) => g.id === genre.id
            );

            // If the genre exists in both lists, maintain the current tab
            // Otherwise, set the tab based on where the genre exists
            if (isMovieGenre && isTvGenre) {
              // Keep the current tab
            } else {
              setActiveTab(isMovieGenre ? "movie" : "tv");
            }
          }
        } else if (movieGenresData.length > 0) {
          // If no genreId is provided, select the first movie genre by default
          setSelectedGenre(movieGenresData[0]);
          setActiveTab("movie");
          navigate(`/genres/${movieGenresData[0].id}`);
        }
      } catch (error) {
        console.error("Error fetching genres:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGenres();
  }, [genreId, navigate]);

  useEffect(() => {
    const fetchContentByGenre = async () => {
      if (!selectedGenre) return;

      setIsLoading(true);
      try {
        let data;
        if (activeTab === "movie") {
          data = await api.getMoviesByGenre(selectedGenre.id, page, sortBy);
          const moviesWithType: Movie[] = data.results.map((movie: any) => ({
            ...movie,
            media_type: "movie",
          }));
          setMovies(
            page === 1 ? moviesWithType : [...movies, ...moviesWithType]
          );
        } else {
          data = await api.getTvShowsByGenre(selectedGenre.id, page, sortBy);
          const showsWithType: TVShow[] = data.results.map((show: any) => ({
            ...show,
            media_type: "tv",
          }));
          setTvShows(
            page === 1 ? showsWithType : [...tvShows, ...showsWithType]
          );
        }
        setTotalPages(Math.min(data.total_pages, 10)); // Limit to 10 pages
      } catch (error) {
        console.error("Error fetching content by genre:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchContentByGenre();
  }, [selectedGenre, activeTab, page, sortBy]);

  const handleGenreClick = (genre: Genre, type: "movie" | "tv") => {
    // Only update if the genre is different or the type is different
    if (selectedGenre?.id !== genre.id || activeTab !== type) {
      setSelectedGenre(genre);
      setActiveTab(type);
      setPage(1);
      navigate(`/genres/${genre.id}`);
    }
  };

  const handleTabChange = (value: string) => {
    // Only proceed if the tab is actually changing
    if (value !== activeTab) {
      setActiveTab(value);
      setPage(1);

      // Select the first genre of the respective type when switching tabs
      if (value === "movie" && movieGenres.length > 0) {
        const firstMovieGenre = movieGenres[0];
        setSelectedGenre(firstMovieGenre);
        navigate(`/genres/${firstMovieGenre.id}`);
      } else if (value === "tv" && tvGenres.length > 0) {
        const firstTvGenre = tvGenres[0];
        setSelectedGenre(firstTvGenre);
        navigate(`/genres/${firstTvGenre.id}`);
      }
    }
  };

  const handleLoadMore = () => {
    if (page < totalPages) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  const handleSortChange = (value: string) => {
    setSortBy(value);
    setPage(1); // Reset to first page when changing sort
  };

  const sortOptions = [
    { value: "popularity.desc", label: "Most Popular" },
    { value: "vote_average.desc", label: "Highest Rated" },
    { value: "release_date.desc", label: "Newest First" },
    { value: "release_date.asc", label: "Oldest First" },
    { value: "title.asc", label: "Title A-Z" },
    { value: "title.desc", label: "Title Z-A" },
  ];

  if (isLoading && !selectedGenre) {
    return (
      <div className="container pt-24 pb-12 flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading genres...</p>
        </div>
      </div>
    );
  }

  const canonicalUrl = typeof window !== 'undefined' ? window.location.origin + '/genres' : '';

  return (
    <>
      <MetaTags
        title="Genres - Explore Movies and TV Shows by Genre"
        description="Discover movies and TV shows organized by genre. Find action, comedy, drama, and more."
        ogTitle="Browse by Genre on Alien"
        ogDescription="Explore a wide variety of movies and TV shows categorized by genre."
        ogImage="/favicon.svg"
        canonicalUrl={canonicalUrl}
        keywords="genres, movie genres, tv show genres, action, comedy, drama, thriller"
      />
      <div className="min-h-screen bg-background">
        <div className="px-4 sm:px-6 md:px-8 pt-24 pb-12">
          <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8">Genres</h1>

        <Tabs
          defaultValue="movie"
          value={activeTab}
          onValueChange={handleTabChange}
        >
          <TabsList className="mb-4 sm:mb-6">
            <TabsTrigger value="movie">Movies</TabsTrigger>
            <TabsTrigger value="tv">TV Shows</TabsTrigger>
          </TabsList>

          <TabsContent value="movie" className="mt-0">
            <div className="flex flex-wrap gap-2 mb-6 sm:mb-8">
              {movieGenres.map((genre) => (
                <Button
                  key={genre.id}
                  variant={
                    selectedGenre?.id === genre.id ? "default" : "outline"
                  }
                  size="sm"
                  onClick={() => handleGenreClick(genre, "movie")}
                >
                  {genre.name}
                </Button>
              ))}
            </div>

            {selectedGenre && (
              <>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                  <h2 className="text-xl sm:text-2xl font-semibold">
                    {selectedGenre.name} Movies
                  </h2>
                  <Select value={sortBy} onValueChange={handleSortChange}>
                    <SelectTrigger className="w-full sm:w-[180px]">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      {sortOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
                  {movies.map((movie) => (
                    <MediaCard
                      key={`movie-${movie.id}`}
                      id={movie.id}
                      title={movie.title}
                      posterPath={movie.poster_path}
                      rating={movie.vote_average}
                      mediaType="movie"
                      year={movie.release_date?.substring(0, 4)}
                    />
                  ))}
                </div>
              </>
            )}
          </TabsContent>

          <TabsContent value="tv" className="mt-0">
            <div className="flex flex-wrap gap-2 mb-6 sm:mb-8">
              {tvGenres.map((genre) => (
                <Button
                  key={genre.id}
                  variant={
                    selectedGenre?.id === genre.id ? "default" : "outline"
                  }
                  size="sm"
                  onClick={() => handleGenreClick(genre, "tv")}
                >
                  {genre.name}
                </Button>
              ))}
            </div>

            {selectedGenre && (
              <>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                  <h2 className="text-xl sm:text-2xl font-semibold">
                    {selectedGenre.name} TV Shows
                  </h2>
                  <Select value={sortBy} onValueChange={handleSortChange}>
                    <SelectTrigger className="w-full sm:w-[180px]">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      {sortOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
                  {tvShows.map((show) => (
                    <MediaCard
                      key={`tv-${show.id}`}
                      id={show.id}
                      title={show.name}
                      posterPath={show.poster_path}
                      rating={show.vote_average}
                      mediaType="tv"
                      year={show.first_air_date?.substring(0, 4)}
                    />
                  ))}
                </div>
              </>
            )}
          </TabsContent>
        </Tabs>

        {selectedGenre && page < totalPages && (
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

export default GenresPage;
