import React from 'react';
import { Loader2 } from 'lucide-react';

type SpinnerSize = 'small' | 'default' | 'large';

interface SpinnerComponentProps {
  size?: SpinnerSize;
}

const Loader: React.FC<SpinnerComponentProps> = ({ size = 'default' }) => {
  const sizeClasses: Record<SpinnerSize, string> = {
    small: 'w-4 h-4',
    default: 'w-6 h-6',
    large: 'w-8 h-8'
  };

  return (
    <div className="flex items-center justify-center">
      <Loader2 className={`animate-spin ${sizeClasses[size]}`} />
    </div>
  );
};

export default Loader;