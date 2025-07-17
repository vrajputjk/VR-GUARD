import React from 'react';

interface LoadingSpinnerProps {
  type?: 'vr' | 'hex' | 'pulse';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  type = 'vr', 
  size = 'md',
  className = '' 
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  };

  if (type === 'vr') {
    return (
      <div className={`vr-loader ${sizeClasses[size]} ${className}`} />
    );
  }

  if (type === 'hex') {
    return (
      <div className={`hex-loader ${sizeClasses[size]} ${className}`} />
    );
  }

  if (type === 'pulse') {
    return (
      <div className={`pulse-loader ${className}`}>
        <div></div>
        <div></div>
        <div></div>
      </div>
    );
  }

  return null;
};

export default LoadingSpinner;