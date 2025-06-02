import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import ErrorBoundary from "@/components/ErrorBoundary";
import AppRoutes from "@/routes";

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <Router>
        <AppRoutes />
        <Toaster />
      </Router>
    </ErrorBoundary>
  );
};

export default App;
