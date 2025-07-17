import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Radar, Shield, Server } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface ScanResult {
  port: number;
  protocol: string;
  state: "open" | "closed" | "filtered";
  service: string;
  version?: string;
}

interface HostInfo {
  ip: string;
  hostname?: string;
  os?: string;
  uptime?: string;
}

const NmapScanner = () => {
  const [target, setTarget] = useState("");
  const [scanType, setScanType] = useState("basic");
  const [scanResults, setScanResults] = useState<ScanResult[]>([]);
  const [hostInfo, setHostInfo] = useState<HostInfo | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const { toast } = useToast();

  const performScan = () => {
    if (!target.trim()) {
      toast({
        title: "Error",
        description: "Please enter a valid target",
        variant: "destructive",
      });
      return;
    }

    setIsScanning(true);
    
    // Simulate nmap scan
    setTimeout(() => {
      const mockResults: ScanResult[] = [
        { port: 22, protocol: "tcp", state: "open", service: "ssh", version: "OpenSSH 8.2" },
        { port: 80, protocol: "tcp", state: "open", service: "http", version: "Apache 2.4.41" },
        { port: 443, protocol: "tcp", state: "open", service: "https", version: "Apache 2.4.41" },
        { port: 25, protocol: "tcp", state: "filtered", service: "smtp" },
        { port: 110, protocol: "tcp", state: "closed", service: "pop3" },
      ];

      if (scanType === "advanced") {
        mockResults.push(
          { port: 3306, protocol: "tcp", state: "open", service: "mysql", version: "MySQL 8.0.23" },
          { port: 5432, protocol: "tcp", state: "closed", service: "postgresql" },
          { port: 21, protocol: "tcp", state: "filtered", service: "ftp" }
        );
      }

      const mockHostInfo: HostInfo = {
        ip: "192.168.1.100",
        hostname: "example.com",
        os: scanType === "advanced" ? "Linux Ubuntu 20.04" : undefined,
        uptime: scanType === "advanced" ? "7 days, 12 hours" : undefined
      };
      
      setScanResults(mockResults);
      setHostInfo(mockHostInfo);
      setIsScanning(false);
    }, scanType === "advanced" ? 4000 : 2500);
  };

  const getStateColor = (state: string) => {
    switch (state) {
      case "open": return "bg-green-500/10 text-green-400 border-green-500/30";
      case "closed": return "bg-red-500/10 text-red-400 border-red-500/30";
      case "filtered": return "bg-yellow-500/10 text-yellow-400 border-yellow-500/30";
      default: return "bg-gray-500/10 text-gray-400 border-gray-500/30";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold bg-gradient-cyber bg-clip-text text-transparent">
              Nmap Port Scanner
            </h1>
            <p className="text-muted-foreground">
              Discover open ports and services on target systems
            </p>
          </div>

          <Card className="cyber-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Radar className="w-5 h-5" />
                Scan Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="target">Target (IP or Domain)</Label>
                <Input
                  id="target"
                  placeholder="192.168.1.1 or example.com"
                  value={target}
                  onChange={(e) => setTarget(e.target.value)}
                />
              </div>

              <div className="space-y-3">
                <Label>Scan Type</Label>
                <RadioGroup value={scanType} onValueChange={setScanType}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="basic" id="basic" />
                    <Label htmlFor="basic">Basic Scan (Top 1000 ports)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="advanced" id="advanced" />
                    <Label htmlFor="advanced">Advanced Scan (OS detection, version scan)</Label>
                  </div>
                </RadioGroup>
              </div>
              
              <Button 
                onClick={performScan}
                disabled={isScanning}
                className="w-full relative"
              >
                {isScanning ? (
                  <div className="flex items-center justify-center space-x-2">
                    <LoadingSpinner type="vr" size="sm" />
                    <span>Scanning... ({scanType === "advanced" ? "~4s" : "~3s"})</span>
                  </div>
                ) : (
                  "Start Port Scan"
                )}
              </Button>
            </CardContent>
          </Card>

          {(scanResults.length > 0 || hostInfo) && (
            <Tabs defaultValue="ports" className="space-y-4">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="ports">Port Results</TabsTrigger>
                <TabsTrigger value="host">Host Information</TabsTrigger>
              </TabsList>

              <TabsContent value="ports">
                <Card className="cyber-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="w-5 h-5" />
                      Open Ports & Services
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {scanResults.map((result, index) => (
                        <div key={index} className="flex items-center justify-between p-3 rounded-lg border border-border">
                          <div className="flex items-center gap-3">
                            <Badge variant="outline" className="font-mono">
                              {result.port}/{result.protocol}
                            </Badge>
                            <span className="font-medium">{result.service}</span>
                            {result.version && (
                              <span className="text-sm text-muted-foreground">{result.version}</span>
                            )}
                          </div>
                          <Badge 
                            variant="outline" 
                            className={getStateColor(result.state)}
                          >
                            {result.state}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="host">
                <Card className="cyber-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Server className="w-5 h-5" />
                      Host Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {hostInfo && (
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <Label className="text-sm font-medium">IP Address</Label>
                          <p className="text-sm text-muted-foreground font-mono">{hostInfo.ip}</p>
                        </div>
                        {hostInfo.hostname && (
                          <div>
                            <Label className="text-sm font-medium">Hostname</Label>
                            <p className="text-sm text-muted-foreground">{hostInfo.hostname}</p>
                          </div>
                        )}
                        {hostInfo.os && (
                          <div>
                            <Label className="text-sm font-medium">Operating System</Label>
                            <p className="text-sm text-muted-foreground">{hostInfo.os}</p>
                          </div>
                        )}
                        {hostInfo.uptime && (
                          <div>
                            <Label className="text-sm font-medium">Uptime</Label>
                            <p className="text-sm text-muted-foreground">{hostInfo.uptime}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default NmapScanner;