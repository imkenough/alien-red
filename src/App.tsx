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
        <Snowfall className="fixed inset-0 z-0" />
        <div className="relative z-10 bg-transparent">
          <AppRoutes />
          <Toaster />
        </div>
      </Router>
    </ErrorBoundary>
  );
};

export default App;
