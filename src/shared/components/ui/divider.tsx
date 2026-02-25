import { Separator } from '@/shared/components/ui/separator';
import { cn } from '@/shared/lib/utils';

interface DividerProps {
  label?: string;
  className?: string;
  labelClassName?: string;
}

export function Divider({ label, className, labelClassName }: DividerProps) {
  return (
    <div className={cn('flex items-center', className)}>
      <Separator className="flex-1" />
      {label && (
        <>
          <span className={cn('text-muted-foreground px-3', labelClassName)}>
            {label}
          </span>
          <Separator className="flex-1" />
        </>
      )}
    </div>
  );
}
