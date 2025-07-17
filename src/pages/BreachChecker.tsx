import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ShieldAlert, CheckCircle, XCircle, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface BreachData {
  name: string;
  date: string;
  description: string;
  dataClasses: string[];
  verified: boolean;
  compromisedAccounts: number;
}

const BreachChecker = () => {
  const [email, setEmail] = useState("");
  const [breaches, setBreaches] = useState<BreachData[]>([]);
  const [isChecking, setIsChecking] = useState(false);
  const [hasChecked, setHasChecked] = useState(false);
  const { toast } = useToast();

  const checkBreaches = () => {
    if (!email.trim() || !email.includes("@")) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }

    setIsChecking(true);
    setHasChecked(false);
    
    // Simulate breach check
    setTimeout(() => {
      const mockBreaches: BreachData[] = [
        {
          name: "Adobe",
          date: "2013-10-04",
          description: "Adobe systems breach exposing 153 million user accounts",
          dataClasses: ["Email addresses", "Password hints", "Passwords", "Usernames"],
          verified: true,
          compromisedAccounts: 152445165
        },
        {
          name: "LinkedIn",
          date: "2012-05-05", 
          description: "LinkedIn data breach affecting 164 million users",
          dataClasses: ["Email addresses", "Passwords"],
          verified: true,
          compromisedAccounts: 164611595
        },
        {
          name: "Dropbox",
          date: "2012-07-01",
          description: "Dropbox breach exposing 68 million user credentials",
          dataClasses: ["Email addresses", "Passwords"],
          verified: true,
          compromisedAccounts: 68648009
        }
      ];

      // Randomly show 0-3 breaches
      const randomCount = Math.floor(Math.random() * 4);
      const selectedBreaches = mockBreaches.slice(0, randomCount);
      
      setBreaches(selectedBreaches);
      setHasChecked(true);
      setIsChecking(false);
    }, 2000);
  };

  const getSeverityColor = (compromisedAccounts: number) => {
    if (compromisedAccounts > 100000000) return "bg-red-500/10 text-red-400 border-red-500/30";
    if (compromisedAccounts > 10000000) return "bg-orange-500/10 text-orange-400 border-orange-500/30";
    return "bg-yellow-500/10 text-yellow-400 border-yellow-500/30";
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat().format(num);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold bg-gradient-cyber bg-clip-text text-transparent">
              Email Breach Checker
            </h1>
            <p className="text-muted-foreground">
              Check if your email has been compromised in known data breaches
            </p>
          </div>

          <Card className="cyber-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShieldAlert className="w-5 h-5" />
                Email Check
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              
              <Button 
                onClick={checkBreaches}
                disabled={isChecking}
                className="w-full relative"
              >
                {isChecking ? (
                  <div className="flex items-center justify-center space-x-2">
                    <LoadingSpinner type="hex" size="sm" />
                    <span>Checking Breaches...</span>
                  </div>
                ) : (
                  "Check for Data Breaches"
                )}
              </Button>
            </CardContent>
          </Card>

          {hasChecked && (
            <>
              {breaches.length === 0 ? (
                <Alert className="border-green-500/50 bg-green-500/10">
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  <AlertDescription>
                    <span className="text-green-400 font-medium">Good news!</span> No breaches found for this email address.
                  </AlertDescription>
                </Alert>
              ) : (
                <Alert className="border-red-500/50 bg-red-500/10">
                  <XCircle className="h-4 w-4 text-red-400" />
                  <AlertDescription>
                    <span className="text-red-400 font-medium">Security Alert:</span> This email was found in {breaches.length} data breach{breaches.length > 1 ? "es" : ""}.
                  </AlertDescription>
                </Alert>
              )}

              {breaches.length > 0 && (
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold">Breach Details</h2>
                  {breaches.map((breach, index) => (
                    <Card key={index} className="cyber-card">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-lg">{breach.name}</CardTitle>
                            <p className="text-sm text-muted-foreground mt-1">
                              Breach Date: {new Date(breach.date).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            {breach.verified ? (
                              <Badge variant="outline" className="bg-green-500/10 text-green-400 border-green-500/30">
                                Verified
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="bg-yellow-500/10 text-yellow-400 border-yellow-500/30">
                                Unverified
                              </Badge>
                            )}
                            <Badge 
                              variant="outline" 
                              className={getSeverityColor(breach.compromisedAccounts)}
                            >
                              {formatNumber(breach.compromisedAccounts)} accounts
                            </Badge>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <p className="text-sm text-muted-foreground">{breach.description}</p>
                        
                        <div>
                          <Label className="text-sm font-medium">Compromised Data Types:</Label>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {breach.dataClasses.map((dataClass, idx) => (
                              <Badge key={idx} variant="secondary" className="text-xs">
                                {dataClass}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}

                  <Alert className="border-muted/50">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Recommended Actions:</strong> Change passwords for affected accounts, enable two-factor authentication, and monitor your accounts for suspicious activity.
                    </AlertDescription>
                  </Alert>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default BreachChecker;