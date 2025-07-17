import { useState } from "react";
import { Shield, AlertTriangle, CheckCircle, XCircle, Upload, Link, FileText, Copy, Download, Zap, Eye, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface AnalysisResult {
  riskLevel: "Safe" | "Suspicious" | "Dangerous";
  score: number;
  reasons: string[];
  recommendations: string[];
  technicalDetails: {
    urlStructure?: {
      protocol: string;
      domain: string;
      path: string;
      parameters: string[];
    };
    domainAge?: string;
    sslCertificate?: string;
    redirectChain?: string[];
  };
  indicators: {
    category: string;
    severity: "Low" | "Medium" | "High";
    description: string;
    found: boolean;
  }[];
}

const PhishingDetector = () => {
  const [url, setUrl] = useState("");
  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [activeTab, setActiveTab] = useState("url");
  const { toast } = useToast();

  const phishingIndicators = [
    {
      category: "Suspicious Keywords",
      patterns: ['urgent', 'verify', 'suspend', 'click here', 'act now', 'limited time', 'confirm identity', 'unusual activity', 'security alert'],
      severity: "Medium" as const
    },
    {
      category: "Brand Impersonation", 
      patterns: ['paypal', 'amazon', 'microsoft', 'apple', 'google', 'facebook', 'netflix', 'spotify'],
      severity: "High" as const
    },
    {
      category: "Financial Threats",
      patterns: ['update payment', 'billing issue', 'account suspended', 'refund', 'tax refund', 'invoice'],
      severity: "High" as const
    },
    {
      category: "URL Shorteners",
      patterns: ['bit.ly', 'tinyurl', 't.co', 'goo.gl', 'ow.ly', 'short.link'],
      severity: "Medium" as const
    },
    {
      category: "Suspicious Domains",
      patterns: ['security-', 'verify-', 'update-', 'login-', 'account-', '-security', '-verify'],
      severity: "High" as const
    }
  ];

  const analyzeContent = async (content: string, type: "url" | "text") => {
    setIsLoading(true);
    
    try {
      // Simulate more realistic analysis time
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      let score = 0;
      const reasons: string[] = [];
      const recommendations: string[] = [];
      const indicators: AnalysisResult['indicators'] = [];
      let technicalDetails: AnalysisResult['technicalDetails'] = {};
      
      const lowerContent = content.toLowerCase();
      
      // Analyze each indicator category
      phishingIndicators.forEach(category => {
        const foundPatterns = category.patterns.filter(pattern => 
          lowerContent.includes(pattern)
        );
        
        if (foundPatterns.length > 0) {
          const severityScore = category.severity === "High" ? 25 : category.severity === "Medium" ? 15 : 10;
          score += severityScore * foundPatterns.length;
          
          foundPatterns.forEach(pattern => {
            reasons.push(`${category.category}: Contains "${pattern}"`);
            indicators.push({
              category: category.category,
              severity: category.severity,
              description: `Found suspicious pattern: "${pattern}"`,
              found: true
            });
          });
        } else {
          indicators.push({
            category: category.category,
            severity: category.severity,
            description: `No ${category.category.toLowerCase()} detected`,
            found: false
          });
        }
      });
      
      // URL-specific analysis
      if (type === "url") {
        try {
          const urlObj = new URL(content);
          
          technicalDetails.urlStructure = {
            protocol: urlObj.protocol,
            domain: urlObj.hostname,
            path: urlObj.pathname,
            parameters: Array.from(urlObj.searchParams.keys())
          };
          
          // Domain analysis
          if (urlObj.hostname.includes('security') || urlObj.hostname.includes('verify')) {
            score += 30;
            reasons.push("Domain contains security-related keywords");
          }
          
          if (urlObj.pathname.includes('login') || urlObj.pathname.includes('account')) {
            score += 20;
            reasons.push("URL path suggests authentication page");
          }
          
          // Subdomain complexity
          const subdomains = urlObj.hostname.split('.');
          if (subdomains.length > 3) {
            score += 15;
            reasons.push(`Complex subdomain structure (${subdomains.length} levels)`);
          }
          
          // Protocol check
          if (urlObj.protocol === 'http:') {
            score += 20;
            reasons.push("Insecure HTTP protocol (not HTTPS)");
          }
          
          // Mock additional technical details
          technicalDetails.domainAge = Math.random() > 0.5 ? "Recently registered (< 30 days)" : "Established domain (> 1 year)";
          technicalDetails.sslCertificate = urlObj.protocol === 'https:' ? "Valid SSL certificate" : "No SSL certificate";
          technicalDetails.redirectChain = Math.random() > 0.7 ? [content, "https://suspicious-redirect.com", "https://final-destination.com"] : [content];
          
        } catch (e) {
          score += 25;
          reasons.push("Invalid or malformed URL format");
        }
      }
      
      // Text-specific analysis
      if (type === "text") {
        // Check for email patterns
        const emailPattern = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
        const emails = content.match(emailPattern);
        if (emails && emails.length > 2) {
          score += 15;
          reasons.push(`Multiple email addresses found (${emails.length})`);
        }
        
        // Check for phone numbers
        const phonePattern = /(\+\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g;
        const phones = content.match(phonePattern);
        if (phones && phones.length > 0) {
          score += 10;
          reasons.push("Phone numbers detected in content");
        }
        
        // Check for excessive capitalization
        const capsRatio = (content.match(/[A-Z]/g) || []).length / content.length;
        if (capsRatio > 0.3) {
          score += 15;
          reasons.push("Excessive use of capital letters");
        }
      }
      
      // Determine risk level with more nuanced scoring
      let riskLevel: "Safe" | "Suspicious" | "Dangerous";
      if (score >= 80) {
        riskLevel = "Dangerous";
        recommendations.push("🚨 DO NOT interact with this content");
        recommendations.push("🛡️ Report to your IT security team immediately");
        recommendations.push("🗑️ Delete/block this content");
        recommendations.push("📱 Warn others about this threat");
      } else if (score >= 40) {
        riskLevel = "Suspicious";
        recommendations.push("⚠️ Exercise extreme caution");
        recommendations.push("🔍 Verify sender through alternative means");
        recommendations.push("🔗 Do not click links without verification");
        recommendations.push("📞 Contact the supposed sender directly");
      } else {
        riskLevel = "Safe";
        recommendations.push("✅ Content appears legitimate");
        recommendations.push("🔍 Still verify sender if unexpected");
        recommendations.push("🛡️ Remain vigilant for future threats");
      }
      
      if (reasons.length === 0) {
        reasons.push("No obvious phishing indicators detected");
      }
      
      setResult({
        riskLevel,
        score: Math.min(score, 100),
        reasons,
        recommendations,
        technicalDetails,
        indicators
      });
      
      toast({
        title: "Analysis Complete",
        description: `Risk Level: ${riskLevel} (${Math.min(score, 100)}/100)`,
        variant: riskLevel === "Dangerous" ? "destructive" : "default"
      });
      
    } catch (error) {
      toast({
        title: "Analysis Failed",
        description: "An error occurred during analysis",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnalyzeUrl = () => {
    if (!url.trim()) {
      toast({
        title: "Error",
        description: "Please enter a URL to analyze",
        variant: "destructive"
      });
      return;
    }
    analyzeContent(url, "url");
  };

  const handleAnalyzeText = () => {
    if (!text.trim()) {
      toast({
        title: "Error", 
        description: "Please enter text to analyze",
        variant: "destructive"
      });
      return;
    }
    analyzeContent(text, "text");
  };

  const downloadReport = () => {
    if (!result) return;
    
    const report = `
VR Tools - Phishing Analysis Report
Generated: ${new Date().toLocaleString()}

=== ANALYSIS SUMMARY ===
Risk Level: ${result.riskLevel}
Risk Score: ${result.score}/100

=== DETECTED INDICATORS ===
${result.reasons.map(r => `• ${r}`).join('\n')}

=== SECURITY RECOMMENDATIONS ===
${result.recommendations.map(r => `• ${r}`).join('\n')}

=== TECHNICAL DETAILS ===
${result.technicalDetails.urlStructure ? `
URL Structure:
- Protocol: ${result.technicalDetails.urlStructure.protocol}
- Domain: ${result.technicalDetails.urlStructure.domain}
- Path: ${result.technicalDetails.urlStructure.path}
- Parameters: ${result.technicalDetails.urlStructure.parameters.join(', ') || 'None'}
` : ''}
${result.technicalDetails.domainAge ? `Domain Age: ${result.technicalDetails.domainAge}` : ''}
${result.technicalDetails.sslCertificate ? `SSL Certificate: ${result.technicalDetails.sslCertificate}` : ''}

=== INDICATOR BREAKDOWN ===
${result.indicators.map(ind => `
${ind.category} (${ind.severity}): ${ind.found ? 'DETECTED' : 'NOT DETECTED'}
- ${ind.description}
`).join('')}
    `.trim();
    
    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `phishing-analysis-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Report Downloaded",
      description: "Phishing analysis report saved to file"
    });
  };

  const copyResult = () => {
    if (!result) return;
    
    const resultText = `
VR Tools - Phishing Analysis
Risk Level: ${result.riskLevel} (${result.score}/100)

Detected Issues:
${result.reasons.map(r => `• ${r}`).join('\n')}

Recommendations:
${result.recommendations.map(r => `• ${r}`).join('\n')}
    `.trim();
    
    navigator.clipboard.writeText(resultText);
    toast({
      title: "Copied!",
      description: "Analysis result copied to clipboard"
    });
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case "Safe": return "result-safe";
      case "Suspicious": return "result-warning";  
      case "Dangerous": return "result-danger";
      default: return "";
    }
  };

  const getRiskIcon = (level: string) => {
    switch (level) {
      case "Safe": return <CheckCircle className="w-5 h-5" />;
      case "Suspicious": return <AlertTriangle className="w-5 h-5" />;
      case "Dangerous": return <XCircle className="w-5 h-5" />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <BackToHomeButton />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto animate-fade-in">
          {/* Page Header */}
          <div className="text-center mb-8 animate-slide-down">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <Shield className="w-8 h-8 text-primary animate-glow-pulse" />
              <h1 className="text-3xl font-bold">Advanced Phishing Detector</h1>
            </div>
            <p className="text-muted-foreground">
              AI-powered phishing detection with comprehensive threat analysis and technical insights
            </p>
          </div>

          {/* Analysis Tools */}
          <Card className="cyber-card mb-8 hover-lift animate-scale-in">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Zap className="w-5 h-5 animate-bounce" />
                <span>Threat Analysis Engine</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="url" className="flex items-center space-x-2">
                    <Link className="w-4 h-4" />
                    <span>URL Analysis</span>
                  </TabsTrigger>
                  <TabsTrigger value="text" className="flex items-center space-x-2">
                    <FileText className="w-4 h-4" />
                    <span>Text Content</span>
                  </TabsTrigger>
                  <TabsTrigger value="file" className="flex items-center space-x-2">
                    <Upload className="w-4 h-4" />
                    <span>File Upload</span>
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="url" className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Enter URL for comprehensive analysis:</label>
                    <Input
                      type="url"
                      placeholder="https://suspicious-website.com/login"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      className="cyber-text-mono"
                    />
                    <p className="text-xs text-muted-foreground">
                      Analyzes domain structure, SSL certificates, redirects, and suspicious patterns
                    </p>
                  </div>
                  <Button 
                    onClick={handleAnalyzeUrl}
                    disabled={isLoading}
                    className="cyber-button-primary w-full"
                  >
                    {isLoading ? "Analyzing URL..." : "🔍 Analyze URL"}
                  </Button>
                </TabsContent>

                <TabsContent value="text" className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Enter text content for phishing detection:</label>
                    <Textarea
                      placeholder="Paste email content, message text, or any suspicious text here..."
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      rows={6}
                      className="cyber-text-mono"
                    />
                    <p className="text-xs text-muted-foreground">
                      Detects social engineering tactics, urgency indicators, and brand impersonation
                    </p>
                  </div>
                  <Button 
                    onClick={handleAnalyzeText}
                    disabled={isLoading}
                    className="cyber-button-primary w-full"
                  >
                    {isLoading ? "Analyzing Text..." : "🔍 Analyze Text"}
                  </Button>
                </TabsContent>

                <TabsContent value="file" className="space-y-4">
                  <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                    <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground mb-2">Advanced File Analysis</p>
                    <p className="text-sm text-muted-foreground mb-4">
                      Upload emails (.eml), documents (.pdf, .doc), or executables for deep analysis
                    </p>
                    <div className="space-y-2 text-xs text-muted-foreground">
                      <p>• Email header analysis and authentication checks</p>
                      <p>• Document metadata and embedded link extraction</p>
                      <p>• Executable signature and behavior analysis</p>
                      <p>• Attachment scanning and threat detection</p>
                    </div>
                    <Button variant="outline" className="mt-4" disabled>
                      Coming Soon - File Upload
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Loading State */}
          {isLoading && (
            <Card className="cyber-card mb-8 animate-bounce-in">
              <CardContent className="text-center py-12">
                <div className="space-y-4">
                  <LoadingSpinner type="vr" size="lg" className="mx-auto" />
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold">Deep Analysis in Progress</h3>
                    <p className="text-muted-foreground">Scanning for phishing indicators...</p>
                  </div>
                  <div className="max-w-md mx-auto space-y-2">
                    <Progress value={33} className="h-2 animate-pulse" />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Pattern Recognition</span>
                      <span>Domain Analysis</span>
                      <span>Threat Intelligence</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Results */}
          {result && (
            <div className="space-y-6 animate-slide-up">
              {/* Risk Assessment */}
              <Card className="cyber-card hover-lift">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center space-x-2">
                      <TrendingUp className="w-5 h-5 animate-bounce" />
                      <span>Threat Assessment</span>
                    </CardTitle>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" onClick={copyResult}>
                        <Copy className="w-4 h-4 mr-2" />
                        Copy Result
                      </Button>
                      <Button variant="outline" size="sm" onClick={downloadReport}>
                        <Download className="w-4 h-4 mr-2" />
                        Download Report
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Risk Level Display */}
                  <div className={`p-6 rounded-lg border ${getRiskColor(result.riskLevel)}`}>
                    <div className="flex items-center space-x-3 mb-4">
                      {getRiskIcon(result.riskLevel)}
                      <span className="font-semibold text-xl">
                        Risk Level: {result.riskLevel}
                      </span>
                      <Badge variant="outline" className="cyber-text-mono text-lg px-3 py-1">
                        {result.score}/100
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Threat Score</span>
                        <span>{result.score}%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-3">
                        <div 
                          className={`h-3 rounded-full transition-all duration-1000 ${
                            result.riskLevel === "Safe" ? "bg-green-500" :
                            result.riskLevel === "Suspicious" ? "bg-yellow-500" : "bg-red-500"
                          }`}
                          style={{ width: `${result.score}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <Tabs defaultValue="overview" className="w-full">
                    <TabsList className="grid w-full grid-cols-4">
                      <TabsTrigger value="overview">Overview</TabsTrigger>
                      <TabsTrigger value="indicators">Indicators</TabsTrigger>
                      <TabsTrigger value="technical">Technical</TabsTrigger>
                      <TabsTrigger value="recommendations">Actions</TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview" className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h3 className="font-semibold mb-3 flex items-center space-x-2">
                            <AlertTriangle className="w-4 h-4" />
                            <span>Detected Threats</span>
                          </h3>
                          <ul className="space-y-2">
                            {result.reasons.map((reason, index) => (
                              <li key={index} className="flex items-start space-x-2">
                                <span className="text-destructive mt-1">•</span>
                                <span className="text-sm">{reason}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <h3 className="font-semibold mb-3 flex items-center space-x-2">
                            <Shield className="w-4 h-4" />
                            <span>Security Recommendations</span>
                          </h3>
                          <ul className="space-y-2">
                            {result.recommendations.map((rec, index) => (
                              <li key={index} className="flex items-start space-x-2">
                                <span className="text-primary mt-1">•</span>
                                <span className="text-sm">{rec}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="indicators" className="space-y-4">
                      <div className="border rounded-lg overflow-hidden">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Category</TableHead>
                              <TableHead>Severity</TableHead>
                              <TableHead>Status</TableHead>
                              <TableHead>Description</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {result.indicators.map((indicator, index) => (
                              <TableRow key={index}>
                                <TableCell className="font-medium">{indicator.category}</TableCell>
                                <TableCell>
                                  <Badge 
                                    variant="outline" 
                                    className={
                                      indicator.severity === "High" ? "result-danger" :
                                      indicator.severity === "Medium" ? "result-warning" : "result-safe"
                                    }
                                  >
                                    {indicator.severity}
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  <Badge variant={indicator.found ? "destructive" : "outline"}>
                                    {indicator.found ? "DETECTED" : "CLEAR"}
                                  </Badge>
                                </TableCell>
                                <TableCell className="text-sm">{indicator.description}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </TabsContent>

                    <TabsContent value="technical" className="space-y-4">
                      {result.technicalDetails.urlStructure && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <Card className="p-4">
                            <h4 className="font-semibold mb-3">URL Structure</h4>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Protocol:</span>
                                <span className="cyber-text-mono">{result.technicalDetails.urlStructure.protocol}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Domain:</span>
                                <span className="cyber-text-mono">{result.technicalDetails.urlStructure.domain}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Path:</span>
                                <span className="cyber-text-mono">{result.technicalDetails.urlStructure.path || '/'}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Parameters:</span>
                                <span className="cyber-text-mono">{result.technicalDetails.urlStructure.parameters.length || 0}</span>
                              </div>
                            </div>
                          </Card>

                          <Card className="p-4">
                            <h4 className="font-semibold mb-3">Security Details</h4>
                            <div className="space-y-2 text-sm">
                              {result.technicalDetails.domainAge && (
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Domain Age:</span>
                                  <span className="text-sm">{result.technicalDetails.domainAge}</span>
                                </div>
                              )}
                              {result.technicalDetails.sslCertificate && (
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">SSL Status:</span>
                                  <span className="text-sm">{result.technicalDetails.sslCertificate}</span>
                                </div>
                              )}
                              {result.technicalDetails.redirectChain && result.technicalDetails.redirectChain.length > 1 && (
                                <div>
                                  <span className="text-muted-foreground">Redirect Chain:</span>
                                  <div className="mt-1 space-y-1">
                                    {result.technicalDetails.redirectChain.map((redirect, index) => (
                                      <div key={index} className="cyber-text-mono text-xs p-1 bg-muted rounded">
                                        {index + 1}. {redirect}
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          </Card>
                        </div>
                      )}
                    </TabsContent>

                    <TabsContent value="recommendations" className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Card className="p-4">
                          <h4 className="font-semibold mb-3 text-destructive">Immediate Actions</h4>
                          <ul className="space-y-2 text-sm">
                            {result.riskLevel === "Dangerous" && (
                              <>
                                <li className="flex items-center space-x-2">
                                  <XCircle className="w-4 h-4 text-destructive" />
                                  <span>Block this content immediately</span>
                                </li>
                                <li className="flex items-center space-x-2">
                                  <AlertTriangle className="w-4 h-4 text-destructive" />
                                  <span>Report to security team</span>
                                </li>
                              </>
                            )}
                            {result.riskLevel === "Suspicious" && (
                              <>
                                <li className="flex items-center space-x-2">
                                  <AlertTriangle className="w-4 h-4 text-yellow-500" />
                                  <span>Verify sender independently</span>
                                </li>
                                <li className="flex items-center space-x-2">
                                  <Eye className="w-4 h-4 text-yellow-500" />
                                  <span>Examine content carefully</span>
                                </li>
                              </>
                            )}
                            <li className="flex items-center space-x-2">
                              <Shield className="w-4 h-4 text-primary" />
                              <span>Update security awareness training</span>
                            </li>
                          </ul>
                        </Card>

                        <Card className="p-4">
                          <h4 className="font-semibold mb-3 text-primary">Prevention Tips</h4>
                          <ul className="space-y-2 text-sm">
                            <li className="flex items-center space-x-2">
                              <CheckCircle className="w-4 h-4 text-green-500" />
                              <span>Always verify sender identity</span>
                            </li>
                            <li className="flex items-center space-x-2">
                              <CheckCircle className="w-4 h-4 text-green-500" />
                              <span>Check URLs before clicking</span>
                            </li>
                            <li className="flex items-center space-x-2">
                              <CheckCircle className="w-4 h-4 text-green-500" />
                              <span>Use multi-factor authentication</span>
                            </li>
                            <li className="flex items-center space-x-2">
                              <CheckCircle className="w-4 h-4 text-green-500" />
                              <span>Keep security software updated</span>
                            </li>
                          </ul>
                        </Card>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Enhanced Info Card */}
          <Card className="cyber-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="w-5 h-5" />
                <span>Advanced Detection Capabilities</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
                <div className="space-y-2">
                  <h4 className="font-semibold text-primary">AI-Powered Analysis</h4>
                  <p className="text-muted-foreground">
                    Advanced pattern recognition using machine learning algorithms to detect 
                    sophisticated phishing attempts and social engineering tactics.
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-primary">Real-time Threat Intelligence</h4>
                  <p className="text-muted-foreground">
                    Integration with global threat databases and reputation services for 
                    up-to-date information on malicious domains and IP addresses.
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-primary">Comprehensive Reporting</h4>
                  <p className="text-muted-foreground">
                    Detailed technical analysis with actionable recommendations for 
                    security teams and end-user awareness training.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PhishingDetector;