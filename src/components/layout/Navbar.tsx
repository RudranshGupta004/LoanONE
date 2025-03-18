
import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { MenuIcon, X } from "lucide-react";

const Navbar = () => {
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Check if user is on the login page or another authenticated page
  const isAuthPage = location.pathname.includes("login") || 
                    location.pathname.includes("questionnaire") || 
                    location.pathname.includes("document-upload") || 
                    location.pathname.includes("loan-status");

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out px-6 md:px-12 py-4",
        {
          "bg-white/80 backdrop-blur-md shadow-sm": isScrolled,
          "bg-transparent": !isScrolled,
        }
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link 
          to="/" 
          className="text-2xl font-bold tracking-tight text-primary animate-fade-in"
        >
          QuickLoanHub
        </Link>

        {/* Desktop Menu - Hidden on auth pages */}
        {!isAuthPage && (
          <div className="hidden md:flex items-center space-x-8">
            <NavLink href="/" label="Home" />
            <NavLink href="/about" label="About Us" />
            <NavLink href="/contact" label="Contact" />
            <Button asChild variant="ghost" className="hover:bg-primary/5">
              <Link to="/login">Log in</Link>
            </Button>
            <Button asChild className="shadow-sm hover:shadow-md transition-shadow">
              <Link to="/login">Get Started</Link>
            </Button>
          </div>
        )}

        {/* Mobile Menu Button - Hidden on auth pages */}
        {!isAuthPage && (
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-primary p-2"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {mobileMenuOpen ? <X size={24} /> : <MenuIcon size={24} />}
          </button>
        )}

        {/* Auth Pages - Show Logout button */}
        {isAuthPage && (
          <div className="flex items-center">
            <Button asChild variant="ghost" className="hover:bg-primary/5">
              <Link to="/">Logout</Link>
            </Button>
          </div>
        )}
      </div>

      {/* Mobile Menu - Animated slide down/up */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-md shadow-md z-50 animate-slide-down">
          <div className="flex flex-col p-6 space-y-4">
            <MobileNavLink href="/" label="Home" onClick={() => setMobileMenuOpen(false)} />
            <MobileNavLink href="/about" label="About Us" onClick={() => setMobileMenuOpen(false)} />
            <MobileNavLink href="/contact" label="Contact" onClick={() => setMobileMenuOpen(false)} />
            <Button asChild variant="ghost" className="justify-start hover:bg-primary/5">
              <Link to="/login" onClick={() => setMobileMenuOpen(false)}>Log in</Link>
            </Button>
            <Button asChild className="shadow-sm hover:shadow-md transition-shadow">
              <Link to="/login" onClick={() => setMobileMenuOpen(false)}>Get Started</Link>
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
};

// Desktop Nav Link
interface NavLinkProps {
  href: string;
  label: string;
}

const NavLink = ({ href, label }: NavLinkProps) => {
  const location = useLocation();
  const isActive = location.pathname === href;

  return (
    <Link
      to={href}
      className={cn(
        "text-foreground/80 hover:text-primary transition-colors relative py-1",
        isActive && "text-primary"
      )}
    >
      {label}
      {isActive && (
        <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded animate-fade-in" />
      )}
    </Link>
  );
};

// Mobile Nav Link
interface MobileNavLinkProps extends NavLinkProps {
  onClick: () => void;
}

const MobileNavLink = ({ href, label, onClick }: MobileNavLinkProps) => {
  const location = useLocation();
  const isActive = location.pathname === href;

  return (
    <Link
      to={href}
      onClick={onClick}
      className={cn(
        "text-foreground/80 hover:text-primary transition-colors py-2 px-4 rounded",
        isActive && "text-primary bg-primary/5"
      )}
    >
      {label}
    </Link>
  );
};

export default Navbar;
