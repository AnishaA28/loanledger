import { Button } from "@/components/ui/button";
import { Link, useLocation } from "@tanstack/react-router";
import { Banknote, LogIn, LogOut, Menu, X } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../hooks/use-auth";

const NAV_LINKS = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/loans/new", label: "New Loan" },
];

export function Layout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoggingIn, isInitializing, login, logout } =
    useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border shadow-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between gap-4">
          {/* Brand */}
          <Link
            to="/dashboard"
            className="flex items-center gap-2 font-display font-bold text-lg text-foreground hover:text-primary transition-colors"
            data-ocid="nav.brand_link"
          >
            <Banknote className="w-5 h-5 text-primary" aria-hidden="true" />
            LoanLedger
          </Link>

          {/* Desktop nav */}
          <nav
            className="hidden md:flex items-center gap-1"
            aria-label="Main navigation"
          >
            {NAV_LINKS.map((link) => {
              const active = location.pathname.startsWith(link.to);
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={[
                    "px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
                    active
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted",
                  ].join(" ")}
                  data-ocid={`nav.${link.label.toLowerCase().replace(/\s+/g, "_")}_link`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Auth + mobile toggle */}
          <div className="flex items-center gap-2">
            {isAuthenticated ? (
              <Button
                variant="outline"
                size="sm"
                onClick={logout}
                className="hidden md:inline-flex gap-1.5"
                data-ocid="nav.logout_button"
              >
                <LogOut className="w-4 h-4" aria-hidden="true" />
                Sign out
              </Button>
            ) : (
              <Button
                size="sm"
                onClick={login}
                disabled={isLoggingIn || isInitializing}
                className="hidden md:inline-flex gap-1.5"
                data-ocid="nav.login_button"
              >
                <LogIn className="w-4 h-4" aria-hidden="true" />
                {isLoggingIn ? "Signing in…" : "Sign in"}
              </Button>
            )}

            {/* Mobile menu toggle */}
            <button
              type="button"
              className="md:hidden p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              data-ocid="nav.mobile_menu_toggle"
            >
              {mobileOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile nav drawer */}
        {mobileOpen && (
          <div className="md:hidden border-t border-border bg-card px-4 py-3 flex flex-col gap-1">
            {NAV_LINKS.map((link) => {
              const active = location.pathname.startsWith(link.to);
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileOpen(false)}
                  className={[
                    "px-3 py-2 rounded-md text-sm font-medium transition-colors",
                    active
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted",
                  ].join(" ")}
                  data-ocid={`nav.mobile_${link.label.toLowerCase().replace(/\s+/g, "_")}_link`}
                >
                  {link.label}
                </Link>
              );
            })}
            <div className="pt-2 border-t border-border mt-1">
              {isAuthenticated ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    logout();
                    setMobileOpen(false);
                  }}
                  className="w-full gap-1.5"
                  data-ocid="nav.mobile_logout_button"
                >
                  <LogOut className="w-4 h-4" />
                  Sign out
                </Button>
              ) : (
                <Button
                  size="sm"
                  onClick={() => {
                    login();
                    setMobileOpen(false);
                  }}
                  disabled={isLoggingIn || isInitializing}
                  className="w-full gap-1.5"
                  data-ocid="nav.mobile_login_button"
                >
                  <LogIn className="w-4 h-4" />
                  {isLoggingIn ? "Signing in…" : "Sign in"}
                </Button>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Main content */}
      <main className="flex-1 bg-background">{children}</main>

      {/* Footer */}
      <footer className="bg-muted/40 border-t border-border py-4">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()}. Built with love using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            caffeine.ai
          </a>
        </div>
      </footer>
    </div>
  );
}
