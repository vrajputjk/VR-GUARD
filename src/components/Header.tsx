import { Shield, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Link } from "react-router-dom";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <header className="cyber-card sticky top-0 z-50 backdrop-blur-md bg-background/95 animate-slide-down">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group hover-glow">
            <Shield className="w-8 h-8 text-primary group-hover:text-accent transition-all duration-300 animate-float" />
            <span className="text-xl font-bold bg-gradient-cyber bg-clip-text text-transparent animate-gradient-shift">
              VR-Guard
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6 animate-fade-in">
            <Link to="/" className="text-foreground hover:text-primary transition-all duration-300 hover:scale-105">
              Dashboard
            </Link>
            <Link to="/phishing-detector" className="text-foreground hover:text-primary transition-all duration-300 hover:scale-105">
              Tools
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden hover:scale-110 transition-transform duration-300"
            onClick={toggleMenu}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden mt-4 py-4 border-t border-border animate-slide-down">
            <div className="flex flex-col space-y-3">
              <Link 
                to="/" 
                className="text-foreground hover:text-primary transition-all duration-300 py-2 hover:translate-x-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Dashboard
              </Link>
              <Link 
                to="/phishing-detector" 
                className="text-foreground hover:text-primary transition-all duration-300 py-2 hover:translate-x-2"
                onClick={() => setIsMenuOpen(false)}
              >
                All Tools
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;