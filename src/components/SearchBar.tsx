import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { api, getPosterUrl } from "@/lib/api";
import { Movie, TVShow, Person, MediaType } from "@/lib/types";
import { useDebounce } from "@/hooks/useDebounce";
import { useOnClickOutside } from "@/hooks/useOnClickOutside";
import { Skeleton } from "@/components/ui/skeleton";

interface SearchBarProps {
  className?: string;
  onSelect?: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ className, onSelect }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<(Movie | TVShow | Person)[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const debouncedQuery = useDebounce(query, 500);
  const containerRef = useRef<HTMLDivElement>(null);

  useOnClickOutside(containerRef, () => setIsOpen(false));

  useEffect(() => {
    if (debouncedQuery.length >= 2) {
      setIsLoading(true);
      api
        .search(debouncedQuery)
        .then((data) => {
          setResults(data.results.slice(0, 8)); // Limit to 8 results
          setIsOpen(true);
        })
        .catch((error) => {})
        .finally(() => setIsLoading(false));
    } else {
      setResults([]);
      setIsOpen(false);
    }
  }, [debouncedQuery]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    if (e.target.value.length > 0) {
      setIsLoading(true);
    }
  };

  const handleClear = () => {
    setQuery("");
    setResults([]);
    setIsOpen(false);
  };

  const handleItemClick = (item: Movie | TVShow | Person) => {
    const mediaType = item.media_type || ("title" in item ? "movie" : "tv");
    navigate(`/${mediaType}/${item.id}`);
    setQuery("");
    setIsOpen(false);
    onSelect?.();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
      setIsOpen(false);
      onSelect?.();
    }
  };

  const getItemTitle = (item: Movie | TVShow | Person): string => {
    if ("name" in item && item.media_type === "person") {
      return item.name;
    } else if ("title" in item) {
      return item.title || item.name || "Untitled";
    } else if ("name" in item) {
      return item.name;
    }
    return "Unknown";
  };

  const getItemImage = (item: Movie | TVShow | Person): string | null => {
    if ("profile_path" in item && item.media_type === "person") {
      return getPosterUrl(item.profile_path, "w185");
    } else if ("poster_path" in item) {
      return getPosterUrl(item.poster_path, "w92");
    }
    return null;
  };

  const getItemYear = (item: Movie | TVShow | Person): string => {
    if ("release_date" in item && item.release_date) {
      return item.release_date.substring(0, 4);
    } else if ("first_air_date" in item && item.first_air_date) {
      return item.first_air_date.substring(0, 4);
    }
    return "";
  };

  const getMediaTypeLabel = (type?: MediaType): string => {
    switch (type) {
      case "movie":
        return "Movie";
      case "tv":
        return "TV Show";
      case "person":
        return "Person";
      default:
        return "";
    }
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={query}
            onChange={handleChange}
            placeholder="Search movies, TV shows..."
            className="pl-10 pr-10 py-2 h-10 bg-muted/50 border-none focus-visible:ring-1"
          />
          {query && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-0 top-0 h-10 w-10"
              onClick={handleClear}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </form>

      {isOpen && (
        <div className="absolute z-50 mt-1 w-full bg-card rounded-md shadow-lg border border-border overflow-hidden">
          {isLoading ? (
            <div className="p-4 space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center space-x-3">
                  <Skeleton className="h-12 w-8 rounded" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : results.length > 0 ? (
            <ul className="max-h-96 overflow-y-auto">
              {results.map((item) => (
                <li
                  key={`${item.id}-${item.media_type || "unknown"}`}
                  className="border-b border-border last:border-0"
                >
                  <button
                    className="w-full px-4 py-2 flex items-center hover:bg-muted transition-colors text-left"
                    onClick={() => handleItemClick(item)}
                  >
                    <div className="flex-shrink-0 h-16 w-12 mr-3 bg-muted rounded overflow-hidden">
                      {getItemImage(item) ? (
                        <img
                          src={getItemImage(item)!}
                          alt={getItemTitle(item)}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center bg-muted text-xs text-muted-foreground">
                          No image
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm line-clamp-1">
                        {getItemTitle(item)}
                      </h4>
                      <div className="flex items-center text-xs text-muted-foreground mt-1">
                        <span className="bg-muted px-1.5 py-0.5 rounded mr-2">
                          {getMediaTypeLabel(item.media_type)}
                        </span>
                        {getItemYear(item) && <span>{getItemYear(item)}</span>}
                      </div>
                    </div>
                  </button>
                </li>
              ))}
              <li className="p-2">
                <Button
                  variant="ghost"
                  className="w-full text-sm"
                  onClick={() =>
                    navigate(`/search?q=${encodeURIComponent(query.trim())}`)
                  }
                >
                  View all results for "{query}"
                </Button>
              </li>
            </ul>
          ) : query.length >= 2 ? (
            <div className="p-4 text-center text-muted-foreground">
              No results found for "{query}"
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
