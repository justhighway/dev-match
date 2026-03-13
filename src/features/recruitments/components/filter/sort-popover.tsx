'use client';

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/shared/components/ui/popover';
import { Check, ChevronsUpDown } from 'lucide-react';
import { useState } from 'react';

import { SORT_OPTIONS } from '../../constants/filter-options';
import type { SortValue } from '../../types';

interface SortPopoverProps {
  value: SortValue | '';
  onChange: (value: SortValue | '') => void;
}

const DEFAULT_SORT = SORT_OPTIONS[0];
const LONGEST_LABEL = SORT_OPTIONS.reduce((a, b) =>
  a.label.length >= b.label.length ? a : b,
).label;

export default function SortPopover({ value, onChange }: SortPopoverProps) {
  const [open, setOpen] = useState(false);
  const currentLabel =
    SORT_OPTIONS.find((o) => o.value === value)?.label ?? DEFAULT_SORT.label;

  const handleSelect = (optValue: SortValue) => {
    onChange(optValue === value ? '' : optValue);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="border-border bg-background hover:bg-secondary flex shrink-0 cursor-pointer items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm font-medium whitespace-nowrap transition-colors"
        >
          <span className="relative">
            <span className="invisible whitespace-nowrap">{LONGEST_LABEL}</span>
            <span className="absolute inset-0 flex items-center">
              <span className="truncate">{currentLabel}</span>
            </span>
          </span>
          <ChevronsUpDown className="size-3.5 shrink-0 opacity-60" />
        </button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-44 p-2">
        <ul className="flex flex-col gap-0.5">
          {SORT_OPTIONS.map(({ label, value: optValue }) => (
            <li key={optValue}>
              <button
                type="button"
                onClick={() => handleSelect(optValue as SortValue)}
                className="hover:bg-secondary flex w-full cursor-pointer items-center justify-between rounded-md px-2 py-2 text-sm"
              >
                {label}
                {value === optValue && <Check className="size-4" />}
              </button>
            </li>
          ))}
        </ul>
      </PopoverContent>
    </Popover>
  );
}
