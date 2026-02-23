import { Separator } from '@/shared/components/ui/separator';

export function OrDivider() {
  return (
    <div className="relative flex items-center">
      <Separator className="flex-1" />
      <span className="text-muted-foreground px-3 text-xs">또는</span>
      <Separator className="flex-1" />
    </div>
  );
}
