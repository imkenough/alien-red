import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { api } from "@/lib/api";
import { MediaType, Movie, TVShow, Person } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Loader2 } from "lucide-react";
import MediaCard from "@/components/MediaCard";
import { Helmet } from 'react-helmet-async';

const SearchPage: React.FC = () => {
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<(Movie | TVShow | Person)[]>([]);
  const [activeTab, setActiveTab] = useState<"all" | MediaType>("all");
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  // Parse query from URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const queryParam = params.get("q");
    if (queryParam) {
      setSearchQuery(queryParam);
    }
  }, [location.search]);

  // Search effect
  useEffect(() => {
    if (searchQuery.trim().length < 2) {
      setResults([]);
      return;
    }

    const performSearch = async () => {
      setIsLoading(true);
      try {
        const data = await api.search(searchQuery, page);
        setResults(data.results);
        setTotalPages(Math.min(data.total_pages, 10)); // Limit to 10 pages
      } catch (error) {
        console.error("Search error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    performSearch();
  }, [searchQuery, page]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1); // Reset to first page on new search
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value as "all" | MediaType);
  };

  const filteredResults =
    activeTab === "all"
      ? results
      : results.filter((item) => item.media_type === activeTab);

  const handleLoadMore = () => {
    if (page < totalPages) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  return (
    <>
      <Helmet>
        <title>Search - Alien Streaming</title>
        <meta name="description" content="Search for movies, TV shows, and people. Find your favorite content quickly on Alien." />
        <meta property="og:title" content="Search - Alien Streaming" />
        <meta property="og:description" content="Search for movies, TV shows, and people. Find your favorite content quickly on Alien." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://alienred.ddnsfree.com/search" />
        <meta property="og:image" content="/favicon.svg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Search - Alien Streaming" />
        <meta name="twitter:description" content="Search for movies, TV shows, and people. Find your favorite content quickly on Alien." />
        <meta name="twitter:image" content="/favicon.svg" />
      </Helmet>
      <div className="min-h-screen bg-background">
        <div className="px-4 sm:px-6 md:px-8 pt-24 pb-12">
          <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8">Search</h1>

          <form onSubmit={handleSearch} className="mb-6 sm:mb-8">
            <div className="flex w-full max-w-2xl items-center space-x-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for movies, TV shows or people..."
                  className="pl-10"
                />
              </div>
              <Button type="submit" disabled={searchQuery.trim().length < 2}>
                Search
              </Button>
            </div>
          </form>

          {isLoading && page === 1 ? (
            <div className="flex justify-center items-center py-8 sm:py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : results.length > 0 ? (
            <div>
              <Tabs
                defaultValue="all"
                value={activeTab}
                onValueChange={handleTabChange}
              >
                <TabsList className="mb-4 sm:mb-6">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="movie">Movies</TabsTrigger>
                  <TabsTrigger value="tv">TV Shows</TabsTrigger>
                  <TabsTrigger value="person">People</TabsTrigger>
                </TabsList>

                <TabsContent value="all" className="mt-0">
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
                    {filteredResults.map((item) => {
                      if (item.media_type === "person") {
                        // Person card
                        return (
                          <div
                            key={`person-${item.id}`}
                            className="overflow-hidden transition-all duration-300 hover:scale-105"
                          >
                            <div className="aspect-[2/3] bg-muted rounded-lg overflow-hidden">
                              {item.profile_path ? (
                                <img
                                  src={`https://image.tmdb.org/t/p/w342${item.profile_path}`}
                                  alt={item.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <span className="text-muted-foreground">
                                    No Image
                                  </span>
                                </div>
                              )}
                            </div>
                            <div className="mt-2">
                              <h3 className="font-medium text-sm">{item.name}</h3>
                              <p className="text-xs text-muted-foreground">
                                {item.known_for_department}
                              </p>
                            </div>
                          </div>
                        );
                      } else {
                        // Movie or TV show card
                        const mediaType =
                          item.media_type || ("title" in item ? "movie" : "tv");
                        const title = "title" in item ? item.title : item.name;
                        const year =
                          "release_date" in item
                            ? item.release_date?.substring(0, 4)
                            : "first_air_date" in item
                            ? item.first_air_date?.substring(0, 4)
                            : "";

                        return (
                          <MediaCard
                            key={`${mediaType}-${item.id}`}
                            id={item.id}
                            title={title || "Unknown"}
                            posterPath={
                              "poster_path" in item ? item.poster_path : undefined
                            }
                            rating={
                              "vote_average" in item ? item.vote_average || 0 : 0
                            }
                            mediaType={mediaType as "movie" | "tv"}
                            year={year}
                          />
                        );
                      }
                    })}
                  </div>
                </TabsContent>

                <TabsContent value="movie" className="mt-0">
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
                    {filteredResults.map((item) => {
                      if (!("title" in item) || !("release_date" in item))
                        return null;
                      const title = item.title;
                      const year = item.release_date?.substring(0, 4);

                      return (
                        <MediaCard
                          key={`movie-${item.id}`}
                          id={item.id}
                          title={title || "Unknown"}
                          posterPath={item.poster_path}
                          rating={item.vote_average || 0}
                          mediaType="movie"
                          year={year}
                        />
                      );
                    })}
                  </div>
                </TabsContent>

                <TabsContent value="tv" className="mt-0">
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
                    {filteredResults.map((item) => {
                      if (!("name" in item) || !("first_air_date" in item))
                        return null;
                      const title = item.name;
                      const year = item.first_air_date?.substring(0, 4);

                      return (
                        <MediaCard
                          key={`tv-${item.id}`}
                          id={item.id}
                          title={title || "Unknown"}
                          posterPath={item.poster_path}
                          rating={item.vote_average || 0}
                          mediaType="tv"
                          year={year}
                        />
                      );
                    })}
                  </div>
                </TabsContent>

                <TabsContent value="person" className="mt-0">
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
                    {filteredResults.map((item) => {
                      if (!("profile_path" in item)) return null;
                      return (
                        <div
                          key={`person-${item.id}`}
                          className="overflow-hidden transition-all duration-300 hover:scale-105"
                        >
                          <div className="aspect-[2/3] bg-muted rounded-lg overflow-hidden">
                            {item.profile_path ? (
                              <img
                                src={`https://image.tmdb.org/t/p/w342${item.profile_path}`}
                                alt={item.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <span className="text-muted-foreground">
                                  No Image
                                </span>
                              </div>
                            )}
                          </div>
                          <div className="mt-2">
                            <h3 className="font-medium text-sm">{item.name}</h3>
                            <p className="text-xs text-muted-foreground">
                              {item.known_for_department}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
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
          ) : searchQuery.trim().length >= 2 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No results found</p>
            </div>
          ) : null}
        </div>
      </div>
    </>
  );
};

export default SearchPage;
