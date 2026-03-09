'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog';
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/shared/components/ui/drawer';

import { X } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { useMediaQuery } from '@/shared/hooks/use-media-query';

interface FilterPanelProps {
  title: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  trigger: React.ReactNode;
  footer: React.ReactNode;
  children: React.ReactNode;
  contentClassName?: string;
}

function CloseButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="text-muted-foreground hover:text-foreground cursor-pointer rounded-md p-1 transition-colors"
    >
      <X className="size-4" />
    </button>
  );
}

export function FilterFooter({
  onReset,
  onApply,
  disableReset,
}: {
  onReset: () => void;
  onApply: () => void;
  disableReset: boolean;
}) {
  return (
    <div className="flex gap-2">
      <button
        onClick={onReset}
        disabled={disableReset}
        className={cn(
          'flex-1 rounded-lg border py-2.5 text-sm font-medium transition-colors',
          disableReset
            ? 'border-border text-muted-foreground/40 cursor-default'
            : 'text-muted-foreground hover:text-foreground cursor-pointer',
        )}
      >
        초기화
      </button>
      <button
        onClick={onApply}
        className="bg-primary text-primary-foreground hover:bg-primary/90 flex-2 cursor-pointer rounded-lg py-2.5 text-sm font-medium transition-colors"
      >
        적용하기
      </button>
    </div>
  );
}

export default function FilterPanel({
  title,
  open,
  onOpenChange,
  trigger,
  footer,
  children,
  contentClassName,
}: FilterPanelProps) {
  const isDesktop = useMediaQuery('(min-width: 1024px)');

  if (isDesktop) {
    return (
      <>
        {trigger}
        <Dialog open={open} onOpenChange={onOpenChange}>
          <DialogContent className="max-w-lg gap-0 p-0" showCloseButton={false}>
            <DialogHeader className="px-6 py-4">
              <div className="flex items-center justify-between">
                <DialogTitle className="text-base">{title}</DialogTitle>
                <CloseButton onClick={() => onOpenChange(false)} />
              </div>
            </DialogHeader>
            <div className={cn('overflow-y-auto border-b', contentClassName)}>
              {children}
            </div>
            <div className="px-6 py-4">{footer}</div>
          </DialogContent>
        </Dialog>
      </>
    );
  }

  return (
    <>
      {trigger}
      <Drawer open={open} onOpenChange={onOpenChange} direction="bottom">
        <DrawerContent>
          <DrawerHeader className="px-6 py-4 text-left">
            <DrawerTitle className="text-base">{title}</DrawerTitle>
          </DrawerHeader>
          <div className={cn('overflow-y-auto border-b', contentClassName)}>
            {children}
          </div>
          <DrawerFooter className="px-6 py-4">{footer}</DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
}
