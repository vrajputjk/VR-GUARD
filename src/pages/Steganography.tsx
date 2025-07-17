import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ImageIcon, Lock, Unlock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Steganography = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [message, setMessage] = useState("");
  const [passphrase, setPassphrase] = useState("");
  const [extractedMessage, setExtractedMessage] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && (file.type === "image/png" || file.type === "image/jpeg")) {
      setSelectedFile(file);
    } else {
      toast({
        title: "Invalid File",
        description: "Please select a PNG or JPEG image",
        variant: "destructive",
      });
    }
  };

  const encodeMessage = () => {
    if (!selectedFile || !message.trim() || !passphrase.trim()) {
      toast({
        title: "Missing Information",
        description: "Please select an image, enter a message, and provide a passphrase",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    
    // Simulate encoding process
    setTimeout(() => {
      toast({
        title: "Message Encoded",
        description: "Your message has been hidden in the image successfully",
      });
      setIsProcessing(false);
    }, 2000);
  };

  const decodeMessage = () => {
    if (!selectedFile || !passphrase.trim()) {
      toast({
        title: "Missing Information",
        description: "Please select an image and provide the passphrase",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    
    // Simulate decoding process
    setTimeout(() => {
      const mockMessage = "This is a secret hidden message extracted from the image!";
      setExtractedMessage(mockMessage);
      toast({
        title: "Message Extracted",
        description: "Hidden message found and decoded successfully",
      });
      setIsProcessing(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold bg-gradient-cyber bg-clip-text text-transparent">
              Steganography Tool
            </h1>
            <p className="text-muted-foreground">
              Hide and extract secret messages within images
            </p>
          </div>

          <Card className="cyber-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ImageIcon className="w-5 h-5" />
                Image Selection
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="image">Select Image (PNG/JPEG)</Label>
                <Input
                  id="image"
                  type="file"
                  accept="image/png,image/jpeg"
                  onChange={handleFileSelect}
                />
                {selectedFile && (
                  <p className="text-sm text-muted-foreground">
                    Selected: {selectedFile.name} ({Math.round(selectedFile.size / 1024)} KB)
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="passphrase">Passphrase</Label>
                <Input
                  id="passphrase"
                  type="password"
                  placeholder="Enter a secure passphrase"
                  value={passphrase}
                  onChange={(e) => setPassphrase(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="encode" className="space-y-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="encode">Encode Message</TabsTrigger>
              <TabsTrigger value="decode">Decode Message</TabsTrigger>
            </TabsList>

            <TabsContent value="encode">
              <Card className="cyber-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lock className="w-5 h-5" />
                    Hide Message in Image
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="message">Secret Message</Label>
                    <Textarea
                      id="message"
                      placeholder="Enter the message you want to hide..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      rows={4}
                    />
                  </div>
                  
                  <Button 
                    onClick={encodeMessage}
                    disabled={isProcessing}
                    className="w-full"
                  >
                    {isProcessing ? "Encoding Message..." : "Hide Message in Image"}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="decode">
              <Card className="cyber-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Unlock className="w-5 h-5" />
                    Extract Hidden Message
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button 
                    onClick={decodeMessage}
                    disabled={isProcessing}
                    className="w-full relative"
                  >
                    {isProcessing ? (
                      <div className="flex items-center justify-center space-x-2">
                        <LoadingSpinner type="vr" size="sm" />
                        <span>Extracting Message...</span>
                      </div>
                    ) : (
                      "Extract Hidden Message"
                    )}
                  </Button>

                  {extractedMessage && (
                    <div className="space-y-2">
                      <Label>Extracted Message</Label>
                      <div className="p-3 rounded-lg bg-muted/50 border border-border">
                        <p className="text-sm">{extractedMessage}</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <Card className="cyber-card border-muted/50">
            <CardContent className="pt-6">
              <div className="text-center text-sm text-muted-foreground">
                <p><strong>Note:</strong> This is a demonstration tool. In a real implementation, steganography would involve complex algorithms to embed data in the least significant bits of image pixels.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Steganography;