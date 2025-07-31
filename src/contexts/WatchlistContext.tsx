import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import {
  WatchlistItem,
  ContinueWatchingItem,
  WatchlistFilterOptions,
} from "@/lib/types";
import { supabase } from "@/lib/supabase";
import { useAuth } from "./AuthContext";

interface WatchlistContextType {
  watchlist: WatchlistItem[];
  continueWatching: ContinueWatchingItem[];
  isLoading: boolean;
  addToWatchlist: (item: WatchlistItem) => void;
  removeFromWatchlist: (mediaId: number) => void;
  isInWatchlist: (mediaId: number) => boolean;
  updateContinueWatching: (item: ContinueWatchingItem) => void;
  removeFromContinueWatching: (mediaId: number) => void;
  toggleWatched: (mediaId: number) => void;
  toggleWatchLater: (mediaId: number) => void;
  updateRating: (mediaId: number, rating: number) => void;
  updateNotes: (mediaId: number, notes: string) => void;
  getFilteredWatchlist: (options: WatchlistFilterOptions) => WatchlistItem[];
}

const WatchlistContext = createContext<WatchlistContextType | undefined>(
  undefined
);

export const WatchlistProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { session, loading: authLoading } = useAuth();
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const [continueWatching, setContinueWatching] = useState<
    ContinueWatchingItem[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUserWatchlist = useCallback(async () => {
    if (!session?.user) {
      setWatchlist([]);
      return;
    }
    setIsLoading(true);
    const { data, error } = await supabase
      .from('user_watchlists')
      .select('*')
      .eq('user_id', session.user.id);

    if (error) {
      console.error("Error fetching watchlist:", error);
      setWatchlist([]);
    } else {
      setWatchlist(data.map(item => ({
        id: item.media_id,
        supabase_id: item.id,
        title: item.title,
        poster_path: item.poster_path,
        media_type: item.media_type,
        added_at: new Date(item.added_at).getTime(),
        watched: item.watched,
        watch_later: item.watch_later,
        rating: item.rating,
        notes: item.notes,
      })) as WatchlistItem[]);
    }
    setIsLoading(false);
  }, [session]);

  const fetchUserContinueWatching = useCallback(async () => {
    if (!session?.user) {
      setContinueWatching([]);
      return;
    }
    setIsLoading(true);
    const { data, error } = await supabase
      .from('user_continue_watching')
      .select('*')
      .eq('user_id', session.user.id)
      .order('last_watched', { ascending: false });

    if (error) {
      console.error("Error fetching continue watching:", error);
      setContinueWatching([]);
    } else {
      setContinueWatching(data.map(item => ({
        id: item.media_id,
        supabase_id: item.id,
        title: item.title,
        poster_path: item.poster_path,
        media_type: item.media_type,
        progress: item.progress,
        last_watched: new Date(item.last_watched).getTime(),
        season: item.season,
        episode: item.episode,
      })) as ContinueWatchingItem[]);
    }
    setIsLoading(false);
  }, [session]);

  useEffect(() => {
    if (!authLoading) {
      fetchUserWatchlist();
      fetchUserContinueWatching();
    }
  }, [session, authLoading, fetchUserWatchlist, fetchUserContinueWatching]);

  const addToWatchlist = useCallback(async (item: WatchlistItem) => {
    if (!session?.user) {
      return;
    }

    const { data, error } = await supabase
      .from('user_watchlists')
      .insert({
        user_id: session.user.id,
        media_id: item.id,
        media_type: item.media_type,
        title: item.title,
        poster_path: item.poster_path,
        added_at: new Date(item.added_at).toISOString(),
        watched: item.watched || false,
        watch_later: item.watch_later || false,
        rating: item.rating || null,
        notes: item.notes || null,
      })
      .select();

    if (error) {
      console.error("Error adding to watchlist:", error);
    } else if (data) {
      setWatchlist((prev) => [
        {
          ...item,
          supabase_id: data[0].id, // Store Supabase ID separately
          id: item.id, // Ensure TMDB ID is retained
          added_at: new Date(data[0].added_at).getTime(),
        },
        ...prev,
      ]);
    }
  }, [session]);

  const removeFromWatchlist = useCallback(async (mediaId: number) => {
    if (!session?.user) {
      return;
    }

    // Find the Supabase ID for the item to delete using mediaId
    const { data: existingItem, error: fetchError } = await supabase
      .from('user_watchlists')
      .select('supabase_id:id') // Select the Supabase row ID as supabase_id
      .eq('user_id', session.user.id)
      .eq('media_id', mediaId)
      .single();

    if (fetchError || !existingItem) {
      console.error("Error finding watchlist item to remove:", fetchError);
      return;
    }

    const { error } = await supabase
      .from('user_watchlists')
      .delete()
      .eq('id', existingItem.supabase_id);

    if (error) {
      console.error("Error removing from watchlist:", error);
    } else {
      setWatchlist((prev) => prev.filter((item) => item.id !== mediaId));
    }
  }, [session]);

  const isInWatchlist = useCallback(
    (mediaId: number) => {
      return watchlist.some((item) => item.id === mediaId);
    },
    [watchlist]
  );

  const toggleWatched = useCallback(async (mediaId: number) => {
    if (!session?.user) return;

    const itemToUpdate = watchlist.find((item) => item.id === mediaId);
    if (!itemToUpdate || !itemToUpdate.supabase_id) return;

    const { error } = await supabase
      .from('user_watchlists')
      .update({ watched: !itemToUpdate.watched })
      .eq('id', itemToUpdate.supabase_id);

    if (error) {
      console.error("Error toggling watched status:", error);
    } else {
      setWatchlist((prev) =>
        prev.map((item) =>
          item.id === mediaId ? { ...item, watched: !item.watched } : item
        )
      );
    }
  }, [session, watchlist]);

  const toggleWatchLater = useCallback(async (mediaId: number) => {
    if (!session?.user) return;

    const itemToUpdate = watchlist.find((item) => item.id === mediaId);
    if (!itemToUpdate || !itemToUpdate.supabase_id) return;

    const { error } = await supabase
      .from('user_watchlists')
      .update({ watch_later: !itemToUpdate.watch_later })
      .eq('id', itemToUpdate.supabase_id);

    if (error) {
      console.error("Error toggling watch later status:", error);
    } else {
      setWatchlist((prev) =>
        prev.map((item) =>
          item.id === mediaId ? { ...item, watch_later: !item.watch_later } : item
        )
      );
    }
  }, [session, watchlist]);

  const updateRating = useCallback(async (mediaId: number, rating: number) => {
    if (!session?.user) return;

    const itemToUpdate = watchlist.find((item) => item.id === mediaId);
    if (!itemToUpdate || !itemToUpdate.supabase_id) return;

    const { error } = await supabase
      .from('user_watchlists')
      .update({ rating })
      .eq('id', itemToUpdate.supabase_id);

    if (error) {
      console.error("Error updating rating:", error);
    } else {
      setWatchlist((prev) =>
        prev.map((item) => (item.id === mediaId ? { ...item, rating } : item))
      );
    }
  }, [session, watchlist]);

  const updateNotes = useCallback(async (mediaId: number, notes: string) => {
    if (!session?.user) return;

    const itemToUpdate = watchlist.find((item) => item.id === mediaId);
    if (!itemToUpdate || !itemToUpdate.supabase_id) return;

    const { error } = await supabase
      .from('user_watchlists')
      .update({ notes })
      .eq('id', itemToUpdate.supabase_id);

    if (error) {
      console.error("Error updating notes:", error);
    } else {
      setWatchlist((prev) =>
        prev.map((item) => (item.id === mediaId ? { ...item, notes } : item))
      );
    }
  }, [session, watchlist]);

  const getFilteredWatchlist = useCallback(
    (options: WatchlistFilterOptions) => {
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
            comparison = (a.added_at || 0) - (b.added_at || 0);
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
    },
    [watchlist]
  );

  const updateContinueWatching = useCallback(async (item: ContinueWatchingItem) => {
    if (!session?.user) {
      return;
    }

    const { data: existingItems, error: fetchError } = await supabase
      .from('user_continue_watching')
      .select('id')
      .eq('user_id', session.user.id)
      .eq('media_id', item.id)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 means no rows found
      console.error("Error checking existing continue watching item:", fetchError);
      return;
    }

    if (existingItems) {
      // Update existing item
      const { error } = await supabase
        .from('user_continue_watching')
        .update({
          progress: item.progress,
          last_watched: new Date(item.last_watched).toISOString(),
          season: item.season || null,
          episode: item.episode || null,
        })
        .eq('id', existingItems.id);

      if (error) {
        console.error("Error updating continue watching item:", error);
      } else {
        setContinueWatching((prev) =>
          prev.map((prevItem) =>
            prevItem.id === item.id ? { ...prevItem, ...item } : prevItem
          )
        );
      }
    } else {
      // Insert new item
      const { data, error } = await supabase
        .from('user_continue_watching')
        .insert({
          user_id: session.user.id,
          media_id: item.id,
          media_type: item.media_type,
          title: item.title,
          poster_path: item.poster_path,
          progress: item.progress,
          last_watched: new Date(item.last_watched).toISOString(),
          season: item.season || null,
          episode: item.episode || null,
        })
        .select();

      if (error) {
        console.error("Error inserting continue watching item:", error);
      } else if (data) {
        setContinueWatching((prev) => {
          const newList = [
            {
              ...item,
              supabase_id: data[0].id, // Use the ID returned by Supabase for supabase_id
              last_watched: new Date(data[0].last_watched).getTime(),
            },
            ...prev,
          ];
          // Limit list to 20 items and sort by last watched
          return newList
            .sort((a, b) => b.last_watched - a.last_watched)
            .slice(0, 20);
        });
      }
    }
  }, [session]);

  const removeFromContinueWatching = useCallback(async (mediaId: number) => {
    if (!session?.user) return;

    const { data: existingItem, error: fetchError } = await supabase
      .from('user_continue_watching')
      .select('supabase_id:id')
      .eq('user_id', session.user.id)
      .eq('media_id', mediaId)
      .single();

    if (fetchError || !existingItem) {
      console.error("Error finding continue watching item to remove:", fetchError);
      return;
    }

    const { error } = await supabase
      .from('user_continue_watching')
      .delete()
      .eq('id', existingItem.supabase_id);

    if (error) {
      console.error("Error removing from continue watching:", error);
    } else {
      setContinueWatching((prev) => prev.filter((item) => item.id !== mediaId));
    }
  }, [session]);

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
      {!authLoading && children}
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
