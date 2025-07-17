import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import PhishingDetector from "./pages/PhishingDetector";
import PhishingRewriter from "./pages/PhishingRewriter";
import VulnerabilityScanner from "./pages/VulnerabilityScanner";
import EmailAnalyzer from "./pages/EmailAnalyzer";
import NmapScanner from "./pages/NmapScanner";
import Steganography from "./pages/Steganography";
import IpLookup from "./pages/IpLookup";
import Encryption from "./pages/Encryption";
import DnsLookup from "./pages/DnsLookup";
import BreachChecker from "./pages/BreachChecker";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/phishing-detector" element={<PhishingDetector />} />
          <Route path="/phishing-rewriter" element={<PhishingRewriter />} />
          <Route path="/vulnerability-scanner" element={<VulnerabilityScanner />} />
          <Route path="/email-analyzer" element={<EmailAnalyzer />} />
          <Route path="/nmap-scanner" element={<NmapScanner />} />
          <Route path="/steganography" element={<Steganography />} />
          <Route path="/ip-lookup" element={<IpLookup />} />
          <Route path="/encryption" element={<Encryption />} />
          <Route path="/dns-lookup" element={<DnsLookup />} />
          <Route path="/breach-checker" element={<BreachChecker />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
