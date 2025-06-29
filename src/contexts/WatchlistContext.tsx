import React, { createContext, useContext, useEffect, useState } from "react";
import {
  WatchlistItem,
  ContinueWatchingItem,
  WatchlistFilterOptions,
} from "@/lib/types";

interface WatchlistContextType {
  watchlist: WatchlistItem[];
  continueWatching: ContinueWatchingItem[];
  isLoading: boolean;
  addToWatchlist: (item: WatchlistItem) => void;
  removeFromWatchlist: (id: number) => void;
  isInWatchlist: (id: number) => boolean;
  updateContinueWatching: (item: ContinueWatchingItem) => void;
  removeFromContinueWatching: (id: number) => void;
  toggleWatched: (id: number) => void;
  toggleWatchLater: (id: number) => void;
  updateRating: (id: number, rating: number) => void;
  updateNotes: (id: number, notes: string) => void;
  getFilteredWatchlist: (options: WatchlistFilterOptions) => WatchlistItem[];
}

const WatchlistContext = createContext<WatchlistContextType | undefined>(
  undefined
);

export const WatchlistProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const [continueWatching, setContinueWatching] = useState<
    ContinueWatchingItem[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load from localStorage on mount
    const loadData = () => {
      try {
        const savedWatchlist = localStorage.getItem("watchlist");
        const savedContinueWatching = localStorage.getItem("continueWatching");

        if (savedWatchlist) {
          setWatchlist(JSON.parse(savedWatchlist));
        }

        if (savedContinueWatching) {
          setContinueWatching(JSON.parse(savedContinueWatching));
        }
      } catch (error) {
        console.error("Error loading watchlist data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Save to localStorage whenever state changes
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem("watchlist", JSON.stringify(watchlist));
    }
  }, [watchlist, isLoading]);

  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem(
        "continueWatching",
        JSON.stringify(continueWatching)
      );
    }
  }, [continueWatching, isLoading]);

  const addToWatchlist = (item: WatchlistItem) => {
    setWatchlist((prev) => {
      if (prev.some((i) => i.id === item.id)) {
        return prev;
      }
      return [
        {
          ...item,
          added_at: Date.now(),
          watched: false,
          watch_later: false,
        },
        ...prev,
      ];
    });
  };

  const removeFromWatchlist = (id: number) => {
    setWatchlist((prev) => prev.filter((item) => item.id !== id));
  };

  const isInWatchlist = (id: number) => {
    return watchlist.some((item) => item.id === id);
  };

  const toggleWatched = (id: number) => {
    setWatchlist((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, watched: !item.watched } : item
      )
    );
  };

  const toggleWatchLater = (id: number) => {
    setWatchlist((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, watch_later: !item.watch_later } : item
      )
    );
  };

  const updateRating = (id: number, rating: number) => {
    setWatchlist((prev) =>
      prev.map((item) => (item.id === id ? { ...item, rating } : item))
    );
  };

  const updateNotes = (id: number, notes: string) => {
    setWatchlist((prev) =>
      prev.map((item) => (item.id === id ? { ...item, notes } : item))
    );
  };

  const getFilteredWatchlist = (options: WatchlistFilterOptions) => {
    let filtered = [...watchlist];

    // Apply filters
    if (!options.showWatched) {
      filtered = filtered.filter((item) => !item.watched);
    }
    if (!options.showWatchLater) {
      filtered = filtered.filter((item) => !item.watch_later);
    }
    if (options.mediaType && options.mediaType !== "all") {
      filtered = filtered.filter(
        (item) => item.media_type === options.mediaType
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let comparison = 0;
      switch (options.sortBy) {
        case "added":
          comparison = a.added_at - b.added_at;
          break;
        case "title":
          comparison = a.title.localeCompare(b.title);
          break;
        case "rating":
          comparison = (a.rating || 0) - (b.rating || 0);
          break;
      }
      return options.sortOrder === "asc" ? comparison : -comparison;
    });

    return filtered;
  };

  const updateContinueWatching = (item: ContinueWatchingItem) => {
    setContinueWatching((prev) => {
      const existingIndex = prev.findIndex((i) => i.id === item.id);
      const newItem = { ...item, last_watched: Date.now() };

      if (existingIndex >= 0) {
        const newList = [...prev];
        newList[existingIndex] = newItem;
        return newList;
      }

      // Limit list to 20 items and sort by last watched
      const newList = [newItem, ...prev]
        .sort((a, b) => b.last_watched - a.last_watched)
        .slice(0, 20);
      return newList;
    });
  };

  const removeFromContinueWatching = (id: number) => {
    setContinueWatching((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <WatchlistContext.Provider
      value={{
        watchlist,
        continueWatching,
        isLoading,
        addToWatchlist,
        removeFromWatchlist,
        isInWatchlist,
        updateContinueWatching,
        removeFromContinueWatching,
        toggleWatched,
        toggleWatchLater,
        updateRating,
        updateNotes,
        getFilteredWatchlist,
      }}
    >
      {children}
    </WatchlistContext.Provider>
  );
};

export const useWatchlist = (): WatchlistContextType => {
  const context = useContext(WatchlistContext);
  if (context === undefined) {
    throw new Error("useWatchlist must be used within a WatchlistProvider");
  }
  return context;
};
