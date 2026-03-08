'use client';

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/shared/components/ui/popover';

import { ChevronDown } from 'lucide-react';
import { Slider } from '@/shared/components/ui/slider';
import { cn } from '@/shared/lib/utils';
import { useState } from 'react';

const MIN = 1;
const MAX = 10;

interface HeadcountPopoverProps {
  value: [number, number] | null;
  onChange: (value: [number, number] | null) => void;
}

const getIndicatorLabel = (value: [number, number] | null): string => {
  if (!value) return '모집규모';
  const [min, max] = value;
  if (min === MIN && max === MAX) return '모집규모';
  if (max === MAX) return `${min}명 이상`;
  if (min === max) return `${min}명`;
  return `${min}~${max}명`;
};

export default function HeadcountPopover({
  value,
  onChange,
}: HeadcountPopoverProps) {
  const [local, setLocal] = useState<[number, number]>(value ?? [MIN, MAX]);
  const isActive = value !== null && !(value[0] === MIN && value[1] === MAX);
  const label = getIndicatorLabel(value);

  const handleOpenChange = (open: boolean) => {
    if (open) setLocal(value ?? [MIN, MAX]);
  };

  const handleSliderChange = (vals: number[]) => {
    setLocal([vals[0], vals[1]]);
  };

  const handleApply = () => {
    if (local[0] === MIN && local[1] === MAX) {
      onChange(null);
    } else {
      onChange(local);
    }
  };

  const handleReset = () => {
    setLocal([MIN, MAX]);
    onChange(null);
  };

  const rangeLabel =
    local[1] === MAX
      ? `${local[0]}~${local[1]}명 이상`
      : `${local[0]}~${local[1]}명`;

  return (
    <Popover onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <button
          className={cn(
            'flex w-fit cursor-pointer items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors',
            isActive
              ? 'bg-primary/10 text-primary border-transparent'
              : 'border-border bg-background text-foreground hover:bg-secondary',
          )}
        >
          <span className="flex-1 truncate text-left">{label}</span>
          <ChevronDown className="size-3.5 shrink-0 opacity-60" />
        </button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-60 p-4">
        <div className="mb-4 flex items-center justify-between">
          <span className="text-sm font-medium">모집규모</span>
          <span className="text-muted-foreground text-sm">{rangeLabel}</span>
        </div>
        <Slider
          min={MIN}
          max={MAX}
          step={1}
          value={local}
          onValueChange={handleSliderChange}
          className="mb-4"
        />
        <div className="text-muted-foreground mb-4 flex justify-between text-sm">
          <span>{MIN}명</span>
          <span>{MAX}명 이상</span>
        </div>
        <div className="flex gap-2">
          {isActive && (
            <button
              onClick={handleReset}
              className="text-muted-foreground hover:text-foreground flex-1 cursor-pointer rounded-md border py-1.5 text-sm transition-colors"
            >
              초기화
            </button>
          )}
          <button
            onClick={handleApply}
            className="bg-primary text-primary-foreground hover:bg-primary/90 flex-1 cursor-pointer rounded-md py-1.5 text-sm font-medium transition-colors"
          >
            적용
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
