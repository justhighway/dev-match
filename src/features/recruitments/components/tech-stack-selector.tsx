'use client';

import { Search, X } from 'lucide-react';

import { ALL_TECH_STACKS } from '../constants/filter-options';
import { cn } from '@/shared/lib/utils';
import { useState } from 'react';

interface TechStackSelectorProps {
  selectedStacks: string[];
  onStacksChange: (values: string[]) => void;
}

export default function TechStackSelector({
  selectedStacks,
  onStacksChange,
}: TechStackSelectorProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredStacks = searchQuery.trim()
    ? ALL_TECH_STACKS.filter((s) =>
        s.toLowerCase().includes(searchQuery.trim().toLowerCase()),
      )
    : ALL_TECH_STACKS;

  const toggleStack = (stack: string) => {
    onStacksChange(
      selectedStacks.includes(stack)
        ? selectedStacks.filter((s) => s !== stack)
        : [...selectedStacks, stack],
    );
  };

  const removeStack = (stack: string) => {
    onStacksChange(selectedStacks.filter((s) => s !== stack));
  };

  return (
    <div className="border-border rounded-xl border">
      {/* 검색창 */}
      <div className="border-b px-3 py-2.5">
        <div className="border-border flex items-center gap-2 rounded-lg border px-3 py-2">
          <Search className="text-muted-foreground size-4 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="기술스택 검색"
            className="placeholder:text-mute-foregorund flex-1 bg-transparent text-sm"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
            >
              <X className="size-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* 선택된 스택 배지 */}
      <div className="min-h-10 border-b px-3 py-2">
        {selectedStacks.length === 0 ? (
          <p className="text-muted-foreground text-sm">
            선택된 기술스택이 없습니다.
          </p>
        ) : (
          <ul>
            {selectedStacks.map((stack) => (
              <li
                key={stack}
                className="bg-primary/10 text-primary inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium"
              >
                {stack}
                <button
                  type="button"
                  aria-label={`${stack} 제거`}
                  onClick={() => removeStack(stack)}
                  className="cursor-pointer opacity-60 transition-opacity hover:opacity-100"
                >
                  <X className="size-3" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* 스택 목록 */}
      <div>
        {filteredStacks.length === 0 ? (
          <p>검색 결과가 없습니다.</p>
        ) : (
          <ul>
            {filteredStacks.map((stack) => (
              <li key={stack}>
                <button
                  type="button"
                  onClick={() => toggleStack(stack)}
                  aria-pressed={selectedStacks.includes(stack)}
                  className={cn(
                    'cursor-pointer rounded-full border px-3 py-1.5 text-sm font-medium transition-colors',
                    selectedStacks.includes(stack)
                      ? 'bg-primary/10 text-primary border-transparent'
                      : 'border-border bg-background text-foreground',
                  )}
                >
                  {stack}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
