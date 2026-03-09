'use client';

import { ROLE_OPTIONS, TECH_STACKS_BY_ROLE } from '../constants/filter-options';

import { Checkbox } from '@/shared/components/ui/checkbox';
import { X } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { useState } from 'react';

interface TechStackFieldProps {
  selected: string[];
  onChange: (values: string[]) => void;
}

export default function TechStackField({
  selected,
  onChange,
}: TechStackFieldProps) {
  const [activeRole, setActiveRole] = useState<string>(ROLE_OPTIONS[0].value);
  const stacks = TECH_STACKS_BY_ROLE[activeRole] ?? [];

  const toggle = (value: string) => {
    if (selected.includes(value)) {
      onChange(selected.filter((v) => v !== value));
    } else {
      onChange([...selected, value]);
    }
  };

  const remove = (value: string) => {
    onChange(selected.filter((v) => v !== value));
  };

  return (
    <div className="space-y-3">
      {/* 선택된 태그 목록 */}
      {selected.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {selected.map((stack) => (
            <span
              key={stack}
              className="bg-primary/10 text-primary inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium"
            >
              {stack}
              <button
                type="button"
                onClick={() => remove(stack)}
                aria-label={`${stack} 닫기`}
                className="cursor-pointer rounded-full opacity-60 transition-opacity hover:opacity-100"
              >
                <X className="size-3" />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* 직군 탭 + 스택 체크리스트 */}
      <div className="border-border rounded-xl border">
        <div className="flex">
          {/* 좌: 직군 탭 */}
          <ul className="border-border flex w-36 shrink-0 flex-col border-r py-2">
            {ROLE_OPTIONS.map(({ label, value }) => (
              <li key={value}>
                <button
                  type="button"
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
          <ul className="no-scrollbar grid max-h-60 flex-1 grid-cols-2 content-start overflow-y-auto py-2">
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
      </div>
    </div>
  );
}
