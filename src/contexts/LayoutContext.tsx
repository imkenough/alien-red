import React, { createContext, useContext, useEffect, useState } from "react";

type LayoutMode = "contained" | "fluid";

interface LayoutContextType {
  layoutMode: LayoutMode;
  toggleLayout: () => void;
  bannerMessage: string;
  isBannerVisible: boolean;
  setBannerVisible: (visible: boolean) => void;
}

const LayoutContext = createContext<LayoutContextType | undefined>(undefined);

export const LayoutProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [layoutMode, setLayoutMode] = useState<LayoutMode>(() => {
    const saved = localStorage.getItem("layoutMode");
    return (saved as LayoutMode) || "contained";
  });

  const bannerMessage = "Alienred stands with Palestine.";

  const [isBannerVisible, setBannerVisible] = useState<boolean>(true);

  const toggleLayout = () => {
    setLayoutMode((prev) => (prev === "contained" ? "fluid" : "contained"));
  };

  useEffect(() => {
    localStorage.setItem("layoutMode", layoutMode);
    const root = window.document.documentElement;
    if (layoutMode === "fluid") {
      root.classList.add("layout-fluid");
    } else {
      root.classList.remove("layout-fluid");
    }
  }, [layoutMode]);

  return (
    <LayoutContext.Provider
      value={{
        layoutMode,
        toggleLayout,
        bannerMessage,
        isBannerVisible,
        setBannerVisible,
      }}
    >
      {children}
    </LayoutContext.Provider>
  );
};

export const useLayout = (): LayoutContextType => {
  const context = useContext(LayoutContext);
  if (context === undefined) {
    throw new Error("useLayout must be used within a LayoutProvider");
  }
  return context;
};
