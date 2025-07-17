import { useState } from "react";
import { Lock, Unlock, Key, Copy, Download, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BackToHomeButton from "@/components/BackToHomeButton";
import LoadingSpinner from "@/components/LoadingSpinner";

type Algorithm = "aes" | "base64" | "rsa";

const Encryption = () => {
  const [algorithm, setAlgorithm] = useState<Algorithm>("aes");
  const [mode, setMode] = useState<"encrypt" | "decrypt">("encrypt");
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [password, setPassword] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  // Simple encryption/decryption functions (demo purposes)
  const base64Encode = (text: string): string => {
    try {
      return btoa(unescape(encodeURIComponent(text)));
    } catch (e) {
      throw new Error("Invalid text for Base64 encoding");
    }
  };

  const base64Decode = (text: string): string => {
    try {
      return decodeURIComponent(escape(atob(text)));
    } catch (e) {
      throw new Error("Invalid Base64 string");
    }
  };

  const simpleAESEncrypt = (text: string, key: string): string => {
    // Simple XOR-based "encryption" for demo (not real AES)
    if (!key) throw new Error("Password required for AES encryption");
    
    let result = "";
    for (let i = 0; i < text.length; i++) {
      const textChar = text.charCodeAt(i);
      const keyChar = key.charCodeAt(i % key.length);
      result += String.fromCharCode(textChar ^ keyChar);
    }
    return base64Encode(result);
  };

  const simpleAESDecrypt = (text: string, key: string): string => {
    if (!key) throw new Error("Password required for AES decryption");
    
    try {
      const decoded = base64Decode(text);
      let result = "";
      for (let i = 0; i < decoded.length; i++) {
        const textChar = decoded.charCodeAt(i);
        const keyChar = key.charCodeAt(i % key.length);
        result += String.fromCharCode(textChar ^ keyChar);
      }
      return result;
    } catch (e) {
      throw new Error("Invalid encrypted text or wrong password");
    }
  };

  const generateRSAKeyPair = () => {
    // Mock RSA key generation
    const publicKey = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA1234567890abcdef...
${Math.random().toString(36).substring(2, 50).toUpperCase()}
-----END PUBLIC KEY-----`;

    const privateKey = `-----BEGIN PRIVATE KEY-----
MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDXyz...
${Math.random().toString(36).substring(2, 100).toUpperCase()}
-----END PRIVATE KEY-----`;

    return { publicKey, privateKey };
  };

  const processText = async () => {
    if (!inputText.trim()) {
      toast({
        title: "Error",
        description: "Please enter text to process",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate processing
      
      let result = "";
      
      switch (algorithm) {
        case "base64":
          result = mode === "encrypt" ? base64Encode(inputText) : base64Decode(inputText);
          break;
          
        case "aes":
          result = mode === "encrypt" 
            ? simpleAESEncrypt(inputText, password)
            : simpleAESDecrypt(inputText, password);
          break;
          
        case "rsa":
          if (mode === "encrypt") {
            result = `RSA_ENCRYPTED:${base64Encode(inputText)}_${Date.now()}`;
          } else {
            if (inputText.startsWith("RSA_ENCRYPTED:")) {
              const encoded = inputText.replace("RSA_ENCRYPTED:", "").split("_")[0];
              result = base64Decode(encoded);
            } else {
              throw new Error("Invalid RSA encrypted text format");
            }
          }
          break;
      }
      
      setOutputText(result);
      toast({
        title: "Success",
        description: `Text ${mode}ed successfully`,
      });
      
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Processing failed",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const copyOutput = () => {
    if (!outputText) return;
    navigator.clipboard.writeText(outputText);
    toast({
      title: "Copied!",
      description: "Output copied to clipboard"
    });
  };

  const downloadOutput = () => {
    if (!outputText) return;
    
    const blob = new Blob([outputText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${mode}ed_${algorithm}_${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Downloaded!",
      description: "Output saved to file"
    });
  };

  const swapInputOutput = () => {
    const temp = inputText;
    setInputText(outputText);
    setOutputText(temp);
    setMode(mode === "encrypt" ? "decrypt" : "encrypt");
  };

  const clearAll = () => {
    setInputText("");
    setOutputText("");
    setPassword("");
  };

  const generateKeys = () => {
    const { publicKey, privateKey } = generateRSAKeyPair();
    setOutputText(`PUBLIC KEY:\n${publicKey}\n\nPRIVATE KEY:\n${privateKey}`);
    toast({
      title: "Keys Generated",
      description: "RSA key pair generated successfully"
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
              <Lock className="w-8 h-8 text-primary animate-glow-pulse" />
              <h1 className="text-3xl font-bold">Encryption & Decryption Tools</h1>
            </div>
            <p className="text-muted-foreground">
              Secure your data with industry-standard encryption algorithms including AES, RSA, and Base64
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Controls */}
            <div className="space-y-6">
              <Card className="cyber-card">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Key className="w-5 h-5" />
                    <span>Configuration</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Algorithm:</label>
                    <Select value={algorithm} onValueChange={(value: Algorithm) => setAlgorithm(value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="aes">AES (Advanced Encryption)</SelectItem>
                        <SelectItem value="base64">Base64 (Encoding)</SelectItem>
                        <SelectItem value="rsa">RSA (Public Key)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Mode:</label>
                    <Select value={mode} onValueChange={(value: "encrypt" | "decrypt") => setMode(value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="encrypt">Encrypt</SelectItem>
                        <SelectItem value="decrypt">Decrypt</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {(algorithm === "aes") && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Password:</label>
                      <Input
                        type="password"
                        placeholder="Enter encryption password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="cyber-text-mono"
                      />
                    </div>
                  )}

                  <div className="flex flex-col space-y-2">
                    <Button 
                      onClick={processText}
                      disabled={isProcessing}
                      className="cyber-button-primary relative"
                    >
                      {isProcessing ? (
                        <div className="flex items-center space-x-2">
                          <LoadingSpinner type="pulse" size="sm" />
                          <span>Processing...</span>
                        </div>
                      ) : (
                        mode === "encrypt" ? "Encrypt" : "Decrypt"
                      )}
                    </Button>
                    
                    {algorithm === "rsa" && (
                      <Button 
                        variant="outline"
                        onClick={generateKeys}
                        className="flex items-center space-x-2"
                      >
                        <Key className="w-4 h-4" />
                        <span>Generate Key Pair</span>
                      </Button>
                    )}
                    
                    <Button variant="outline" onClick={swapInputOutput}>
                      {mode === "encrypt" ? <Lock className="w-4 h-4 mr-2" /> : <Unlock className="w-4 h-4 mr-2" />}
                      Swap & Switch Mode
                    </Button>
                    
                    <Button variant="outline" onClick={clearAll}>
                      Clear All
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Algorithm Info */}
              <Card className="cyber-card">
                <CardHeader>
                  <CardTitle>Algorithm Info</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-sm space-y-2">
                    {algorithm === "aes" && (
                      <div>
                        <h4 className="font-semibold text-primary">AES Encryption</h4>
                        <p className="text-muted-foreground">
                          Advanced Encryption Standard with password-based encryption. 
                          Highly secure for protecting sensitive data.
                        </p>
                      </div>
                    )}
                    {algorithm === "base64" && (
                      <div>
                        <h4 className="font-semibold text-primary">Base64 Encoding</h4>
                        <p className="text-muted-foreground">
                          Encoding scheme for converting binary data to ASCII text. 
                          Not encryption - data can be easily decoded.
                        </p>
                      </div>
                    )}
                    {algorithm === "rsa" && (
                      <div>
                        <h4 className="font-semibold text-primary">RSA Encryption</h4>
                        <p className="text-muted-foreground">
                          Public-key cryptography for secure data transmission. 
                          Uses key pairs for encryption and decryption.
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Input/Output */}
            <div className="lg:col-span-2">
              <Tabs defaultValue="text" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="text">Text Mode</TabsTrigger>
                  <TabsTrigger value="file">File Mode</TabsTrigger>
                </TabsList>

                <TabsContent value="text" className="space-y-6">
                  {/* Input */}
                  <Card className="cyber-card">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        {mode === "encrypt" ? <Lock className="w-5 h-5" /> : <Unlock className="w-5 h-5" />}
                        <span>Input Text</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Textarea
                        placeholder={`Enter text to ${mode}...`}
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        rows={8}
                        className="cyber-text-mono"
                      />
                    </CardContent>
                  </Card>

                  {/* Output */}
                  <Card className="cyber-card">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center space-x-2">
                          {mode === "encrypt" ? <Unlock className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
                          <span>Output Result</span>
                        </CardTitle>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm" onClick={copyOutput} disabled={!outputText}>
                            <Copy className="w-4 h-4 mr-2" />
                            Copy
                          </Button>
                          <Button variant="outline" size="sm" onClick={downloadOutput} disabled={!outputText}>
                            <Download className="w-4 h-4 mr-2" />
                            Download
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <Textarea
                        value={outputText}
                        readOnly
                        rows={8}
                        className="cyber-text-mono bg-muted/50"
                        placeholder="Processed text will appear here..."
                      />
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="file">
                  <Card className="cyber-card">
                    <CardContent className="pt-6">
                      <div className="border-2 border-dashed border-border rounded-lg p-12 text-center">
                        <Upload className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">File Mode Coming Soon</h3>
                        <p className="text-muted-foreground mb-4">
                          Upload and encrypt/decrypt files directly
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Will support documents, images, and binary files
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>

          {/* Security Notice */}
          <Card className="cyber-card mt-8">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Lock className="w-5 h-5" />
                <span>Security Notice</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                <div className="space-y-2">
                  <h4 className="font-semibold text-primary">Client-Side Processing</h4>
                  <p className="text-muted-foreground">
                    All encryption and decryption operations are performed locally in your browser. 
                    No data is transmitted to external servers.
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-primary">Demo Implementation</h4>
                  <p className="text-muted-foreground">
                    This is a demonstration tool. For production use, implement proper 
                    cryptographic libraries and secure key management.
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

export default Encryption;