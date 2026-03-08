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
import {
  RECRUITMENT_TYPE_OPTIONS,
  ROLE_OPTIONS,
} from '../constants/filter-options';
import { SlidersHorizontal, X } from 'lucide-react';

import { Slider } from '@/shared/components/ui/slider';
import { cn } from '@/shared/lib/utils';
import { useMediaQuery } from '@/shared/hooks/use-media-query';
import { useState } from 'react';

const MIN = 1;
const MAX = 10;

interface ConditionFilterProps {
  types: string[];
  roles: string[];
  headcountValue: [number, number] | null;
  onApply: (params: {
    types: string[];
    roles: string[];
    headcountValue: [number, number] | null;
  }) => void;
}

const getActiveCount = (
  types: string[],
  roles: string[],
  headcountValue: [number, number] | null,
): number => {
  let count = 0;
  if (types.length > 0) count++;
  if (roles.length > 0) count++;
  if (
    headcountValue &&
    !(headcountValue[0] === MIN && headcountValue[1] === MAX)
  )
    count++;
  return count;
};

function ConditionFooter({
  onReset,
  onApply,
  activeCount,
}: {
  onReset: () => void;
  onApply: () => void;
  activeCount: number;
}) {
  return (
    <div className="flex gap-2">
      <button
        onClick={onReset}
        disabled={activeCount === 0}
        className={cn(
          'flex-1 rounded-lg border py-2.5 text-sm font-medium transition-colors',
          activeCount === 0
            ? 'border-border text-muted-foreground/40 cursor-default'
            : 'text-muted-foreground hover:text-foreground cursor-pointer',
        )}
      >
        초기화
      </button>
      <button
        onClick={onApply}
        className="bg-primary text-primary-foreground hover:bg-primary/90 flex-1 cursor-pointer rounded-lg py-2.5 text-sm font-medium transition-colors"
      >
        적용하기
      </button>
    </div>
  );
}

function ConditionContent({
  localTypes,
  localRoles,
  localHeadcount,
  onTypeToggle,
  onRoleToggle,
  onHeadcountChange,
}: {
  localTypes: string[];
  localRoles: string[];
  localHeadcount: [number, number];
  onTypeToggle: (value: string) => void;
  onRoleToggle: (value: string) => void;
  onHeadcountChange: (vals: number[]) => void;
}) {
  const rangeLabel =
    localHeadcount[1] === MAX
      ? `${localHeadcount[0]}~${localHeadcount[1]}명 이상`
      : `${localHeadcount[0]}~${localHeadcount[1]}명`;

  return (
    <div className="flex flex-col">
      {/* 모집종류 */}
      <div className="px-6 py-8">
        <p className="text-foreground mb-4 text-sm font-semibold">모집종류</p>
        <div className="flex flex-wrap gap-2">
          {RECRUITMENT_TYPE_OPTIONS.map(({ label, value }) => (
            <button
              key={value}
              onClick={() => onTypeToggle(value)}
              className={cn(
                'cursor-pointer rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors',
                localTypes.includes(value)
                  ? 'bg-primary/10 text-primary border-transparent'
                  : 'border-border bg-background text-foreground hover:bg-secondary',
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="border-t" />

      {/* 모집대상 */}
      <div className="px-6 py-8">
        <p className="text-foreground mb-4 text-sm font-semibold">모집대상</p>
        <div className="flex flex-wrap gap-2">
          {ROLE_OPTIONS.map(({ label, value }) => (
            <button
              key={value}
              onClick={() => onRoleToggle(value)}
              className={cn(
                'cursor-pointer rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors',
                localRoles.includes(value)
                  ? 'bg-primary/10 text-primary border-transparent'
                  : 'border-border bg-background text-foreground hover:bg-secondary',
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="border-t" />

      {/* 모집인원 */}
      <div className="px-6 py-8">
        <div className="mb-4 flex items-center justify-between">
          <p className="text-foreground text-sm font-semibold">모집인원</p>
          <span className="text-muted-foreground text-sm">{rangeLabel}</span>
        </div>
        <Slider
          min={MIN}
          max={MAX}
          step={1}
          value={localHeadcount}
          onValueChange={onHeadcountChange}
          className="mb-4"
        />
        <div className="text-muted-foreground flex justify-between text-sm">
          <span>{MIN}명</span>
          <span>{MAX}명 이상</span>
        </div>
      </div>
    </div>
  );
}

const CloseButton = ({ onClick }: { onClick: () => void }) => (
  <button
    onClick={onClick}
    className="text-muted-foreground hover:text-foreground cursor-pointer rounded-md p-1 transition-colors"
  >
    <X className="size-4" />
  </button>
);

export default function ConditionFilter({
  types,
  roles,
  headcountValue,
  onApply,
}: ConditionFilterProps) {
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const [open, setOpen] = useState(false);

  const [localTypes, setLocalTypes] = useState<string[]>(types);
  const [localRoles, setLocalRoles] = useState<string[]>(roles);
  const [localHeadcount, setLocalHeadcount] = useState<[number, number]>(
    headcountValue ?? [MIN, MAX],
  );

  const activeCount = getActiveCount(types, roles, headcountValue);
  const isActive = activeCount > 0;

  const handleOpen = (nextOpen: boolean) => {
    if (nextOpen) {
      setLocalTypes(types);
      setLocalRoles(roles);
      setLocalHeadcount(headcountValue ?? [MIN, MAX]);
    }
    setOpen(nextOpen);
  };

  const toggleType = (value: string) => {
    setLocalTypes((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value],
    );
  };

  const toggleRole = (value: string) => {
    setLocalRoles((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value],
    );
  };

  const handleHeadcountChange = (vals: number[]) => {
    setLocalHeadcount([vals[0], vals[1]]);
  };

  const handleReset = () => {
    setLocalTypes([]);
    setLocalRoles([]);
    setLocalHeadcount([MIN, MAX]);
  };

  const handleApply = () => {
    const headcount =
      localHeadcount[0] === MIN && localHeadcount[1] === MAX
        ? null
        : localHeadcount;
    onApply({
      types: localTypes,
      roles: localRoles,
      headcountValue: headcount,
    });
    setOpen(false);
  };

  const trigger = (
    <button
      onClick={() => handleOpen(true)}
      className={cn(
        'flex shrink-0 cursor-pointer items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm font-medium whitespace-nowrap transition-colors',
        isActive
          ? 'bg-primary/10 text-primary border-transparent'
          : 'border-border bg-background text-foreground hover:bg-secondary',
      )}
    >
      <SlidersHorizontal className="size-3.5 shrink-0 opacity-60" />
      <span>모집조건{isActive ? ` (${activeCount})` : ''}</span>
    </button>
  );

  const contentProps = {
    localTypes,
    localRoles,
    localHeadcount,
    onTypeToggle: toggleType,
    onRoleToggle: toggleRole,
    onHeadcountChange: handleHeadcountChange,
  };

  const footerProps = {
    onReset: handleReset,
    onApply: handleApply,
    activeCount,
  };

  if (isDesktop) {
    return (
      <>
        {trigger}
        <Dialog open={open} onOpenChange={handleOpen}>
          <DialogContent className="max-w-lg gap-0 p-0" showCloseButton={false}>
            <DialogHeader className="px-6 py-4">
              <div className="flex items-center justify-between">
                <DialogTitle className="text-base">모집조건</DialogTitle>
                <CloseButton onClick={() => setOpen(false)} />
              </div>
            </DialogHeader>
            <div className="max-h-dialog-content overflow-y-auto border-b">
              <ConditionContent {...contentProps} />
            </div>
            <div className="px-6 py-4">
              <ConditionFooter {...footerProps} />
            </div>
          </DialogContent>
        </Dialog>
      </>
    );
  }

  return (
    <>
      {trigger}
      <Drawer open={open} onOpenChange={handleOpen} direction="bottom">
        <DrawerContent>
          <DrawerHeader className="px-6 py-4 text-left">
            <DrawerTitle className="text-base">모집조건</DrawerTitle>
          </DrawerHeader>
          <div className="overflow-y-auto border-b">
            <ConditionContent {...contentProps} />
          </div>
          <DrawerFooter className="px-6 py-4">
            <ConditionFooter {...footerProps} />
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
}
