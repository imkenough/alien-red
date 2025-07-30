import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { WatchlistProvider } from "@/contexts/WatchlistContext";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

import HomePage from "@/pages/HomePage";
import MoviesPage from "@/pages/MoviesPage";
import TVShowsPage from "@/pages/TVShowsPage";
import SearchPage from "@/pages/SearchPage";
import MediaDetailsPage from "@/pages/MediaDetailsPage";
import WatchlistPage from "@/pages/WatchlistPage";
import GenresPage from "@/pages/GenresPage";
import ProtectedRoute from "@/components/ProtectedRoute";
import TermsPage from "@/pages/TermsPage";
import PrivacyPage from "@/pages/PrivacyPage";
import AboutPage from "@/pages/AboutPage";
import ContactPage from "@/pages/ContactPage";
import NotFoundPage from "@/pages/NotFoundPage";
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";


const AppRoutes: React.FC = () => {
  const location = useLocation();

  // Reset scroll position when location changes
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <ThemeProvider>
      <WatchlistProvider>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/movies" element={<MoviesPage />} />
              <Route path="/tv" element={<TVShowsPage />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/watchlist" element={<ProtectedRoute><WatchlistPage /></ProtectedRoute>} />
              
              <Route path="/genres" element={<GenresPage />} />
              <Route path="/genres/:genreId" element={<GenresPage />} />
              <Route path="/:mediaType/:id" element={<MediaDetailsPage />} />
              <Route path="/terms" element={<TermsPage />} />
              <Route path="/privacy" element={<PrivacyPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </WatchlistProvider>
    </ThemeProvider>
  );
};

export default AppRoutes;
