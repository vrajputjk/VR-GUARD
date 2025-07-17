import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Mail, CheckCircle, XCircle, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface EmailAnalysis {
  spf: { status: "Pass" | "Fail" | "Neutral"; details: string };
  dkim: { status: "Pass" | "Fail" | "None"; details: string };
  dmarc: { status: "Pass" | "Fail" | "None"; details: string };
  originIP: string;
  location: string;
  headers: { name: string; value: string }[];
}

const EmailAnalyzer = () => {
  const [emailHeader, setEmailHeader] = useState("");
  const [analysis, setAnalysis] = useState<EmailAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { toast } = useToast();

  const analyzeEmail = () => {
    if (!emailHeader.trim()) {
      toast({
        title: "Error",
        description: "Please enter email headers",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    
    // Simulate email analysis
    setTimeout(() => {
      const mockAnalysis: EmailAnalysis = {
        spf: {
          status: Math.random() > 0.3 ? "Pass" : "Fail",
          details: "v=spf1 include:_spf.google.com ~all"
        },
        dkim: {
          status: Math.random() > 0.2 ? "Pass" : "Fail",
          details: "DKIM signature validated successfully"
        },
        dmarc: {
          status: Math.random() > 0.4 ? "Pass" : "Fail",
          details: "v=DMARC1; p=quarantine; rua=mailto:dmarc@example.com"
        },
        originIP: "192.168.1.100",
        location: "San Francisco, CA, US",
        headers: [
          { name: "Return-Path", value: "<sender@example.com>" },
          { name: "Received", value: "from mail.example.com by mx.google.com" },
          { name: "From", value: "sender@example.com" },
          { name: "To", value: "recipient@domain.com" },
          { name: "Subject", value: "Test Email Subject" }
        ]
      };
      
      setAnalysis(mockAnalysis);
      setIsAnalyzing(false);
    }, 2000);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Pass": return <CheckCircle className="w-4 h-4 text-green-400" />;
      case "Fail": return <XCircle className="w-4 h-4 text-red-400" />;
      default: return <AlertTriangle className="w-4 h-4 text-yellow-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pass": return "bg-green-500/10 text-green-400 border-green-500/30";
      case "Fail": return "bg-red-500/10 text-red-400 border-red-500/30";
      default: return "bg-yellow-500/10 text-yellow-400 border-yellow-500/30";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold bg-gradient-cyber bg-clip-text text-transparent">
              Email Header Analyzer
            </h1>
            <p className="text-muted-foreground">
              Analyze email headers for authentication and security validation
            </p>
          </div>

          <Card className="cyber-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="w-5 h-5" />
                Email Headers
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="headers">Paste email headers</Label>
                <Textarea
                  id="headers"
                  placeholder="Received: from mail.example.com...&#10;From: sender@example.com&#10;To: recipient@domain.com&#10;Subject: Email Subject"
                  value={emailHeader}
                  onChange={(e) => setEmailHeader(e.target.value)}
                  rows={8}
                />
              </div>
              
              <Button 
                onClick={analyzeEmail}
                disabled={isAnalyzing}
                className="w-full relative"
              >
                {isAnalyzing ? (
                  <div className="flex items-center justify-center space-x-2">
                    <LoadingSpinner type="hex" size="sm" />
                    <span>Analyzing Headers...</span>
                  </div>
                ) : (
                  "Analyze Email Headers"
                )}
              </Button>
            </CardContent>
          </Card>

          {analysis && (
            <div className="space-y-6">
              <Card className="cyber-card">
                <CardHeader>
                  <CardTitle>Authentication Results</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="p-4 rounded-lg border border-border">
                      <div className="flex items-center gap-2 mb-2">
                        {getStatusIcon(analysis.spf.status)}
                        <h3 className="font-medium">SPF</h3>
                        <Badge 
                          variant="outline" 
                          className={getStatusColor(analysis.spf.status)}
                        >
                          {analysis.spf.status}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">{analysis.spf.details}</p>
                    </div>

                    <div className="p-4 rounded-lg border border-border">
                      <div className="flex items-center gap-2 mb-2">
                        {getStatusIcon(analysis.dkim.status)}
                        <h3 className="font-medium">DKIM</h3>
                        <Badge 
                          variant="outline" 
                          className={getStatusColor(analysis.dkim.status)}
                        >
                          {analysis.dkim.status}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">{analysis.dkim.details}</p>
                    </div>

                    <div className="p-4 rounded-lg border border-border">
                      <div className="flex items-center gap-2 mb-2">
                        {getStatusIcon(analysis.dmarc.status)}
                        <h3 className="font-medium">DMARC</h3>
                        <Badge 
                          variant="outline" 
                          className={getStatusColor(analysis.dmarc.status)}
                        >
                          {analysis.dmarc.status}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">{analysis.dmarc.details}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="cyber-card">
                <CardHeader>
                  <CardTitle>Origin Analysis</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium">Origin IP</Label>
                      <p className="text-sm text-muted-foreground">{analysis.originIP}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Location</Label>
                      <p className="text-sm text-muted-foreground">{analysis.location}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="cyber-card">
                <CardHeader>
                  <CardTitle>Header Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {analysis.headers.map((header, index) => (
                      <div key={index} className="grid grid-cols-4 gap-2 py-2 border-b border-border last:border-0">
                        <div className="font-mono text-sm font-medium">{header.name}:</div>
                        <div className="col-span-3 text-sm text-muted-foreground break-all">{header.value}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default EmailAnalyzer;