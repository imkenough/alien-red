import React, { useEffect, useState } from "react";
import {
  useParams,
  useNavigate,
  useLocation,
  useSearchParams,
} from "react-router-dom";
import { api, getBackdropUrl, getPosterUrl } from "@/lib/api";
import {
  Movie,
  TVShow,
  Season,
  Episode,
  ContinueWatchingItem,
} from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Heart,
  Play,
  Plus,
  Star,
  Server,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import VideoPlayer from "@/components/VideoPlayer";
import { cn } from "@/lib/utils";
import { useWatchlist } from "@/contexts/WatchlistContext";

interface MediaDetailsPageProps {}

const MediaDetailsPage: React.FC<MediaDetailsPageProps> = () => {
  const { mediaType, id } = useParams<{ mediaType: string; id: string }>();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const continueWatchingData = location.state?.continueWatchingData as
    | ContinueWatchingItem
    | undefined;
  const [media, setMedia] = useState<Movie | TVShow | null>(null);
  const [selectedSeason, setSelectedSeason] = useState<Season | null>(null);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [selectedEpisode, setSelectedEpisode] = useState<Episode | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isWatching, setIsWatching] = useState(location.state?.play || false);
  const {
    isInWatchlist,
    addToWatchlist,
    removeFromWatchlist,
    updateContinueWatching,
  } = useWatchlist();
  const navigate = useNavigate();
  const [selectedServer, setSelectedServer] = useState<string>(
    () => localStorage.getItem("selectedServer") || "vidfast"
  );

  useEffect(() => {
    localStorage.setItem("selectedServer", selectedServer);
  }, [selectedServer]);
  const [selectedAnimeDub, setSelectedAnimeDub] = useState<boolean>(false);

  const inWatchlist = media ? isInWatchlist(media.id) : false;

  useEffect(() => {
    if (location.state?.play) {
      handleWatchNow();
    }
  }, [location.state?.play]);

  useEffect(() => {
    const fetchMediaDetails = async () => {
      if (!mediaType || !id) return;

      try {
        setIsLoading(true);

        if (mediaType === "movie") {
          const movieData = await api.getMovieDetails(id);
          setMedia({ ...movieData, media_type: "movie" });
        } else if (mediaType === "tv") {
          const tvData = await api.getTvDetails(id);
          setMedia({ ...tvData, media_type: "tv" });

          // If TV show has seasons, select the appropriate one
          if (tvData.seasons && tvData.seasons.length > 0) {
            let targetSeason: Season | undefined;

            // First check URL parameters for season
            const urlSeason = searchParams.get("season");
            const urlEpisode = searchParams.get("episode");

            // If we have URL parameters, use those
            if (urlSeason) {
              targetSeason = tvData.seasons.find(
                (s: Season) => s.season_number === parseInt(urlSeason)
              );
            }

            // If we have continue watching data, use that season
            if (!targetSeason && continueWatchingData?.season) {
              targetSeason = tvData.seasons.find(
                (s: Season) => s.season_number === continueWatchingData.season
              );
            }

            // If no continue watching data or season not found, use first real season
            if (!targetSeason) {
              targetSeason =
                tvData.seasons.find((s: Season) => s.season_number > 0) ||
                tvData.seasons[0];
            }

            if (targetSeason) {
              setSelectedSeason(targetSeason);

              // Fetch episodes for the selected season
              const seasonData = await api.getTvSeasonDetails(
                id,
                targetSeason.season_number
              );
              setEpisodes(seasonData.episodes || []);

              // Set the appropriate episode
              if (seasonData.episodes && seasonData.episodes.length > 0) {
                let targetEpisode: Episode | undefined;

                // If we have URL parameters, use those
                if (
                  urlEpisode &&
                  urlSeason === targetSeason.season_number.toString()
                ) {
                  targetEpisode = seasonData.episodes.find(
                    (e: { episode_number: number }) =>
                      e.episode_number === parseInt(urlEpisode)
                  );
                }

                // If we have continue watching data, use that episode
                if (!targetEpisode && continueWatchingData?.episode) {
                  targetEpisode = seasonData.episodes.find(
                    (e: { episode_number: number }) =>
                      e.episode_number === continueWatchingData.episode
                  );
                }

                // If no continue watching data or episode not found, use first episode
                if (targetEpisode) {
                  setSelectedEpisode(targetEpisode);
                } else {
                  setSelectedEpisode(seasonData.episodes[0]);
                }
              }
            }
          }
        }
      } catch (error) {
        console.error("Error fetching media details:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMediaDetails();
  }, [mediaType, id, continueWatchingData]);

  useEffect(() => {
    // Reset episode selection when season changes
    if (selectedSeason && mediaType === "tv") {
      const fetchSeasonDetails = async () => {
        try {
          const seasonData = await api.getTvSeasonDetails(
            id!,
            selectedSeason.season_number
          );
          setEpisodes(seasonData.episodes || []);

          // First check URL parameters for episode
          const urlEpisode = searchParams.get("episode");
          const urlSeason = searchParams.get("season");

          // If we have URL parameters and they match the current season, use the episode from URL
          if (
            urlEpisode &&
            urlSeason === selectedSeason.season_number.toString()
          ) {
            const targetEpisode = seasonData.episodes?.find(
              (e: { episode_number: number }) =>
                e.episode_number === parseInt(urlEpisode)
            );
            if (targetEpisode) {
              setSelectedEpisode(targetEpisode);
              return;
            }
          }

          // If this is the continue watching season, try to find the target episode
          if (
            continueWatchingData?.season === selectedSeason.season_number &&
            continueWatchingData?.episode
          ) {
            const targetEpisode = seasonData.episodes?.find(
              (e: { episode_number: number }) =>
                e.episode_number === continueWatchingData.episode
            );
            if (targetEpisode) {
              setSelectedEpisode(targetEpisode);
              return;
            }
          }

          // Otherwise, set first episode as selected
          if (seasonData.episodes && seasonData.episodes.length > 0) {
            setSelectedEpisode(seasonData.episodes[0]);
          } else {
            setSelectedEpisode(null);
          }
        } catch (error) {
          console.error("Error fetching season details:", error);
        }
      };

      fetchSeasonDetails();
    }
  }, [selectedSeason, id, mediaType, continueWatchingData]);

  useEffect(() => {
    if (selectedEpisode && media) {
      const title = "title" in media ? media.title : media.name;
      updateContinueWatching({
        id: media.id,
        title: title || "Untitled",
        poster_path: media.poster_path,
        media_type: mediaType as "movie" | "tv",
        progress: 0,
        last_watched: Date.now(),
        added_at: Date.now(),
        season: selectedSeason?.season_number,
        episode: selectedEpisode?.episode_number,
        watched: false,
        watch_later: false,
      });
    }
  }, [selectedEpisode, media, mediaType, selectedSeason, updateContinueWatching]);

  const handleSeasonChange = (seasonNumber: string) => {
    if (!media || mediaType !== "tv") return;

    const tvShow = media as TVShow;
    const season = tvShow.seasons?.find(
      (s) => s.season_number === parseInt(seasonNumber)
    );
    if (season) {
      setSelectedSeason(season);
      // Update URL parameters
      setSearchParams({ season: seasonNumber });
    }
  };

  const handleEpisodeChange = (episodeNumber: string) => {
    const episode = episodes.find(
      (e) => e.episode_number === parseInt(episodeNumber)
    );
    if (episode) {
      setSelectedEpisode(episode);
      // Update URL parameters
      const currentSeason = selectedSeason?.season_number.toString() || "1";
      setSearchParams({ season: currentSeason, episode: episodeNumber });
    }
  };

  const handleNextEpisode = () => {
    if (!selectedEpisode) return;
    const currentIndex = episodes.findIndex((e) => e.id === selectedEpisode.id);
    if (currentIndex < episodes.length - 1) {
      const nextEpisode = episodes[currentIndex + 1];
      setSelectedEpisode(nextEpisode);
      const currentSeason = selectedSeason?.season_number.toString() || "1";
      setSearchParams({
        season: currentSeason,
        episode: nextEpisode.episode_number.toString(),
      });
    }
  };

  const handlePreviousEpisode = () => {
    if (!selectedEpisode) return;
    const currentIndex = episodes.findIndex((e) => e.id === selectedEpisode.id);
    if (currentIndex > 0) {
      const prevEpisode = episodes[currentIndex - 1];
      setSelectedEpisode(prevEpisode);
      const currentSeason = selectedSeason?.season_number.toString() || "1";
      setSearchParams({
        season: currentSeason,
        episode: prevEpisode.episode_number.toString(),
      });
    }
  };

  const handleWatchNow = () => {
    if (!isWatching) {
      setIsWatching(true);
    }

    // Add to continue watching
    if (media) {
      const title = "title" in media ? media.title : media.name;
      updateContinueWatching({
        id: media.id,
        title: title || "Untitled",
        poster_path: media.poster_path,
        media_type: mediaType as "movie" | "tv",
        progress: 0,
        last_watched: Date.now(),
        added_at: Date.now(),
        season: selectedSeason?.season_number,
        episode: selectedEpisode?.episode_number,
        watched: false,
        watch_later: false,
      });
    }

    // Scroll to player
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleWatchlistToggle = () => {
    if (!media) return;

    console.log("handleWatchlistToggle called for media ID:", media.id);
    console.log("Current inWatchlist status:", inWatchlist);

    const title = "title" in media ? media.title : media.name;

    if (inWatchlist) {
      removeFromWatchlist(media.id);
    } else {
      addToWatchlist({
        id: media.id,
        title,
        poster_path: media.poster_path,
        media_type: mediaType as "movie" | "tv",
        added_at: Date.now(),
      });
    }
  };

  const getStreamingUrl = () => {
    if (!media || !mediaType) return "";

    const baseUrl =
      selectedServer === "vidsrc"
        ? "https://vidsrc.xyz/embed"
        : selectedServer === "vidfast"
        ? "https://vidfast.pro"
        : selectedServer === "videasy"
        ? "https://player.videasy.net"
        : "https://vidfast.pro"; // Default to vidfast

    if (selectedServer === "videasy") {
      // Videasy logic
      if (mediaType === "movie") {
        // Movie: https://player.videasy.net/movie/movie_id
        return `${baseUrl}/movie/${id}`;
      } else if (mediaType === "tv") {
        // TV: https://player.videasy.net/tv/show_id/season/episode
        return `${baseUrl}/tv/${id}/${selectedSeason?.season_number || 1}/${
          selectedEpisode?.episode_number || 1
        }`;
      } else if (mediaType === "anime") {
        // Anime: https://player.videasy.net/anime/anilist_id/episode?dub=true|false
        // or for movies: https://player.videasy.net/anime/anilist_id?dub=true|false
        if (selectedEpisode) {
          // Show episode
          return `${baseUrl}/anime/${id}/${selectedEpisode.episode_number}${
            selectedAnimeDub ? "?dub=true" : ""
          }`;
        } else {
          // Movie
          return `${baseUrl}/anime/${id}${selectedAnimeDub ? "?dub=true" : ""}`;
        }
      }
      return "";
    }

    // Existing logic for other servers
    if (mediaType === "movie") {
      return selectedServer === "vidfast"
        ? `${baseUrl}/movie/${id}`
        : selectedServer === "embedsu"
        ? `${baseUrl}/movie/${id}`
        : `${baseUrl}/movie?tmdb=${id}`;
    } else {
      return selectedServer === "vidfast"
        ? `${baseUrl}/tv/${id}/${selectedSeason?.season_number || 1}/${
            selectedEpisode?.episode_number || 1
          }`
        : selectedServer === "embedsu"
        ? `${baseUrl}/tv/${id}/${selectedSeason?.season_number || 1}/${
            selectedEpisode?.episode_number || 1
          }`
        : `${baseUrl}/tv?tmdb=${id}&season=${
            selectedSeason?.season_number || 1
          }&episode=${selectedEpisode?.episode_number || 1}`;
    }
  };

  const getMediaTitle = () => {
    if (!media) return "";
    return "title" in media ? media.title : media.name;
  };

  const getMediaReleaseYear = () => {
    if (!media) return "";

    const dateString =
      "release_date" in media ? media.release_date : media.first_air_date;

    return dateString ? dateString.substring(0, 4) : "";
  };

  if (isLoading && !media) {
    return (
      <div className="container pt-24 pb-12">
        <div className="space-y-8">
          <Skeleton className="w-full h-[50vh] rounded-lg" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Skeleton className="h-80 md:col-span-1" />
            <div className="space-y-4 md:col-span-2">
              <Skeleton className="h-12 w-3/4" />
              <Skeleton className="h-6 w-1/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-24 w-full" />
              <div className="flex space-x-4">
                <Skeleton className="h-10 w-32" />
                <Skeleton className="h-10 w-32" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!media) {
    return (
      <div className="container pt-24 pb-12 text-center">
        <h1 className="text-2xl font-bold">Media not found</h1>
        <p className="mt-4">The requested media could not be found.</p>
        <Button className="mt-6" onClick={() => navigate("/")}>
          Back to Home
        </Button>
      </div>
    );
  }

  return (
    <div className="pb-12">
      {/* Video Player (when watching) */}
      {isWatching && (
        <div className="container px-4 sm:px-6 md:px-8 pt-20 mb-8">
          <VideoPlayer
            src={getStreamingUrl()}
            title={getMediaTitle() || "Untitled"}
          />
        </div>
      )}

      {/* Hero Backdrop */}
      {!isWatching && (
        <div
          className="w-full h-[30vh] md:h-[40vh] relative z-0"
          style={{
            backgroundImage: media.backdrop_path
              ? `url(${getBackdropUrl(media.backdrop_path, "w1280")})`
              : "none",
            backgroundSize: "cover",
            backgroundPosition: "center top",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-background/60 to-background" />
        </div>
      )}

      {/* Content */}
      <div
        className={cn(
          "container px-4 sm:px-6 md:px-8 relative z-10",
          !isWatching && "-mt-16 md:-mt-24",
          "pt-8"
        )}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Poster and Actions */}
          <div className="md:col-span-1 max-w-xs w-full mx-auto flex justify-center md:block">
            <div className="sticky top-24">
              <Card className="overflow-hidden border-0 shadow-lg rounded-lg">
                {media.poster_path ? (
                  <img
                    src={
                      (getPosterUrl(media.poster_path, "w500") as string) || ""
                    }
                    alt={getMediaTitle()}
                    className="w-full h-auto"
                  />
                ) : (
                  <div className="aspect-[2/3] bg-muted flex items-center justify-center">
                    <span className="text-muted-foreground">
                      No Poster Available
                    </span>
                  </div>
                )}
              </Card>

              <div className="mt-6 space-y-4">
                <Button size="lg" className="w-full" onClick={handleWatchNow}>
                  <Play className="mr-2 h-5 w-5" />
                  Watch Now
                </Button>

                <Button
                  variant="outline"
                  size="lg"
                  className={cn(
                    "w-full",
                    inWatchlist && "border-primary text-primary"
                  )}
                  onClick={handleWatchlistToggle}
                >
                  {inWatchlist ? (
                    <>
                      <Heart className="mr-2 h-5 w-5 fill-primary" />
                      Added to Watchlist
                    </>
                  ) : (
                    <>
                      <Plus className="mr-2 h-5 w-5" />
                      Add to Watchlist
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="md:col-span-2">
            <h1 className="text-3xl md:text-4xl font-bold">
              {getMediaTitle()}
            </h1>

            <div className="flex flex-wrap items-center mt-3 space-x-4 text-muted-foreground">
              {getMediaReleaseYear() && <span>{getMediaReleaseYear()}</span>}

              {media.vote_average > 0 && (
                <div className="flex items-center">
                  <Star className="h-4 w-4 text-yellow-500 mr-1 fill-yellow-500" />
                  <span>{media.vote_average.toFixed(1)}/10</span>
                </div>
              )}

              {"runtime" in media && media.runtime && (
                <span>
                  {Math.floor(media.runtime / 60)}h {media.runtime % 60}m
                </span>
              )}

              {"number_of_seasons" in media && media.number_of_seasons && (
                <span>
                  {media.number_of_seasons} Season
                  {media.number_of_seasons !== 1 ? "s" : ""}
                </span>
              )}
            </div>

            {/* Genres */}
            {media.genres && (
              <div className="flex flex-wrap gap-2 mt-4">
                {media.genres.map((genre) => (
                  <span
                    key={genre.id}
                    className="bg-muted text-muted-foreground text-xs px-3 py-1 rounded-full"
                  >
                    {genre.name}
                  </span>
                ))}
              </div>
            )}

            {/* Overview */}
            <div className="mt-6">
              <h2 className="text-lg font-medium mb-2">Overview</h2>
              <p className="text-muted-foreground">{media.overview}</p>
            </div>

            {/* Server Selection */}
            <div className="mt-6 p-4 bg-muted/50 rounded-lg border border-border">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex items-center gap-2">
                  <Server className="h-5 w-5 text-primary" />
                  <h3 className="font-medium">Streaming Server</h3>
                </div>
                <Select
                  value={selectedServer}
                  onValueChange={setSelectedServer}
                >
                  <SelectTrigger className="w-full sm:w-[200px]">
                    <SelectValue placeholder="Select Server" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="vidfast">
                      <div className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-orange-500"></span>
                        VidFast (Recommended)
                      </div>
                    </SelectItem>
                    <SelectItem value="videasy">
                      <div className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-purple-600"></span>
                        Videasy
                      </div>
                    </SelectItem>
                    <SelectItem value="vidsrc">
                      <div className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-green-500"></span>
                        VidSrc
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* TV Show specific controls */}
            {mediaType === "tv" &&
              "seasons" in media &&
              media.seasons &&
              media.seasons.length > 0 && (
                <div className="mt-8">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-medium">Episodes</h2>
                    <Select
                      value={selectedSeason?.season_number.toString()}
                      onValueChange={handleSeasonChange}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select Season" />
                      </SelectTrigger>
                      <SelectContent>
                        {media.seasons
                          .filter((s: Season) => s.season_number > 0) // Skip specials (season 0)
                          .map((season: Season) => (
                            <SelectItem
                              key={season.id}
                              value={season.season_number.toString()}
                            >
                              {season.name}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Selected episode details */}
                  {selectedEpisode && (
                    <Card className="p-4 mb-4 relative">
                      <div className="flex flex-col sm:flex-row gap-4">
                        {selectedEpisode.still_path && (
                          <img
                            src={
                              getPosterUrl(
                                selectedEpisode.still_path,
                                "w500"
                              ) || ""
                            }
                            alt={selectedEpisode.name || "Episode thumbnail"}
                            className="rounded-md w-full sm:w-64 h-auto object-cover"
                          />
                        )}
                        <div className="flex-1">
                          <h3 className="text-xl font-medium">
                            {selectedEpisode.episode_number}.{" "}
                            {selectedEpisode.name}
                          </h3>
                          {selectedEpisode.air_date && (
                            <p className="text-sm text-muted-foreground mt-1">
                              Air date:{" "}
                              {new Date(
                                selectedEpisode.air_date
                              ).toLocaleDateString()}
                            </p>
                          )}
                          <p className="text-muted-foreground mt-2">
                            {selectedEpisode.overview ||
                              "No description available."}
                          </p>
                          <Button
                            size="lg"
                            className="mt-4 w-full"
                            onClick={handleWatchNow}
                          >
                            <Play className="mr-2 h-5 w-5" />
                            Play Episode
                          </Button>
                        </div>
                      </div>
                      <div className="absolute top-4 right-4 flex gap-2">
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={handlePreviousEpisode}
                          disabled={episodes.findIndex(e => e.id === selectedEpisode.id) === 0}
                        >
                          <ChevronLeft className="h-5 w-5" />
                        </Button>
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={handleNextEpisode}
                          disabled={episodes.findIndex(e => e.id === selectedEpisode.id) === episodes.length - 1}
                        >
                          <ChevronRight className="h-5 w-5" />
                        </Button>
                      </div>
                    </Card>
                  )}

                  {/* Netflix-style episode list */}
                  <div className="relative">
                    <div className="flex overflow-x-auto pb-4 gap-4 snap-x snap-mandatory scrollbar-hide">
                      {episodes.map((episode) => (
                        <div
                          key={episode.id}
                          className={cn(
                            "flex-none w-[300px] snap-start cursor-pointer transition-all duration-200",
                            selectedEpisode?.id === episode.id &&
                              "bg-primary/30 text-primary"
                          )}
                          onClick={() => {
                            setSelectedEpisode(episode);
                            // Update URL parameters
                            const currentSeason =
                              selectedSeason?.season_number.toString() || "1";
                            setSearchParams({
                              season: currentSeason,
                              episode: episode.episode_number.toString(),
                            });
                          }}
                        >
                          <div className="relative aspect-video rounded-lg overflow-hidden">
                            {episode.still_path ? (
                              <img
                                src={
                                  getPosterUrl(episode.still_path, "w500") || ""
                                }
                                alt={episode.name || "Episode thumbnail"}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-muted flex items-center justify-center">
                                <span className="text-muted-foreground">
                                  No Image Available
                                </span>
                              </div>
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                            <div className="absolute bottom-0 left-0 right-0 p-4">
                              <h3 className="text-white font-medium">
                                {episode.episode_number}.{" "}
                                {episode.name || "Untitled Episode"}
                              </h3>
                              {episode.air_date && (
                                <p className="text-sm text-white/80 mt-1">
                                  {new Date(
                                    episode.air_date
                                  ).toLocaleDateString()}
                                </p>
                              )}
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                            {episode.overview || "No description available."}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

            {/* Credits and videos tabs */}
            <div className="mt-8">
              <Tabs defaultValue="cast">
                <TabsList>
                  <TabsTrigger value="cast">Cast</TabsTrigger>
                  <TabsTrigger value="videos">Videos</TabsTrigger>
                </TabsList>
                <TabsContent value="cast" className="mt-4">
                  {media.credits?.cast && media.credits.cast.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                      {media.credits.cast.slice(0, 8).map((person) => (
                        <Card
                          key={person.id}
                          className="overflow-hidden border-0"
                        >
                          <div className="aspect-[2/3] bg-muted">
                            {person.profile_path ? (
                              <img
                                src={
                                  getPosterUrl(person.profile_path, "w185") ||
                                  undefined
                                }
                                alt={person.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <span className="text-xs text-muted-foreground">
                                  No Image
                                </span>
                              </div>
                            )}
                          </div>
                          <div className="p-2">
                            <h4 className="font-medium text-sm line-clamp-1">
                              {person.name}
                            </h4>
                            <p className="text-xs text-muted-foreground line-clamp-1">
                              {person.character}
                            </p>
                          </div>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">
                      No cast information available.
                    </p>
                  )}
                </TabsContent>
                <TabsContent value="videos" className="mt-4">
                  {media.videos?.results && media.videos.results.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {media.videos.results
                        .filter((video) => video.site === "YouTube")
                        .slice(0, 4)
                        .map((video) => (
                          <div key={video.id} className="aspect-video">
                            <iframe
                              width="100%"
                              height="100%"
                              src={`https://www.youtube.com/embed/${video.key}`}
                              title={video.name}
                              frameBorder="0"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                            ></iframe>
                          </div>
                        ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">
                      No videos available.
                    </p>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MediaDetailsPage;
