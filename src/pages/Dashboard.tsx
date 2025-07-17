import { Search, Shield, Wifi, Lock, Globe, Scan, Link2, Zap, Eye, Key, AlertTriangle, Database } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ToolCard from "@/components/ToolCard";

const Dashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const tools = [
    {
      title: "Phishing Detector",
      description: "Analyze URLs, text, and files for phishing indicators with AI-powered detection",
      icon: Shield,
      href: "/phishing-detector",
      category: "Threat Detection",
      difficulty: "Beginner" as const,
      status: "Available" as const
    },
    {
      title: "What is My IP",
      description: "Discover your public IP address, location, ISP info, and network details",
      icon: Wifi,
      href: "/ip-lookup",
      category: "Network Analysis",
      difficulty: "Beginner" as const,
      status: "Available" as const
    },
    {
      title: "Encryption/Decryption",
      description: "Encrypt and decrypt text or files using AES, RSA, and Base64 algorithms",
      icon: Lock,
      href: "/encryption",
      category: "Cryptography",
      difficulty: "Intermediate" as const,
      status: "Available" as const
    },
    {
      title: "DNS Lookup",
      description: "Perform comprehensive DNS record lookups including A, MX, TXT, and WHOIS",
      icon: Globe,
      href: "/dns-lookup",
      category: "Network Analysis",
      difficulty: "Beginner" as const,
      status: "Available" as const
    },
    {
      title: "Nmap Scanner",
      description: "Basic and advanced port scanning with service detection and OS fingerprinting",
      icon: Scan,
      href: "/nmap-scanner",
      category: "Reconnaissance",
      difficulty: "Advanced" as const,
      status: "Available" as const
    },
    {
      title: "Phishing Link Rewriter",
      description: "Create phishing-style links for security awareness training and education",
      icon: Link2,
      href: "/phishing-rewriter",
      category: "Social Engineering",
      difficulty: "Intermediate" as const,
      status: "Available" as const
    },
    {
      title: "Vulnerability Scanner",
      description: "Scan websites for SQL injection, XSS, and other security vulnerabilities",
      icon: Zap,
      href: "/vulnerability-scanner",
      category: "Web Security",
      difficulty: "Advanced" as const,
      status: "Available" as const
    },
    {
      title: "Email Header Analyzer",
      description: "Analyze email headers for SPF, DKIM, DMARC validation and origin tracking",
      icon: Eye,
      href: "/email-analyzer",
      category: "Email Security",
      difficulty: "Intermediate" as const,
      status: "Available" as const
    },
    {
      title: "Steganography Tool",
      description: "Hide and extract secret messages from images using advanced steganography",
      icon: Key,
      href: "/steganography",
      category: "Cryptography",
      difficulty: "Advanced" as const,
      status: "Available" as const
    },
    {
      title: "Breach Checker",
      description: "Check if email addresses have been compromised in known data breaches",
      icon: AlertTriangle,
      href: "/breach-checker",
      category: "Threat Intelligence",
      difficulty: "Beginner" as const,
      status: "Available" as const
    }
  ];

  const filteredTools = tools.filter(tool =>
    tool.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tool.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tool.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const categories = [...new Set(tools.map(tool => tool.category))];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 animate-bounce-in">
            <span className="bg-gradient-cyber bg-clip-text text-transparent animate-gradient-shift">
              VR-Guard
            </span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto animate-slide-up">
            Advanced cybersecurity toolkit for penetration testing, digital forensics, 
            and security awareness training. Built for professionals and enthusiasts.
          </p>
          
          {/* Search Bar */}
          <div className="max-w-md mx-auto relative animate-scale-in">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              type="text"
              placeholder="Search tools..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 cyber-card border-border hover-glow transition-all duration-300"
            />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12 stagger-animation">
          <div className="cyber-card p-4 text-center hover-lift">
            <div className="text-2xl font-bold text-primary animate-bounce-in">{tools.length}</div>
            <div className="text-sm text-muted-foreground">Total Tools</div>
          </div>
          <div className="cyber-card p-4 text-center hover-lift">
            <div className="text-2xl font-bold text-accent animate-bounce-in">{categories.length}</div>
            <div className="text-sm text-muted-foreground">Categories</div>
          </div>
          <div className="cyber-card p-4 text-center hover-lift">
            <div className="text-2xl font-bold text-cyber-green">
              {tools.filter(t => t.status === "Available").length}
            </div>
            <div className="text-sm text-muted-foreground">Available</div>
          </div>
          <div className="cyber-card p-4 text-center hover-lift">
            <div className="text-2xl font-bold text-cyber-orange animate-bounce-in">
              {categories.length}
            </div>
            <div className="text-sm text-muted-foreground">Categories</div>
          </div>
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 stagger-animation">
          {filteredTools.map((tool, index) => (
            <ToolCard
              key={index}
              title={tool.title}
              description={tool.description}
              icon={tool.icon}
              href={tool.href}
              category={tool.category}
              difficulty={tool.difficulty}
              status={tool.status}
            />
          ))}
        </div>

        {/* No Results */}
        {filteredTools.length === 0 && searchTerm && (
          <div className="text-center py-12 animate-fade-in">
            <Database className="w-16 h-16 text-muted-foreground mx-auto mb-4 animate-bounce" />
            <h3 className="text-lg font-semibold mb-2">No tools found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search terms or browse all available tools.
            </p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Dashboard;