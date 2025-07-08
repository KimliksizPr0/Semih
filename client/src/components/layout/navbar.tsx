import { useState } from "react";
import { Link, useLocation } from "wouter";

import { Button } from "@/components/ui/button";
import { Menu, X, Archive } from "lucide-react";

export function Navbar() {
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { path: "/", label: "Ana Sayfa" },
    { path: "/applications", label: "Uygulamalar" },
    { path: "/0yunlar", label: "0yunlar" },
    { path: "/chat", label: "Sohbet" },
  ];

  const mobileNavItems = [
    { path: "/", label: "Ana Sayfa" },
    { path: "/applications", label: "Uygulamalar" },
    { path: "/0yunlar", label: "0yunlar" },
    { path: "/chat", label: "Sohbet" },
    { path: "/admin-login", label: "Admin" },
  ];

  const isActive = (path: string) => location === path;

  return (
    <nav className="bg-dark-card/80 backdrop-blur-sm border-b border-gray-700 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="text-xl font-bold text-accent-green flex items-center space-x-2">
              <Archive className="h-5 w-5" />
              <span data-semih-topak-hover="true">Semih Topak</span>
            </div>
          </div>
          
          <div className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <Link key={item.path} href={item.path}
                className={`cursor-pointer transition-colors duration-300 ${
                  isActive(item.path)
                    ? "text-accent-green"
                    : "text-dark-muted hover:text-accent-green hover:bg-accent-green/10"
                }`}
                data-navbar-item-hover="true"
              >
                {item.label}
              </Link>
            ))}

          </div>
          
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg text-dark-text hover:text-accent-green hover:bg-accent-green/10 transition-all duration-200"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <div className="space-y-1">
                  <div className="w-5 h-0.5 bg-current rounded-full"></div>
                  <div className="w-5 h-0.5 bg-current rounded-full"></div>
                  <div className="w-5 h-0.5 bg-current rounded-full"></div>
                </div>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-dark-card/95 backdrop-blur-sm border-b border-gray-700 shadow-lg">
          <div className="px-4 py-4 space-y-1">
            {mobileNavItems.map((item) => (
              <Link key={item.path} href={item.path}>
                <span
                  className={`block cursor-pointer px-3 py-2 rounded-lg transition-all duration-200 ${
                    isActive(item.path)
                      ? "text-accent-green bg-accent-green/10"
                      : "text-dark-muted hover:text-accent-green hover:bg-accent-green/5"
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.label}
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
