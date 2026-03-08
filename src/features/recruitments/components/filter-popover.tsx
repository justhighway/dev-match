'use client';

import { Checkbox } from '@/shared/components/ui/checkbox';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/shared/components/ui/popover';
import { cn } from '@/shared/lib/utils';
import { ChevronDown } from 'lucide-react';

interface Option {
  label: string;
  value: string;
}

interface FilterPopoverProps {
  label: string;
  options: readonly Option[];
  selected: string[];
  onChange: (values: string[]) => void;
}

const getIndicatorLabel = (
  selected: string[],
  options: readonly Option[],
): string | null => {
  if (selected.length === 0) return null;
  const firstName =
    options.find((o) => o.value === selected[0])?.label ?? selected[0];
  if (selected.length === 1) return firstName;
  return `${firstName} 외 ${selected.length - 1}`;
};

export default function FilterPopover({
  label,
  options,
  selected,
  onChange,
}: FilterPopoverProps) {
  const isActive = selected.length > 0;
  const indicatorLabel = getIndicatorLabel(selected, options);

  const toggle = (value: string) => {
    if (selected.includes(value)) {
      onChange(selected.filter((v) => v !== value));
    } else {
      onChange([...selected, value]);
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          className={cn(
            'flex w-fit cursor-pointer items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors',
            isActive
              ? 'bg-primary/10 text-primary border-transparent'
              : 'border-border bg-background text-foreground hover:bg-secondary',
          )}
        >
          <span className="flex-1 truncate text-left">
            {isActive ? indicatorLabel : label}
          </span>
          <ChevronDown className="size-3.5 shrink-0 opacity-60" />
        </button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-52 p-2">
        <div className="mb-2 flex items-center justify-between px-2 py-1">
          <span className="text-sm font-semibold">{label}</span>
          {isActive && (
            <button
              onClick={() => onChange([])}
              className="text-muted-foreground hover:text-foreground cursor-pointer text-xs transition-colors"
            >
              초기화
            </button>
          )}
        </div>
        <ul className="flex flex-col gap-0.5">
          {options.map(({ label: optLabel, value }) => (
            <li key={value}>
              <label className="hover:bg-secondary flex cursor-pointer items-center gap-2.5 rounded-md px-2 py-2 text-sm">
                <Checkbox
                  checked={selected.includes(value)}
                  onCheckedChange={() => toggle(value)}
                />
                <span>{optLabel}</span>
              </label>
            </li>
          ))}
        </ul>
      </PopoverContent>
    </Popover>
  );
}
