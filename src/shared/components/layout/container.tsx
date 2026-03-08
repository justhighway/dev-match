import { cn } from '@/shared/lib/utils';
import { ReactNode } from 'react';

interface ContainerProps {
  children: ReactNode;
  className?: string;
}

export default function Container({ children, className }: ContainerProps) {
  return (
    <div
      className={cn('max-w-screen-3xl mx-auto w-full px-6 md:px-8', className)}
    >
      {children}
    </div>
  );
}
