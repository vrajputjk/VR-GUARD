import { Shield, AlertTriangle } from "lucide-react";

const Footer = () => {
  return (
    <footer className="cyber-card mt-12 border-t border-border animate-fade-in">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 stagger-animation">
          {/* Logo and Description */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Shield className="w-6 h-6 text-primary animate-glow-pulse" />
              <span className="font-bold text-lg bg-gradient-cyber bg-clip-text text-transparent">VR-Guard</span>
            </div>
            <p className="text-muted-foreground text-sm">
              Advanced cybersecurity tools for penetration testing, 
              digital forensics, and security awareness training.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Quick Access</h3>
            <div className="space-y-2 text-sm">
              <a href="/phishing-detector" className="block text-muted-foreground hover:text-primary transition-all duration-300 hover:translate-x-2">
                Phishing Detector
              </a>
              <a href="/ip-lookup" className="block text-muted-foreground hover:text-primary transition-all duration-300 hover:translate-x-2">
                IP Lookup Tool
              </a>
              <a href="/encryption" className="block text-muted-foreground hover:text-primary transition-all duration-300 hover:translate-x-2">
                Encryption Tools
              </a>
              <a href="/dns-lookup" className="block text-muted-foreground hover:text-primary transition-all duration-300 hover:translate-x-2">
                DNS Lookup
              </a>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 text-warning-orange">
              <AlertTriangle className="w-5 h-5 animate-bounce" />
              <h3 className="font-semibold">Important Notice</h3>
            </div>
            <div className="text-xs text-muted-foreground space-y-2">
              <p>
                These tools are for educational and authorized testing purposes only.
              </p>
              <p>
                Use responsibly and in compliance with applicable laws and regulations.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-border text-center">
          <p className="text-xs text-muted-foreground">
            © 2024 VR-Guard. Built for cybersecurity professionals and enthusiasts.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;