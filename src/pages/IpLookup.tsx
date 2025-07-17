import { useState, useEffect } from "react";
import { Wifi, MapPin, Globe, Building, Copy, RefreshCw, Shield, AlertTriangle, ExternalLink, Download, History } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BackToHomeButton from "@/components/BackToHomeButton";
import LoadingSpinner from "@/components/LoadingSpinner";

interface IpInfo {
  ip: string;
  location: {
    city: string;
    region: string;
    country: string;
    countryCode: string;
    timezone: string;
    coordinates: {
      lat: number;
      lon: number;
    };
  };
  network: {
    isp: string;
    organization: string;
    asn: string;
    type: string;
    domain: string;
  };
  security: {
    isVpn: boolean;
    isProxy: boolean;
    isTor: boolean;
    threat: string;
    riskScore: number;
  };
  additional: {
    userAgent: string;
    languages: string[];
    platform: string;
    screenResolution: string;
  };
}

interface IpHistory {
  ip: string;
  timestamp: string;
  location: string;
}

const IpLookup = () => {
  const [ipInfo, setIpInfo] = useState<IpInfo | null>(null);
  const [customIp, setCustomIp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [ipHistory, setIpHistory] = useState<IpHistory[]>([]);
  const [activeTab, setActiveTab] = useState("current");
  const { toast } = useToast();

  const generateMockIpInfo = (ip?: string): IpInfo => {
    const mockIps = [
      "203.0.113.1", "198.51.100.42", "192.0.2.123", "172.217.4.174", "8.8.8.8"
    ];
    
    const cities = ["San Francisco", "New York", "London", "Tokyo", "Sydney", "Berlin", "Toronto"];
    const regions = ["California", "New York", "England", "Tokyo", "New South Wales", "Berlin", "Ontario"];
    const countries = ["United States", "United States", "United Kingdom", "Japan", "Australia", "Germany", "Canada"];
    const countryCodes = ["US", "US", "GB", "JP", "AU", "DE", "CA"];
    const isps = ["Google LLC", "Amazon.com", "Cloudflare", "Microsoft", "Akamai", "Deutsche Telekom", "Rogers"];
    const domains = ["google.com", "amazon.com", "cloudflare.com", "microsoft.com", "akamai.com", "telekom.de", "rogers.com"];
    
    const randomIndex = Math.floor(Math.random() * cities.length);
    const selectedIp = ip || mockIps[Math.floor(Math.random() * mockIps.length)];
    
    return {
      ip: selectedIp,
      location: {
        city: cities[randomIndex],
        region: regions[randomIndex],
        country: countries[randomIndex],
        countryCode: countryCodes[randomIndex],
        timezone: `UTC${Math.random() > 0.5 ? '+' : '-'}${Math.floor(Math.random() * 12)}`,
        coordinates: {
          lat: 37.7749 + (Math.random() - 0.5) * 20,
          lon: -122.4194 + (Math.random() - 0.5) * 20
        }
      },
      network: {
        isp: isps[randomIndex],
        organization: `${isps[randomIndex]} Network`,
        asn: `AS${13000 + Math.floor(Math.random() * 50000)}`,
        type: Math.random() > 0.5 ? "Business" : "Residential",
        domain: domains[randomIndex]
      },
      security: {
        isVpn: Math.random() > 0.8,
        isProxy: Math.random() > 0.9,
        isTor: Math.random() > 0.95,
        threat: Math.random() > 0.9 ? "Low Risk" : "Clean",
        riskScore: Math.floor(Math.random() * 100)
      },
      additional: {
        userAgent: navigator.userAgent,
        languages: navigator.languages ? Array.from(navigator.languages) : ['en-US'],
        platform: navigator.platform,
        screenResolution: `${screen.width}x${screen.height}`
      }
    };
  };

  const fetchIpInfo = async (targetIp?: string) => {
    setIsLoading(true);
    
    try {
      // Validate IP if provided
      if (targetIp && !isValidIp(targetIp)) {
        throw new Error("Invalid IP address format");
      }

      // Simulate API call with more realistic delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const mockData = generateMockIpInfo(targetIp);
      setIpInfo(mockData);
      
      // Add to history
      const historyEntry: IpHistory = {
        ip: mockData.ip,
        timestamp: new Date().toLocaleString(),
        location: `${mockData.location.city}, ${mockData.location.country}`
      };
      
      setIpHistory(prev => [historyEntry, ...prev.slice(0, 9)]); // Keep last 10
      
      toast({
        title: "Success",
        description: `IP information retrieved for ${mockData.ip}`
      });
      
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to fetch IP information",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const isValidIp = (ip: string): boolean => {
    const ipv4Regex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    const ipv6Regex = /^(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/;
    return ipv4Regex.test(ip) || ipv6Regex.test(ip);
  };

  const lookupCustomIp = () => {
    if (!customIp.trim()) {
      toast({
        title: "Error",
        description: "Please enter an IP address",
        variant: "destructive"
      });
      return;
    }
    fetchIpInfo(customIp.trim());
  };

  const openInMaps = () => {
    if (!ipInfo) return;
    const { lat, lon } = ipInfo.location.coordinates;
    const mapsUrl = `https://www.google.com/maps?q=${lat},${lon}`;
    window.open(mapsUrl, '_blank');
  };

  const downloadReport = () => {
    if (!ipInfo) return;
    
    const report = `
VR Tools - IP Analysis Report
Generated: ${new Date().toLocaleString()}

=== BASIC INFORMATION ===
IP Address: ${ipInfo.ip}
Location: ${ipInfo.location.city}, ${ipInfo.location.region}, ${ipInfo.location.country} (${ipInfo.location.countryCode})
Timezone: ${ipInfo.location.timezone}
Coordinates: ${ipInfo.location.coordinates.lat.toFixed(4)}, ${ipInfo.location.coordinates.lon.toFixed(4)}

=== NETWORK INFORMATION ===
ISP: ${ipInfo.network.isp}
Organization: ${ipInfo.network.organization}
ASN: ${ipInfo.network.asn}
Type: ${ipInfo.network.type}
Domain: ${ipInfo.network.domain}

=== SECURITY ANALYSIS ===
VPN Detected: ${ipInfo.security.isVpn ? "Yes" : "No"}
Proxy Detected: ${ipInfo.security.isProxy ? "Yes" : "No"}
Tor Network: ${ipInfo.security.isTor ? "Yes" : "No"}
Threat Level: ${ipInfo.security.threat}
Risk Score: ${ipInfo.security.riskScore}/100

=== ADDITIONAL DETAILS ===
User Agent: ${ipInfo.additional.userAgent}
Languages: ${ipInfo.additional.languages.join(', ')}
Platform: ${ipInfo.additional.platform}
Screen Resolution: ${ipInfo.additional.screenResolution}
    `.trim();
    
    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ip-report-${ipInfo.ip}-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Downloaded!",
      description: "IP analysis report saved to file"
    });
  };

  useEffect(() => {
    fetchIpInfo();
  }, []);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: `${label} copied to clipboard`
    });
  };

  const copyAllInfo = () => {
    if (!ipInfo) return;
    
    const allInfo = `
IP: ${ipInfo.ip}
Location: ${ipInfo.location.city}, ${ipInfo.location.region}, ${ipInfo.location.country}
ISP: ${ipInfo.network.isp}
ASN: ${ipInfo.network.asn}
Security: VPN=${ipInfo.security.isVpn}, Proxy=${ipInfo.security.isProxy}, Tor=${ipInfo.security.isTor}
Risk Score: ${ipInfo.security.riskScore}/100
    `.trim();
    
    navigator.clipboard.writeText(allInfo);
    toast({
      title: "Copied!",
      description: "Complete IP information copied to clipboard"
    });
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
              <Wifi className="w-8 h-8 text-primary animate-glow-pulse" />
              <h1 className="text-3xl font-bold">Advanced IP Lookup Tool</h1>
            </div>
            <p className="text-muted-foreground">
              Comprehensive IP address analysis with geolocation, security assessment, and network intelligence
            </p>
          </div>

          {/* Custom IP Lookup */}
          <Card className="cyber-card mb-8">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Globe className="w-5 h-5" />
                <span>Custom IP Lookup</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex space-x-4">
                <div className="flex-1">
                  <Input
                    type="text"
                    placeholder="Enter IP address (e.g., 8.8.8.8)"
                    value={customIp}
                    onChange={(e) => setCustomIp(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && lookupCustomIp()}
                    className="cyber-text-mono"
                  />
                </div>
                <Button 
                  onClick={lookupCustomIp}
                  disabled={isLoading}
                  className="cyber-button-primary"
                >
                  {isLoading ? "Looking up..." : "Lookup IP"}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="current">Current Analysis</TabsTrigger>
              <TabsTrigger value="security">Security Details</TabsTrigger>
              <TabsTrigger value="history">Lookup History</TabsTrigger>
            </TabsList>

            <TabsContent value="current">
              {/* Main IP Card */}
              {ipInfo && (
                <Card className="cyber-card">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center space-x-2">
                        <Globe className="w-6 h-6 text-primary" />
                        <span>IP Analysis Results</span>
                      </CardTitle>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" onClick={copyAllInfo}>
                          <Copy className="w-4 h-4 mr-2" />
                          Copy All
                        </Button>
                        <Button variant="outline" size="sm" onClick={downloadReport}>
                          <Download className="w-4 h-4 mr-2" />
                          Download Report
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => fetchIpInfo()} disabled={isLoading}>
                          <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
                          Refresh
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center mb-8">
                      <div className="text-4xl font-bold cyber-text-mono text-primary mb-2">
                        {ipInfo.ip}
                      </div>
                      <div className="flex items-center justify-center space-x-2">
                        <Badge variant="outline" className="text-sm">
                          {ipInfo.network.type} Network
                        </Badge>
                        <Badge variant="outline" className="text-sm">
                          Risk: {ipInfo.security.riskScore}/100
                        </Badge>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {/* Location Information */}
                      <div className="space-y-4">
                        <h3 className="font-semibold flex items-center space-x-2">
                          <MapPin className="w-4 h-4 text-primary" />
                          <span>Location Details</span>
                        </h3>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">Country:</span>
                            <div className="flex items-center space-x-2">
                              <span className="cyber-text-mono">{ipInfo.location.country} ({ipInfo.location.countryCode})</span>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => copyToClipboard(ipInfo.location.country, "Country")}
                              >
                                <Copy className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">City:</span>
                            <div className="flex items-center space-x-2">
                              <span className="cyber-text-mono">{ipInfo.location.city}</span>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => copyToClipboard(ipInfo.location.city, "City")}
                              >
                                <Copy className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">Region:</span>
                            <div className="flex items-center space-x-2">
                              <span className="cyber-text-mono">{ipInfo.location.region}</span>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => copyToClipboard(ipInfo.location.region, "Region")}
                              >
                                <Copy className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">Timezone:</span>
                            <div className="flex items-center space-x-2">
                              <span className="cyber-text-mono">{ipInfo.location.timezone}</span>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => copyToClipboard(ipInfo.location.timezone, "Timezone")}
                              >
                                <Copy className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">Coordinates:</span>
                            <div className="flex items-center space-x-2">
                              <span className="cyber-text-mono text-xs">
                                {ipInfo.location.coordinates.lat.toFixed(4)}, {ipInfo.location.coordinates.lon.toFixed(4)}
                              </span>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={openInMaps}
                                title="Open in Google Maps"
                              >
                                <ExternalLink className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Network Information */}
                      <div className="space-y-4">
                        <h3 className="font-semibold flex items-center space-x-2">
                          <Building className="w-4 h-4 text-primary" />
                          <span>Network Details</span>
                        </h3>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">ISP:</span>
                            <div className="flex items-center space-x-2">
                              <span className="cyber-text-mono text-sm">{ipInfo.network.isp}</span>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => copyToClipboard(ipInfo.network.isp, "ISP")}
                              >
                                <Copy className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">Organization:</span>
                            <div className="flex items-center space-x-2">
                              <span className="cyber-text-mono text-sm">{ipInfo.network.organization}</span>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => copyToClipboard(ipInfo.network.organization, "Organization")}
                              >
                                <Copy className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">ASN:</span>
                            <div className="flex items-center space-x-2">
                              <span className="cyber-text-mono">{ipInfo.network.asn}</span>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => copyToClipboard(ipInfo.network.asn, "ASN")}
                              >
                                <Copy className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">Domain:</span>
                            <div className="flex items-center space-x-2">
                              <span className="cyber-text-mono text-sm">{ipInfo.network.domain}</span>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => copyToClipboard(ipInfo.network.domain, "Domain")}
                              >
                                <Copy className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">Type:</span>
                            <Badge variant="outline">{ipInfo.network.type}</Badge>
                          </div>
                        </div>
                      </div>

                      {/* Additional Information */}
                      <div className="space-y-4">
                        <h3 className="font-semibold flex items-center space-x-2">
                          <Wifi className="w-4 h-4 text-primary" />
                          <span>System Details</span>
                        </h3>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">Platform:</span>
                            <span className="cyber-text-mono text-sm">{ipInfo.additional.platform}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">Languages:</span>
                            <span className="cyber-text-mono text-sm">{ipInfo.additional.languages.slice(0, 2).join(', ')}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">Resolution:</span>
                            <span className="cyber-text-mono text-sm">{ipInfo.additional.screenResolution}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="security">
              {ipInfo && (
                <Card className="cyber-card">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Shield className="w-5 h-5" />
                      <span>Security Analysis</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Risk Score */}
                    <div className="p-4 rounded-lg border border-border">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold">Overall Risk Score</h3>
                        <Badge 
                          variant="outline" 
                          className={
                            ipInfo.security.riskScore > 70 ? "result-danger" :
                            ipInfo.security.riskScore > 40 ? "result-warning" : "result-safe"
                          }
                        >
                          {ipInfo.security.riskScore}/100
                        </Badge>
                      </div>
                      <div className="w-full bg-muted rounded-full h-3">
                        <div 
                          className={`h-3 rounded-full transition-all duration-500 ${
                            ipInfo.security.riskScore > 70 ? "bg-red-500" :
                            ipInfo.security.riskScore > 40 ? "bg-yellow-500" : "bg-green-500"
                          }`}
                          style={{ width: `${ipInfo.security.riskScore}%` }}
                        />
                      </div>
                    </div>

                    {/* Security Indicators */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 rounded-lg border border-border">
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">VPN Detection:</span>
                          <Badge variant={ipInfo.security.isVpn ? "destructive" : "outline"}>
                            {ipInfo.security.isVpn ? "Detected" : "Not Detected"}
                          </Badge>
                        </div>
                        {ipInfo.security.isVpn && (
                          <p className="text-xs text-muted-foreground mt-2">
                            This IP appears to be using a VPN service
                          </p>
                        )}
                      </div>

                      <div className="p-4 rounded-lg border border-border">
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Proxy Detection:</span>
                          <Badge variant={ipInfo.security.isProxy ? "destructive" : "outline"}>
                            {ipInfo.security.isProxy ? "Detected" : "Not Detected"}
                          </Badge>
                        </div>
                        {ipInfo.security.isProxy && (
                          <p className="text-xs text-muted-foreground mt-2">
                            Traffic appears to be routed through a proxy
                          </p>
                        )}
                      </div>

                      <div className="p-4 rounded-lg border border-border">
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Tor Network:</span>
                          <Badge variant={ipInfo.security.isTor ? "destructive" : "outline"}>
                            {ipInfo.security.isTor ? "Detected" : "Not Detected"}
                          </Badge>
                        </div>
                        {ipInfo.security.isTor && (
                          <p className="text-xs text-muted-foreground mt-2">
                            This IP is part of the Tor anonymity network
                          </p>
                        )}
                      </div>

                      <div className="p-4 rounded-lg border border-border">
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Threat Level:</span>
                          <Badge variant="outline" className="result-safe">
                            {ipInfo.security.threat}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">
                          Based on threat intelligence databases
                        </p>
                      </div>
                    </div>

                    {/* Security Recommendations */}
                    <div className="p-4 rounded-lg bg-muted/50">
                      <h4 className="font-semibold mb-2 flex items-center space-x-2">
                        <AlertTriangle className="w-4 h-4" />
                        <span>Security Recommendations</span>
                      </h4>
                      <ul className="text-sm space-y-1 text-muted-foreground">
                        {ipInfo.security.riskScore > 50 && (
                          <li>• Exercise caution when interacting with this IP address</li>
                        )}
                        {ipInfo.security.isVpn && (
                          <li>• VPN usage detected - verify legitimate business purpose</li>
                        )}
                        {ipInfo.security.isProxy && (
                          <li>• Proxy detected - additional verification recommended</li>
                        )}
                        {ipInfo.security.isTor && (
                          <li>• Tor usage detected - high anonymity, proceed with extreme caution</li>
                        )}
                        <li>• Always verify the identity of users from high-risk IP addresses</li>
                        <li>• Consider implementing additional authentication measures</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="history">
              <Card className="cyber-card">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <History className="w-5 h-5" />
                    <span>Lookup History</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {ipHistory.length > 0 ? (
                    <div className="border rounded-lg overflow-hidden">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>IP Address</TableHead>
                            <TableHead>Location</TableHead>
                            <TableHead>Timestamp</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {ipHistory.map((entry, index) => (
                            <TableRow key={index}>
                              <TableCell className="cyber-text-mono">{entry.ip}</TableCell>
                              <TableCell>{entry.location}</TableCell>
                              <TableCell className="text-sm text-muted-foreground">{entry.timestamp}</TableCell>
                              <TableCell>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  onClick={() => fetchIpInfo(entry.ip)}
                                >
                                  Lookup Again
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <History className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>No lookup history available</p>
                      <p className="text-sm">Perform IP lookups to see them here</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Loading State */}
          {isLoading && (
            <Card className="cyber-card mb-8 animate-bounce-in">
              <CardContent className="text-center py-12">
                <RefreshCw className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
                  <LoadingSpinner type="hex" size="lg" className="mx-auto" />
                <p className="text-sm text-muted-foreground mt-2">Gathering geolocation and security data</p>
              </CardContent>
            </Card>
          )}

          {/* Enhanced Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            <Card className="cyber-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Globe className="w-5 h-5" />
                  <span>About IP Analysis</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>
                    IP addresses reveal your approximate location, internet service provider, 
                    and can be used to track online activities across websites.
                  </p>
                  <p>
                    Our advanced analysis includes security threat assessment, VPN/proxy detection, 
                    and network intelligence to provide comprehensive IP insights.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="cyber-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="w-5 h-5" />
                  <span>Privacy & Security</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>
                    Consider using a VPN to mask your real IP address and protect your privacy. 
                    This prevents websites from tracking your location and online behavior.
                  </p>
                  <p>
                    Be aware that your IP address can reveal sensitive information about your 
                    location, ISP, and potentially your identity to malicious actors.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default IpLookup;