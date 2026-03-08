'use client';

import { Checkbox } from '@/shared/components/ui/checkbox';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/shared/components/ui/popover';
import { cn } from '@/shared/lib/utils';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

import { ROLE_OPTIONS, TECH_STACKS_BY_ROLE } from '../constants/filter-options';

interface TechStackPopoverProps {
  selected: string[];
  onChange: (values: string[]) => void;
}

const getIndicatorLabel = (selected: string[]): string => {
  if (selected.length === 0) return '기술스택';
  if (selected.length === 1) return selected[0];
  return `${selected[0]} 외 ${selected.length - 1}`;
};

export default function TechStackPopover({
  selected,
  onChange,
}: TechStackPopoverProps) {
  const [activeRole, setActiveRole] = useState<string>(ROLE_OPTIONS[0].value);
  const isActive = selected.length > 0;
  const stacks = TECH_STACKS_BY_ROLE[activeRole] ?? [];

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
          <span className="truncate text-left">
            {getIndicatorLabel(selected)}
          </span>
          <ChevronDown className="size-3.5 shrink-0 opacity-60" />
        </button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-auto p-0" sideOffset={6}>
        {/* 헤더 */}
        <div className="flex items-center justify-between border-b px-3 py-2">
          <span className="text-sm font-semibold">기술스택</span>
          {isActive && (
            <button
              onClick={() => onChange([])}
              className="text-muted-foreground hover:text-foreground cursor-pointer text-xs transition-colors"
            >
              초기화
            </button>
          )}
        </div>

        {/* 본문: 직군 탭(좌) + 스택 목록(우) */}
        <div className="flex">
          {/* 좌: 직군 탭 */}
          <ul className="border-border flex w-36 flex-col border-r py-2">
            {ROLE_OPTIONS.map(({ label, value }) => (
              <li key={value}>
                <button
                  onClick={() => setActiveRole(value)}
                  className={cn(
                    'w-full cursor-pointer px-3 py-2 text-left text-sm transition-colors',
                    activeRole === value
                      ? 'bg-primary/10 text-primary font-medium'
                      : 'text-foreground hover:bg-secondary',
                  )}
                >
                  {label}
                </button>
              </li>
            ))}
          </ul>

          {/* 우: 스택 체크리스트 */}
          <ul className="flex max-h-75 w-48 flex-col overflow-y-auto py-2">
            {stacks.map((stack) => (
              <li key={stack}>
                <label className="hover:bg-secondary flex cursor-pointer items-center gap-2.5 rounded-md px-3 py-2 text-sm">
                  <Checkbox
                    checked={selected.includes(stack)}
                    onCheckedChange={() => toggle(stack)}
                  />
                  <span>{stack}</span>
                </label>
              </li>
            ))}
          </ul>
        </div>
      </PopoverContent>
    </Popover>
  );
}
