j; // Media Types
export type MediaType = "movie" | "tv" | "person";

// Base Interface for Movie and TV Show
export interface MediaBase {
  id: number;
  title?: string;
  name?: string;
  poster_path: string | undefined;
  backdrop_path: string | undefined;
  overview: string;
  vote_average: number;
  vote_count: number;
  popularity: number;
  genre_ids?: number[];
  genres?: Genre[];
  media_type?: MediaType;
}

// Movie Interface
export interface Movie extends MediaBase {
  media_type: "movie";
  title: string;
  release_date: string;
  runtime?: number;
  videos?: VideoResult;
  credits?: CreditsResult;
}

// TV Show Interface
export interface TVShow extends MediaBase {
  media_type: "tv";
  name: string;
  first_air_date: string;
  last_air_date?: string;
  number_of_seasons?: number;
  number_of_episodes?: number;
  seasons?: Season[];
  videos?: VideoResult;
  credits?: CreditsResult;
}

// Genre Interface
export interface Genre {
  id: number;
  name: string;
}

// Season Interface
export interface Season {
  id: number;
  name: string;
  season_number: number;
  episode_count: number;
  poster_path: string | undefined;
  overview: string;
  air_date?: string;
  episodes?: Episode[];
}

// Episode Interface
export interface Episode {
  id: number;
  name: string;
  episode_number: number;
  season_number: number;
  air_date?: string;
  overview: string;
  still_path: string | undefined;
  vote_average: number;
  runtime?: number;
}

// Video Interface
export interface Video {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
  official: boolean;
}

export interface VideoResult {
  results: Video[];
}

// Credits Interface
export interface CreditsResult {
  cast: CastMember[];
  crew: CrewMember[];
}

export interface CastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string | undefined;
  order: number;
}

export interface CrewMember {
  id: number;
  name: string;
  department: string;
  job: string;
  profile_path: string | undefined;
}

// Person Interface
export interface Person {
  id: number;
  name: string;
  profile_path: string | undefined;
  known_for_department: string;
  media_type: "person";
  known_for?: (Movie | TVShow)[];
}

// Search Result Interface
export interface SearchResult {
  page: number;
  results: (Movie | TVShow | Person)[];
  total_results: number;
  total_pages: number;
}

// Trending Result Interface
export interface TrendingResult {
  page: number;
  results: (Movie | TVShow)[];
  total_results: number;
  total_pages: number;
}

// Watchlist Item
export interface WatchlistItem {
  id: number; // TMDB media ID
  supabase_id?: string; // Supabase row ID
  title: string;
  poster_path: string | undefined;
  media_type: "movie" | "tv";
  added_at: number; // timestamp
  watched: boolean;
  watch_later: boolean;
  rating?: number; // user rating
  notes?: string;
}

// Continue Watching Item
export interface ContinueWatchingItem extends WatchlistItem {
  progress: number; // percentage watched
  last_watched: number; // timestamp
  season?: number; // for TV shows
  episode?: number; // for TV shows
}

// Watchlist Filter Options
export interface WatchlistFilterOptions {
  showWatched: boolean;
  showWatchLater: boolean;
  sortBy: "added" | "title" | "rating";
  sortOrder: "asc" | "desc";
  mediaType?: "movie" | "tv" | "all";
}
