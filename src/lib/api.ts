import axios from "axios";

// TMDb API configuration
const TMDB_API_KEY = "6db1dec452088fe25355c19905014f23"; // Public API key for demo purposes
const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p";

// VidSrc API (free streaming API)
const VIDSRC_BASE_URL = "https://vidsrc.xyz/embed";

// Create an axios instance for TMDb API
const tmdbApi = axios.create({
  baseURL: TMDB_BASE_URL,
  params: {
    api_key: TMDB_API_KEY,
  },
});

// Add response interceptor for error handling
tmdbApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error("TMDb API Error:", {
        status: error.response.status,
        data: error.response.data,
      });
    } else if (error.request) {
      // The request was made but no response was received
      console.error("TMDb API Error: No response received");
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error("TMDb API Error:", error.message);
    }
    return Promise.reject(error);
  }
);

// API functions
export const api = {
  // Get trending movies
  getTrending: async (mediaType = "all", timeWindow = "day", page = 1) => {
    try {
      const response = await tmdbApi.get(
        `/trending/${mediaType}/${timeWindow}`,
        { params: { page } }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching trending content:", error);
      throw error;
    }
  },

  // Get popular movies
  getPopular: async (mediaType = "movie", page = 1) => {
    try {
      const response = await tmdbApi.get(`/${mediaType}/popular`, {
        params: { page },
      });
      return response.data;
    } catch (error) {
      console.error(`Error fetching popular ${mediaType}:`, error);
      throw error;
    }
  },

  // Get top rated content
  getTopRated: async (mediaType = "movie", page = 1) => {
    try {
      const response = await tmdbApi.get(`/${mediaType}/top_rated`, {
        params: { page },
      });
      return response.data;
    } catch (error) {
      console.error(`Error fetching top rated ${mediaType}:`, error);
      throw error;
    }
  },

  // Search for movies or TV shows
  search: async (query: string, page = 1) => {
    try {
      const response = await tmdbApi.get("/search/multi", {
        params: { query, page, include_adult: false },
      });
      return response.data;
    } catch (error) {
      console.error("Error searching content:", error);
      throw error;
    }
  },

  // Get movie details
  getMovieDetails: async (movieId: string) => {
    try {
      const response = await tmdbApi.get(`/movie/${movieId}`, {
        params: { append_to_response: "videos,credits" },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching movie details:", error);
      throw error;
    }
  },

  // Get TV show details
  getTvDetails: async (tvId: string) => {
    try {
      const response = await tmdbApi.get(`/tv/${tvId}`, {
        params: { append_to_response: "videos,credits" },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching TV details:", error);
      throw error;
    }
  },

  // Get TV season details
  getTvSeasonDetails: async (tvId: string, seasonNumber: number) => {
    try {
      const response = await tmdbApi.get(`/tv/${tvId}/season/${seasonNumber}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching TV season details:", error);
      throw error;
    }
  },

  // Get streaming URL
  getStreamingUrl: (
    mediaType: "movie" | "tv",
    id: string,
    season?: number,
    episode?: number
  ) => {
    if (mediaType === "movie") {
      return `${VIDSRC_BASE_URL}/movie?tmdb=${id}`;
    } else {
      return `${VIDSRC_BASE_URL}/tv?tmdb=${id}&season=${season}&episode=${episode}`;
    }
  },

  // Get movie genres
  getMovieGenres: async () => {
    try {
      const response = await tmdbApi.get("/genre/movie/list");
      return response.data.genres;
    } catch (error) {
      console.error("Error fetching movie genres:", error);
      throw error;
    }
  },

  // Get TV show genres
  getTvGenres: async () => {
    try {
      const response = await tmdbApi.get("/genre/tv/list");
      return response.data.genres;
    } catch (error) {
      console.error("Error fetching TV genres:", error);
      throw error;
    }
  },

  // Get movies by genre
  getMoviesByGenre: async (
    genreId: number,
    page = 1,
    sortBy = "popularity.desc"
  ) => {
    try {
      const response = await tmdbApi.get("/discover/movie", {
        params: { with_genres: genreId, page, sort_by: sortBy },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching movies by genre:", error);
      throw error;
    }
  },

  // Get TV shows by genre
  getTvShowsByGenre: async (
    genreId: number,
    page = 1,
    sortBy = "popularity.desc"
  ) => {
    try {
      const response = await tmdbApi.get("/discover/tv", {
        params: { with_genres: genreId, page, sort_by: sortBy },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching TV shows by genre:", error);
      throw error;
    }
  },
};

// Helper functions for image URLs
export const getImageUrl = (
  path: string | null | undefined,
  size: string = "original"
) => {
  if (!path) return null;
  return `${TMDB_IMAGE_BASE_URL}/${size}${path}`;
};

export const getPosterUrl = (
  path: string | null | undefined,
  size: "w92" | "w154" | "w185" | "w342" | "w500" | "w780" | "original" = "w500"
) => {
  return getImageUrl(path, size);
};

export const getBackdropUrl = (
  path: string | null | undefined,
  size: "w300" | "w780" | "w1280" | "original" = "w1280"
) => {
  return getImageUrl(path, size);
};

export const getProfileUrl = (
  path: string | null | undefined,
  size: "w45" | "w185" | "h632" | "original" = "w185"
) => {
  return getImageUrl(path, size);
};
