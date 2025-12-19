import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import ErrorBoundary from "@/components/ErrorBoundary";
import AppRoutes from "@/routes";
import Snowfall from "react-snowfall";

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <Router>
        <Snowfall />
        <AppRoutes />
        <Toaster />
      </Router>
    </ErrorBoundary>
  );
};

export default App;
