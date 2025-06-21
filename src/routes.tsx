import React, { useEffect } from "react";
import { Routes, Route, useLocation, useParams } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { WatchlistProvider } from "@/contexts/WatchlistContext";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { fetchMediaDetails } from "@/lib/api"; // Assuming you have this function

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

import HomePage from "@/pages/HomePage";
import MoviesPage from "@/pages/MoviesPage";
import TVShowsPage from "@/pages/TVShowsPage";
import SearchPage from "@/pages/SearchPage";
import MediaDetailsPage from "@/pages/MediaDetailsPage";
import WatchlistPage from "@/pages/WatchlistPage";
import GenresPage from "@/pages/GenresPage";
import TermsPage from "@/pages/TermsPage";
import PrivacyPage from "@/pages/PrivacyPage";
import AboutPage from "@/pages/AboutPage";
import ContactPage from "@/pages/ContactPage";

const PageMeta: React.FC = () => {
  const location = useLocation();
  const params = useParams();
  const [title, setTitle] = React.useState("Alien - Watch Movies & TV Shows");
  const [description, setDescription] = React.useState(
    "Stream your favorite movies and TV shows from multiple sources in one place."
  );

  useEffect(() => {
    const path = location.pathname;
    // Default meta tags
    let currentTitle = "Alien - Your Ultimate Hub for Movies & TV Shows Streaming";
    let currentDescription = "Discover and stream a vast collection of movies and TV shows online. Alien offers a seamless streaming experience from multiple sources, all in one place.";

    if (path === "/") {
      currentTitle = "Home - Alien";
      currentDescription = "Welcome to Alien! Your ultimate destination for streaming movies and TV shows from various sources, all in one convenient platform.";
    } else if (path === "/movies") {
      currentTitle = "Movies - Alien";
      currentDescription = "Explore a vast library of movies on Alien. Find new releases, timeless classics, and everything in between.";
    } else if (path === "/tv") {
      currentTitle = "TV Shows - Alien";
      currentDescription = "Binge-watch your favorite TV shows on Alien. Discover popular series and hidden gems across all genres.";
    } else if (path === "/watchlist") {
      currentTitle = "My Watchlist - Alien";
      currentDescription = "Keep track of movies and TV shows you want to watch on Alien. Your personalized watchlist is just a click away.";
    } else if (path === "/search") {
      currentTitle = "Search - Alien";
      currentDescription = "Search for any movie or TV show on Alien. Our powerful search helps you find exactly what you're looking for.";
    } else if (path.startsWith("/genres")) {
        if (params.genreId) {
             // You might want to fetch genre name here if possible, or use a generic title
            currentTitle = `Genre: ${params.genreId} - Alien`;
            currentDescription = `Browse movies and TV shows in the ${params.genreId} genre on Alien.`;
        } else {
            currentTitle = "Genres - Alien";
            currentDescription = "Discover movies and TV shows by genre on Alien. Find your next favorite based on your preferred categories.";
        }
    } else if (params.mediaType && params.id) {
      // Media Details Page
      const { mediaType, id } = params;
      fetchMediaDetails(mediaType, id)
        .then((media) => {
          if (media) {
            const mediaTitle = media.title || media.name;
            setTitle(`${mediaTitle} - Alien`);
            setDescription(media.overview || currentDescription);
          }
        })
        .catch(() => {
          // Fallback to default if fetch fails
          setTitle(`Media Details - Alien`);
          setDescription(currentDescription);
        });
      return; // Early return as title/description are set asynchronously
    } else if (path === "/terms") {
        currentTitle = "Terms of Service - Alien";
        currentDescription = "Read the Terms of Service for using the Alien streaming platform.";
    } else if (path === "/privacy") {
        currentTitle = "Privacy Policy - Alien";
        currentDescription = "Understand how Alien handles your data by reading our Privacy Policy.";
    } else if (path === "/about") {
        currentTitle = "About Us - Alien";
        currentDescription = "Learn more about Alien, our mission, and the team behind your favorite streaming hub.";
    } else if (path === "/contact") {
        currentTitle = "Contact Us - Alien";
        currentDescription = "Get in touch with the Alien team. We're here to help with any questions or feedback.";
    }
    // For other specific pages, add more else-if blocks here

    setTitle(currentTitle);
    setDescription(currentDescription);
  }, [location.pathname, params]);

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
    </Helmet>
  );
};


const AppRoutes: React.FC = () => {
  const location = useLocation();

  // Reset scroll position when location changes
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <HelmetProvider>
    <ThemeProvider>
      <WatchlistProvider>
        <PageMeta /> {/* Add PageMeta here */}
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/movies" element={<MoviesPage />} />
              <Route path="/tv" element={<TVShowsPage />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/watchlist" element={<WatchlistPage />} />
              <Route path="/genres" element={<GenresPage />} />
              <Route path="/genres/:genreId" element={<GenresPage />} />
              <Route path="/:mediaType/:id" element={<MediaDetailsPage />} />
              <Route path="/terms" element={<TermsPage />} />
              <Route path="/privacy" element={<PrivacyPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </WatchlistProvider>
    </ThemeProvider>
  );
};

export default AppRoutes;
