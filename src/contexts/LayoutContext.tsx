import React, { createContext, useContext, useEffect, useState } from "react";

type LayoutMode = "contained" | "fluid";

interface LayoutContextType {
  layoutMode: LayoutMode;
  toggleLayout: () => void;
  bannerMessage: string;
  setBannerMessage: (msg: string) => void;
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

  const DEFAULT_BANNER_MESSAGE = "Alienred stands with Palestine.";

  const [bannerMessage, setBannerMessage] = useState<string>(() => {
    const saved = localStorage.getItem("bannerMessage");
    const lastDefault = localStorage.getItem("lastDefaultBannerMessage");

    // If there's no saved message, or if the saved message was the PREVIOUS default
    // and we have a NEW default, update it.
    if (!saved || saved === lastDefault) {
      return DEFAULT_BANNER_MESSAGE;
    }
    return saved;
  });

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

  useEffect(() => {
    localStorage.setItem("bannerMessage", bannerMessage);
    // If the message being saved matches our current code default,
    // track that this was the default used.
    if (bannerMessage === DEFAULT_BANNER_MESSAGE) {
      localStorage.setItem("lastDefaultBannerMessage", DEFAULT_BANNER_MESSAGE);
    }
  }, [bannerMessage]);

  return (
    <LayoutContext.Provider
      value={{
        layoutMode,
        toggleLayout,
        bannerMessage,
        setBannerMessage,
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
