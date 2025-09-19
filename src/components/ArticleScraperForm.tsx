import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Mail, Link, CheckCircle } from "lucide-react";

interface FormData {
  email: string;
  article_url: string;
}

const ArticleScraperForm = () => {
  const [formData, setFormData] = useState<FormData>({
    email: "",
    article_url: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateEmail(formData.email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    if (!validateUrl(formData.article_url)) {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid article URL.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await fetch("http://localhost:8000/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "accept": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          article_url: formData.article_url,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit request");
      }

      const result = await response.json();
      
      if (result.ok) {
        setIsSuccess(true);
        toast({
          title: "Success",
          description: "Your request has been submitted successfully!",
        });
      } else {
        throw new Error("Server returned an error");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit request. Please make sure the backend is running.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({ email: "", article_url: "" });
    setIsSuccess(false);
  };

  return (
    <div className="min-h-screen bg-gradient-subtle flex items-center justify-center p-6">
      <Card className="w-full max-w-md shadow-medium border-0">
        <CardHeader className="text-center space-y-4 pb-6">
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-foreground leading-tight">
              Article Scrapping Using AI Agent For Article Summary & Insights
            </h1>
            <p className="text-muted-foreground text-sm font-medium">
              Developed By Md. Shoaib Ahmed
            </p>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {isSuccess ? (
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <CheckCircle className="w-16 h-16 text-green-600" />
              </div>
              <p className="text-lg font-bold text-foreground">
                Email Sent Successfully.
              </p>
              <Button 
                onClick={resetForm}
                className="w-full transition-smooth"
                variant="outline"
              >
                Submit Another Request
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-foreground">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="pl-10 transition-smooth focus:ring-2 focus:ring-primary/20"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="article_url" className="text-sm font-medium text-foreground">
                  Article URL
                </Label>
                <div className="relative">
                  <Link className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="article_url"
                    type="url"
                    placeholder="https://example.com/article"
                    value={formData.article_url}
                    onChange={(e) => handleInputChange("article_url", e.target.value)}
                    className="pl-10 transition-smooth focus:ring-2 focus:ring-primary/20"
                    required
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-gradient-primary hover:opacity-90 transition-smooth shadow-soft"
                disabled={isLoading}
              >
                {isLoading ? "Processing..." : "Submit Request"}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ArticleScraperForm;