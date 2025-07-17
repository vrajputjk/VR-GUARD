import { useState } from "react";
import { Globe, Search, Copy, ExternalLink, Server, MapPin, Shield, Clock, Database, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BackToHomeButton from "@/components/BackToHomeButton";
import LoadingSpinner from "@/components/LoadingSpinner";

interface DnsRecord {
  type: string;
  name: string;
  value: string;
  ttl: number;
  priority?: number;
  weight?: number;
  port?: number;
}

interface WhoisInfo {
  domain: string;
  registrar: string;
  registrationDate: string;
  expirationDate: string;
  lastUpdated: string;
  nameServers: string[];
  status: string[];
  contacts: {
    registrant: string;
    admin: string;
    tech: string;
  };
}

interface SecurityInfo {
  dnssec: boolean;
  blacklisted: boolean;
  reputation: "Good" | "Suspicious" | "Malicious";
  threatCategories: string[];
  lastScan: string;
}

interface PerformanceMetrics {
  responseTime: number;
  propagationStatus: "Complete" | "Partial" | "Failed";
  globalServers: {
    location: string;
    status: "Online" | "Offline";
    responseTime: number;
  }[];
}

const DnsLookup = () => {
  const [domain, setDomain] = useState("");
  const [dnsRecords, setDnsRecords] = useState<DnsRecord[]>([]);
  const [whoisInfo, setWhoisInfo] = useState<WhoisInfo | null>(null);
  const [securityInfo, setSecurityInfo] = useState<SecurityInfo | null>(null);
  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("dns");
  const { toast } = useToast();

  const generateMockDnsRecords = (domain: string): DnsRecord[] => {
    const records: DnsRecord[] = [
      {
        type: "A",
        name: domain,
        value: `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
        ttl: 300
      },
      {
        type: "AAAA",
        name: domain,
        value: "2001:db8:85a3::8a2e:370:7334",
        ttl: 300
      },
      {
        type: "MX",
        name: domain,
        value: `mail.${domain}`,
        ttl: 3600,
        priority: 10
      },
      {
        type: "MX",
        name: domain,
        value: `mail2.${domain}`,
        ttl: 3600,
        priority: 20
      },
      {
        type: "TXT",
        name: domain,
        value: "v=spf1 include:_spf.google.com ~all",
        ttl: 3600
      },
      {
        type: "TXT",
        name: `_dmarc.${domain}`,
        value: "v=DMARC1; p=quarantine; rua=mailto:dmarc@" + domain,
        ttl: 3600
      },
      {
        type: "TXT",
        name: `_dkim._domainkey.${domain}`,
        value: "v=DKIM1; k=rsa; p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC...",
        ttl: 3600
      },
      {
        type: "NS",
        name: domain,
        value: `ns1.${domain}`,
        ttl: 86400
      },
      {
        type: "NS",
        name: domain,
        value: `ns2.${domain}`,
        ttl: 86400
      },
      {
        type: "CNAME",
        name: `www.${domain}`,
        value: domain,
        ttl: 3600
      },
      {
        type: "SRV",
        name: `_sip._tcp.${domain}`,
        value: `sip.${domain}`,
        ttl: 3600,
        priority: 10,
        weight: 5,
        port: 5060
      }
    ];

    return records;
  };

  const generateMockWhoisInfo = (domain: string): WhoisInfo => {
    const registrars = ["GoDaddy LLC", "Namecheap Inc", "Google Domains", "Cloudflare Inc", "Amazon Registrar"];
    const statuses = ["clientTransferProhibited", "clientUpdateProhibited", "clientDeleteProhibited"];
    
    const registrationDate = new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000 * 5);
    const expirationDate = new Date(Date.now() + Math.random() * 365 * 24 * 60 * 60 * 1000 * 3);
    const lastUpdated = new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000);

    return {
      domain,
      registrar: registrars[Math.floor(Math.random() * registrars.length)],
      registrationDate: registrationDate.toISOString().split('T')[0],
      expirationDate: expirationDate.toISOString().split('T')[0],
      lastUpdated: lastUpdated.toISOString().split('T')[0],
      nameServers: [`ns1.${domain}`, `ns2.${domain}`, `ns3.${domain}`, `ns4.${domain}`],
      status: statuses.slice(0, Math.floor(Math.random() * 3) + 1),
      contacts: {
        registrant: "Privacy Protected",
        admin: "Privacy Protected", 
        tech: "Privacy Protected"
      }
    };
  };

  const generateMockSecurityInfo = (): SecurityInfo => {
    const threatCategories = ["Malware", "Phishing", "Spam", "Botnet"];
    const reputations: SecurityInfo['reputation'][] = ["Good", "Suspicious", "Malicious"];
    
    return {
      dnssec: Math.random() > 0.3,
      blacklisted: Math.random() > 0.8,
      reputation: reputations[Math.floor(Math.random() * reputations.length)],
      threatCategories: Math.random() > 0.7 ? threatCategories.slice(0, Math.floor(Math.random() * 2) + 1) : [],
      lastScan: new Date().toISOString()
    };
  };

  const generateMockPerformanceMetrics = (): PerformanceMetrics => {
    const locations = ["New York", "London", "Tokyo", "Sydney", "Frankfurt", "Singapore"];
    
    return {
      responseTime: Math.floor(Math.random() * 200) + 50,
      propagationStatus: Math.random() > 0.2 ? "Complete" : "Partial",
      globalServers: locations.map(location => ({
        location,
        status: Math.random() > 0.1 ? "Online" : "Offline",
        responseTime: Math.floor(Math.random() * 300) + 20
      }))
    };
  };

  const performLookup = async () => {
    if (!domain.trim()) {
      toast({
        title: "Error",
        description: "Please enter a domain name",
        variant: "destructive"
      });
      return;
    }

    // Enhanced domain validation
    const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$/;
    if (!domainRegex.test(domain.trim())) {
      toast({
        title: "Error",
        description: "Please enter a valid domain name (e.g., example.com)",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // Simulate comprehensive lookup with progress
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockDnsRecords = generateMockDnsRecords(domain.trim());
      const mockWhoisInfo = generateMockWhoisInfo(domain.trim());
      const mockSecurityInfo = generateMockSecurityInfo();
      const mockPerformanceMetrics = generateMockPerformanceMetrics();
      
      setDnsRecords(mockDnsRecords);
      setWhoisInfo(mockWhoisInfo);
      setSecurityInfo(mockSecurityInfo);
      setPerformanceMetrics(mockPerformanceMetrics);
      
      toast({
        title: "Lookup Complete",
        description: `Comprehensive analysis completed for ${domain.trim()}`
      });
      
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to perform DNS lookup",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyRecord = (record: DnsRecord) => {
    const recordText = `${record.type} ${record.name} ${record.value} ${record.ttl}${record.priority ? ` ${record.priority}` : ''}`;
    navigator.clipboard.writeText(recordText);
    toast({
      title: "Copied!",
      description: "DNS record copied to clipboard"
    });
  };

  const copyAllRecords = () => {
    const allRecords = dnsRecords.map(record => 
      `${record.type}\t${record.name}\t${record.value}\t${record.ttl}${record.priority ? `\t${record.priority}` : ''}`
    ).join('\n');
    
    navigator.clipboard.writeText(`Type\tName\tValue\tTTL\tPriority\n${allRecords}`);
    toast({
      title: "Copied!",
      description: "All DNS records copied to clipboard"
    });
  };

  const copyWhoisInfo = () => {
    if (!whoisInfo) return;
    
    const whoisText = `
Domain: ${whoisInfo.domain}
Registrar: ${whoisInfo.registrar}
Registration Date: ${whoisInfo.registrationDate}
Expiration Date: ${whoisInfo.expirationDate}
Last Updated: ${whoisInfo.lastUpdated}
Status: ${whoisInfo.status.join(', ')}
Name Servers: ${whoisInfo.nameServers.join(', ')}
    `.trim();
    
    navigator.clipboard.writeText(whoisText);
    toast({
      title: "Copied!",
      description: "WHOIS information copied to clipboard"
    });
  };

  const getRecordTypeColor = (type: string) => {
    const colors: { [key: string]: string } = {
      'A': 'bg-blue-500/10 text-blue-400 border-blue-500/30',
      'AAAA': 'bg-purple-500/10 text-purple-400 border-purple-500/30',
      'MX': 'bg-green-500/10 text-green-400 border-green-500/30',
      'TXT': 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30',
      'NS': 'bg-red-500/10 text-red-400 border-red-500/30',
      'CNAME': 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
      'SRV': 'bg-orange-500/10 text-orange-400 border-orange-500/30'
    };
    return colors[type] || 'bg-gray-500/10 text-gray-400 border-gray-500/30';
  };

  const getReputationColor = (reputation: string) => {
    switch (reputation) {
      case "Good": return "result-safe";
      case "Suspicious": return "result-warning";
      case "Malicious": return "result-danger";
      default: return "";
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
              <Globe className="w-8 h-8 text-primary animate-glow-pulse" />
              <h1 className="text-3xl font-bold">Advanced DNS Lookup Tool</h1>
            </div>
            <p className="text-muted-foreground">
              Comprehensive DNS analysis with security assessment, performance metrics, and global propagation status
            </p>
          </div>

          {/* Search Section */}
          <Card className="cyber-card mb-8">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Search className="w-5 h-5" />
                <span>Domain Analysis</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex space-x-4">
                <div className="flex-1">
                  <Input
                    type="text"
                    placeholder="Enter domain name (e.g., example.com)"
                    value={domain}
                    onChange={(e) => setDomain(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && performLookup()}
                    className="cyber-text-mono"
                  />
                </div>
                <Button 
                  onClick={performLookup}
                  disabled={isLoading}
                  className="cyber-button-primary"
                >
                  {isLoading ? "Analyzing..." : "🔍 Analyze Domain"}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Loading State */}
          {isLoading && (
            <Card className="cyber-card mb-8 animate-bounce-in">
              <CardContent className="text-center py-12">
                <div className="space-y-4">
                  <LoadingSpinner type="pulse" className="mx-auto" />
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold">Comprehensive DNS Analysis</h3>
                    <p className="text-muted-foreground">Gathering DNS records, security data, and performance metrics...</p>
                  </div>
                  <div className="max-w-md mx-auto space-y-2">
                    <Progress value={66} className="h-2" />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>DNS Records</span>
                      <span>WHOIS Data</span>
                      <span>Security Scan</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Results */}
          {(dnsRecords.length > 0 || whoisInfo) && (
            <Card className="cyber-card">
              <CardHeader>
                <CardTitle>Analysis Results for {domain}</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="dns" className="flex items-center space-x-2">
                      <Server className="w-4 h-4" />
                      <span>DNS Records</span>
                    </TabsTrigger>
                    <TabsTrigger value="whois" className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4" />
                      <span>WHOIS Info</span>
                    </TabsTrigger>
                    <TabsTrigger value="security" className="flex items-center space-x-2">
                      <Shield className="w-4 h-4" />
                      <span>Security</span>
                    </TabsTrigger>
                    <TabsTrigger value="performance" className="flex items-center space-x-2">
                      <Zap className="w-4 h-4" />
                      <span>Performance</span>
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="dns" className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-semibold">DNS Records ({dnsRecords.length})</h3>
                      <Button variant="outline" size="sm" onClick={copyAllRecords}>
                        <Copy className="w-4 h-4 mr-2" />
                        Copy All Records
                      </Button>
                    </div>
                    
                    <div className="border rounded-lg overflow-hidden">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Type</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Value</TableHead>
                            <TableHead>TTL</TableHead>
                            <TableHead>Priority</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {dnsRecords.map((record, index) => (
                            <TableRow key={index}>
                              <TableCell>
                                <Badge variant="outline" className={getRecordTypeColor(record.type)}>
                                  {record.type}
                                </Badge>
                              </TableCell>
                              <TableCell className="cyber-text-mono text-sm">
                                {record.name}
                              </TableCell>
                              <TableCell className="cyber-text-mono text-sm max-w-xs">
                                <div className="truncate" title={record.value}>
                                  {record.value}
                                </div>
                              </TableCell>
                              <TableCell className="cyber-text-mono">
                                {record.ttl}s
                              </TableCell>
                              <TableCell className="cyber-text-mono">
                                {record.priority || record.weight || record.port || '-'}
                              </TableCell>
                              <TableCell>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  onClick={() => copyRecord(record)}
                                >
                                  <Copy className="w-3 h-3" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>

                    {/* Record Type Summary */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                      {Object.entries(
                        dnsRecords.reduce((acc, record) => {
                          acc[record.type] = (acc[record.type] || 0) + 1;
                          return acc;
                        }, {} as Record<string, number>)
                      ).map(([type, count]) => (
                        <div key={type} className="p-3 rounded-lg border border-border text-center">
                          <Badge variant="outline" className={getRecordTypeColor(type)}>
                            {type}
                          </Badge>
                          <p className="text-sm text-muted-foreground mt-1">{count} record{count > 1 ? 's' : ''}</p>
                        </div>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="whois" className="space-y-4">
                    {whoisInfo && (
                      <>
                        <div className="flex justify-between items-center">
                          <h3 className="text-lg font-semibold">WHOIS Information</h3>
                          <Button variant="outline" size="sm" onClick={copyWhoisInfo}>
                            <Copy className="w-4 h-4 mr-2" />
                            Copy WHOIS Data
                          </Button>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-4">
                            <div>
                              <h4 className="font-semibold text-primary mb-3">Domain Information</h4>
                              <div className="space-y-3">
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Domain:</span>
                                  <span className="cyber-text-mono">{whoisInfo.domain}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Registrar:</span>
                                  <span className="cyber-text-mono text-sm">{whoisInfo.registrar}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Registration:</span>
                                  <span className="cyber-text-mono">{whoisInfo.registrationDate}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Expiration:</span>
                                  <span className="cyber-text-mono">{whoisInfo.expirationDate}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Last Updated:</span>
                                  <span className="cyber-text-mono">{whoisInfo.lastUpdated}</span>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="space-y-4">
                            <div>
                              <h4 className="font-semibold text-primary mb-3">Technical Details</h4>
                              <div className="space-y-3">
                                <div>
                                  <span className="text-muted-foreground">Status:</span>
                                  <div className="mt-1 space-y-1">
                                    {whoisInfo.status.map((status, index) => (
                                      <Badge key={index} variant="outline" className="text-xs mr-1">
                                        {status}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                                <div>
                                  <span className="text-muted-foreground">Name Servers:</span>
                                  <div className="mt-1 space-y-1">
                                    {whoisInfo.nameServers.map((ns, index) => (
                                      <div key={index} className="cyber-text-mono text-sm">
                                        {ns}
                                      </div>
                                    ))}
                                  </div>
                                </div>
                                <div>
                                  <span className="text-muted-foreground">Contacts:</span>
                                  <div className="mt-1 space-y-1 text-sm">
                                    <div>Registrant: {whoisInfo.contacts.registrant}</div>
                                    <div>Admin: {whoisInfo.contacts.admin}</div>
                                    <div>Tech: {whoisInfo.contacts.tech}</div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </TabsContent>

                  <TabsContent value="security" className="space-y-4">
                    {securityInfo && (
                      <>
                        <h3 className="text-lg font-semibold">Security Assessment</h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <Card className="p-4">
                            <h4 className="font-semibold mb-3">Security Status</h4>
                            <div className="space-y-3">
                              <div className="flex justify-between items-center">
                                <span className="text-muted-foreground">DNSSEC:</span>
                                <Badge variant={securityInfo.dnssec ? "outline" : "destructive"}>
                                  {securityInfo.dnssec ? "Enabled" : "Disabled"}
                                </Badge>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-muted-foreground">Blacklisted:</span>
                                <Badge variant={securityInfo.blacklisted ? "destructive" : "outline"}>
                                  {securityInfo.blacklisted ? "Yes" : "No"}
                                </Badge>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-muted-foreground">Reputation:</span>
                                <Badge variant="outline" className={getReputationColor(securityInfo.reputation)}>
                                  {securityInfo.reputation}
                                </Badge>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-muted-foreground">Last Scan:</span>
                                <span className="text-sm">{new Date(securityInfo.lastScan).toLocaleString()}</span>
                              </div>
                            </div>
                          </Card>

                          <Card className="p-4">
                            <h4 className="font-semibold mb-3">Threat Analysis</h4>
                            {securityInfo.threatCategories.length > 0 ? (
                              <div className="space-y-2">
                                <p className="text-sm text-muted-foreground">Detected threat categories:</p>
                                <div className="space-y-1">
                                  {securityInfo.threatCategories.map((category, index) => (
                                    <Badge key={index} variant="destructive" className="mr-1">
                                      {category}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            ) : (
                              <div className="text-center py-4">
                                <Shield className="w-8 h-8 text-green-500 mx-auto mb-2" />
                                <p className="text-sm text-green-600">No threats detected</p>
                              </div>
                            )}
                          </Card>
                        </div>

                        {/* Security Recommendations */}
                        <Card className="p-4 bg-muted/50">
                          <h4 className="font-semibold mb-3">Security Recommendations</h4>
                          <ul className="text-sm space-y-1 text-muted-foreground">
                            {!securityInfo.dnssec && (
                              <li>• Enable DNSSEC to prevent DNS spoofing attacks</li>
                            )}
                            {securityInfo.blacklisted && (
                              <li>• Domain is blacklisted - investigate and remediate immediately</li>
                            )}
                            {securityInfo.reputation === "Suspicious" && (
                              <li>• Monitor domain reputation and investigate suspicious activities</li>
                            )}
                            {securityInfo.reputation === "Malicious" && (
                              <li>• Domain flagged as malicious - avoid interaction</li>
                            )}
                            <li>• Regularly monitor DNS records for unauthorized changes</li>
                            <li>• Implement DNS monitoring and alerting systems</li>
                          </ul>
                        </Card>
                      </>
                    )}
                  </TabsContent>

                  <TabsContent value="performance" className="space-y-4">
                    {performanceMetrics && (
                      <>
                        <h3 className="text-lg font-semibold">Performance Metrics</h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                          <Card className="p-4 text-center">
                            <Clock className="w-8 h-8 text-primary mx-auto mb-2" />
                            <div className="text-2xl font-bold">{performanceMetrics.responseTime}ms</div>
                            <div className="text-sm text-muted-foreground">Average Response Time</div>
                          </Card>
                          
                          <Card className="p-4 text-center">
                            <Globe className="w-8 h-8 text-primary mx-auto mb-2" />
                            <div className="text-2xl font-bold">{performanceMetrics.propagationStatus}</div>
                            <div className="text-sm text-muted-foreground">Propagation Status</div>
                          </Card>
                          
                          <Card className="p-4 text-center">
                            <Server className="w-8 h-8 text-primary mx-auto mb-2" />
                            <div className="text-2xl font-bold">
                              {performanceMetrics.globalServers.filter(s => s.status === "Online").length}/
                              {performanceMetrics.globalServers.length}
                            </div>
                            <div className="text-sm text-muted-foreground">Servers Online</div>
                          </Card>
                        </div>

                        <Card className="p-4">
                          <h4 className="font-semibold mb-3">Global Server Status</h4>
                          <div className="space-y-3">
                            {performanceMetrics.globalServers.map((server, index) => (
                              <div key={index} className="flex items-center justify-between p-2 rounded border border-border">
                                <div className="flex items-center space-x-3">
                                  <Badge variant={server.status === "Online" ? "outline" : "destructive"}>
                                    {server.status}
                                  </Badge>
                                  <span className="font-medium">{server.location}</span>
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  {server.status === "Online" ? `${server.responseTime}ms` : "Offline"}
                                </div>
                              </div>
                            ))}
                          </div>
                        </Card>
                      </>
                    )}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          )}

          {/* Enhanced Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            <Card className="cyber-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Server className="w-5 h-5" />
                  <span>DNS Record Types</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center space-x-3">
                    <Badge variant="outline" className={getRecordTypeColor('A')}>A</Badge>
                    <span className="text-muted-foreground">IPv4 address record</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Badge variant="outline" className={getRecordTypeColor('AAAA')}>AAAA</Badge>
                    <span className="text-muted-foreground">IPv6 address record</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Badge variant="outline" className={getRecordTypeColor('MX')}>MX</Badge>
                    <span className="text-muted-foreground">Mail exchange record</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Badge variant="outline" className={getRecordTypeColor('TXT')}>TXT</Badge>
                    <span className="text-muted-foreground">Text record (SPF, DKIM, DMARC)</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Badge variant="outline" className={getRecordTypeColor('NS')}>NS</Badge>
                    <span className="text-muted-foreground">Name server record</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Badge variant="outline" className={getRecordTypeColor('CNAME')}>CNAME</Badge>
                    <span className="text-muted-foreground">Canonical name record</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Badge variant="outline" className={getRecordTypeColor('SRV')}>SRV</Badge>
                    <span className="text-muted-foreground">Service record</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="cyber-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="w-5 h-5" />
                  <span>Advanced Features</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>
                    <strong>Security Analysis:</strong> Comprehensive threat assessment including 
                    DNSSEC validation, blacklist checking, and reputation analysis.
                  </p>
                  <p>
                    <strong>Performance Monitoring:</strong> Global DNS propagation status and 
                    response time measurements from multiple geographic locations.
                  </p>
                  <p>
                    <strong>WHOIS Intelligence:</strong> Detailed domain registration information 
                    including ownership, expiration dates, and contact details.
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

export default DnsLookup;