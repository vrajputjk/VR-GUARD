import React from 'react';
import { Home, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface BackToHomeButtonProps {
  variant?: 'home' | 'back';
  className?: string;
}

const BackToHomeButton: React.FC<BackToHomeButtonProps> = ({ 
  variant = 'home',
  className = '' 
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/');
  };

  return (
    <Button
      onClick={handleClick}
      variant="outline"
      size="sm"
      className={`
        fixed top-20 left-4 z-40 
        bg-background/80 backdrop-blur-md border-border/50
        hover:bg-primary/10 hover:border-primary/50 hover:scale-110
        transition-all duration-300 animate-slide-down
        shadow-lg hover:shadow-xl
        ${className}
      `}
    >
      {variant === 'home' ? (
        <>
          <Home className="w-4 h-4 mr-2" />
          Home
        </>
      ) : (
        <>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </>
      )}
    </Button>
  );
};

export default BackToHomeButton;