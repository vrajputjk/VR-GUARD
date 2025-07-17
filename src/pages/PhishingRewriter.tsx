import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Copy, Link, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const PhishingRewriter = () => {
  const [url, setUrl] = useState("");
  const [results, setResults] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const generatePhishingVariants = () => {
    if (!url.trim()) {
      toast({
        title: "Error",
        description: "Please enter a valid URL",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    // Simulate processing delay
    setTimeout(() => {
      const variants = [
        // URL encoding
        url.replace(/\./g, "%2E"),
        // Homograph characters
        url.replace(/o/g, "о").replace(/a/g, "а"),
        // IP-based (example)
        url.replace(/google\.com/g, "172.217.4.174"),
        // Redirect-based
        `http://bit.ly/shortened-${Math.random().toString(36).substr(2, 9)}`,
        // Subdomain spoofing
        url.replace(/https?:\/\//, "https://secure-").replace(/\.com/, "-verification.com"),
      ];
      
      setResults(variants);
      setIsLoading(false);
    }, 1500);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied",
      description: "URL copied to clipboard",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold bg-gradient-cyber bg-clip-text text-transparent">
              Phishing Link Rewriter
            </h1>
            <p className="text-muted-foreground">
              Generate phishing-style URL variants for educational purposes
            </p>
          </div>

          <Alert className="border-destructive/50 bg-destructive/10">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>Educational Use Only:</strong> This tool is for cybersecurity awareness and ethical testing only.
              Do not use for malicious purposes.
            </AlertDescription>
          </Alert>

          <Card className="cyber-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Link className="w-5 h-5" />
                URL Input
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="url">Enter URL to rewrite</Label>
                <Input
                  id="url"
                  placeholder="https://www.google.com"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                />
              </div>
              
              <Button 
                onClick={generatePhishingVariants}
                disabled={isLoading}
                className="w-full relative"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <LoadingSpinner type="pulse" size="sm" />
                    <span>Generating Variants...</span>
                  </div>
                ) : (
                  "Generate Phishing Variants"
                )}
              </Button>
            </CardContent>
          </Card>

          {results.length > 0 && (
            <Card className="cyber-card">
              <CardHeader>
                <CardTitle>Generated Phishing Variants</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {results.map((variant, index) => (
                  <div key={index} className="flex items-center gap-2 p-3 rounded-lg bg-muted/50">
                    <code className="flex-1 text-sm break-all">{variant}</code>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyToClipboard(variant)}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PhishingRewriter;