import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Film, Home, Menu, Search, X, Cigarette, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import SearchBar from "@/components/SearchBar";
import { cn } from "@/lib/utils";

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const isHomePage = location.pathname === "/";
  const isGenresPage = location.pathname.startsWith("/genres");

  const handleScroll = () => {
    const scrollPosition = window.scrollY;
    setIsScrolled(scrollPosition > 50);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const navItems = [
    { label: "Home", path: "/", icon: <Home className="h-4 w-4 mr-2" /> },
    {
      label: "Movies",
      path: "/movies",
      icon: <Film className="h-4 w-4 mr-2" />,
    },
    { label: "TV Shows", path: "/tv", icon: <Film className="h-4 w-4 mr-2" /> },
    {
      label: "Genres",
      path: "/genres",
      icon: <List className="h-4 w-4 mr-2" />,
      isActive: isGenresPage,
    },
    // {
    //   label: "Search",
    //   path: "/search",
    //   icon: <Search className="h-4 w-4 mr-2" />,
    // },
  ];

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-[100] transition-all duration-300",
        isScrolled || !isHomePage
          ? "bg-background/95 backdrop-blur-md border-b border-border/50 shadow-lg"
          : "bg-gradient-to-b from-background/90 to-transparent border-transparent"
      )}
    >
      <div className="container flex h-16 items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-4 sm:gap-8">
          <Link
            to="/"
            className="flex items-center space-x-2 transition-transform hover:scale-105"
          >
            <Cigarette className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
            <span className="font-oswald font-bold text-lg sm:text-xl bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
              Alien
            </span>
          </Link>

          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Button
                key={item.path}
                variant={
                  item.isActive || location.pathname === item.path
                    ? "secondary"
                    : "ghost"
                }
                asChild
                className={cn(
                  "text-sm font-medium transition-all duration-200",
                  item.isActive || location.pathname === item.path
                    ? "bg-primary/10 text-primary hover:bg-primary/20"
                    : "hover:bg-white/5"
                )}
              >
                <Link to={item.path}>
                  {item.icon}
                  {item.label}
                </Link>
              </Button>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          <div className="hidden sm:block w-64 md:w-80 lg:w-96">
            <SearchBar />
          </div>

          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden hover:bg-white/5"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-[280px] sm:w-[350px] bg-background/95 backdrop-blur-md border-l border-border/50"
            >
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between mb-6 sm:mb-8">
                  <SheetClose asChild>
                    <Link to="/" className="flex items-center space-x-1">
                      <Cigarette className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                      <span className="font-oswald font-bold text-lg sm:text-xl bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                        Alien
                      </span>
                    </Link>
                  </SheetClose>
                </div>

                <div className="sm:hidden mb-6">
                  <SearchBar onSelect={() => setIsMobileMenuOpen(false)} />
                </div>

                <nav className="flex flex-col space-y-2">
                  {navItems.map((item) => (
                    <SheetClose key={item.path} asChild>
                      <Button
                        variant={
                          item.isActive || location.pathname === item.path
                            ? "secondary"
                            : "ghost"
                        }
                        asChild
                        className={cn(
                          "justify-start text-sm font-medium transition-all duration-200",
                          item.isActive || location.pathname === item.path
                            ? "bg-primary/10 text-primary hover:bg-primary/20"
                            : "hover:bg-white/5"
                        )}
                      >
                        <Link to={item.path}>
                          {item.icon}
                          {item.label}
                        </Link>
                      </Button>
                    </SheetClose>
                  ))}
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;
