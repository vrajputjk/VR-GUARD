import { DivideIcon as LucideIcon } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

interface ToolCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  href: string;
  category: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  status?: "Available" | "Coming Soon";
}

const ToolCard = ({ 
  title, 
  description, 
  icon: Icon, 
  href, 
  category, 
  difficulty,
  status = "Available"
}: ToolCardProps) => {
  const difficultyColors = {
    Beginner: "bg-green-500/10 text-green-400 border-green-500/30",
    Intermediate: "bg-yellow-500/10 text-yellow-400 border-yellow-500/30", 
    Advanced: "bg-red-500/10 text-red-400 border-red-500/30"
  };

  const isAvailable = status === "Available";

  const cardContent = (
    <Card className={`cyber-card h-full hover-lift hover-glow transition-all duration-500 animate-scale-in ${
      isAvailable 
        ? "cursor-pointer" 
        : "opacity-75 cursor-not-allowed"
    }`}>
      <CardHeader className="space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-primary/10 border border-primary/20 animate-glow-pulse">
              <Icon className="w-6 h-6 text-primary animate-float" />
            </div>
            <div>
              <CardTitle className="text-lg">{title}</CardTitle>
              <Badge variant="outline" className="text-xs mt-1 animate-fade-in">
                {category}
              </Badge>
            </div>
          </div>
          {!isAvailable && (
            <Badge variant="secondary" className="text-xs animate-bounce-in">
              Coming Soon
            </Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <CardDescription className="text-muted-foreground">
          {description}
        </CardDescription>
        
        <div className="flex items-center justify-between">
          <Badge 
            variant="outline" 
            className={`text-xs ${difficultyColors[difficulty]} animate-fade-in`}
          >
            {difficulty}
          </Badge>
          
          {isAvailable && (
            <span className="text-xs text-primary hover:text-accent transition-all duration-300 animate-bounce">
              Launch Tool →
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );

  if (isAvailable) {
    return (
      <Link to={href} className="block">
        {cardContent}
      </Link>
    );
  }

  return <div className="block">{cardContent}</div>;
};

export default ToolCard;