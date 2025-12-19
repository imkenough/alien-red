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
                <Snowfall
                  style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    zIndex: 20,
                    width: "100vw",
                    height: "100vh",
                  }}
                />
                <div className="relative z-0 bg-transparent">          <AppRoutes />
          <Toaster />
        </div>
      </Router>
    </ErrorBoundary>
  );
};

export default App;
