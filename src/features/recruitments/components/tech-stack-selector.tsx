'use client';

import { Search, X } from 'lucide-react';
import { cn, toggleInArray } from '@/shared/lib/utils';

import { ALL_TECH_STACKS } from '../constants/filter-options';
import { useState } from 'react';

interface TechStackSelectorProps {
  selectedStacks: string[];
  onStacksChange: (updatedStacks: string[]) => void;
}

export default function TechStackSelector({
  selectedStacks,
  onStacksChange,
}: TechStackSelectorProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredStacks = searchQuery.trim()
    ? ALL_TECH_STACKS.filter((stack) =>
        stack.toLowerCase().includes(searchQuery.trim().toLowerCase()),
      )
    : ALL_TECH_STACKS;

  const handleStackToggle = (stack: string) => {
    onStacksChange(toggleInArray(selectedStacks, stack));
  };

  const handleStackRemove = (stack: string) => {
    onStacksChange(selectedStacks.filter((s) => s !== stack));
  };

  return (
    <div className="border-border rounded-xl border">
      {/* 검색창 */}
      <div className="border-b px-3 py-2.5">
        <div className="border-border flex items-center gap-2 rounded-lg border px-3 py-2">
          <Search
            className="text-muted-foreground size-4 shrink-0"
            aria-hidden
          />
          <input
            type="text"
            aria-label="기술스택 검색"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="기술스택 검색"
            className="placeholder:text-muted-foreground focus-visible:ring-primary/40 flex-1 bg-transparent text-sm outline-none focus-visible:ring-2 focus-visible:ring-offset-1"
          />
          {searchQuery && (
            <button
              type="button"
              aria-label="검색어 지우기"
              onClick={() => setSearchQuery('')}
              className="text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
            >
              <X className="size-3.5" aria-hidden />
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
          <ul className="flex flex-wrap gap-1.5">
            {selectedStacks.map((stack) => (
              <li
                key={stack}
                className="bg-primary/10 text-primary inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium"
              >
                {stack}
                <button
                  type="button"
                  aria-label={`${stack} 제거`}
                  onClick={() => handleStackRemove(stack)}
                  className="cursor-pointer opacity-60 transition-opacity hover:opacity-100"
                >
                  <X className="size-3" aria-hidden />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* 스택 목록 */}
      <div className="p-3">
        {filteredStacks.length === 0 ? (
          <p className="text-muted-foreground py-4 text-center text-sm">
            검색 결과가 없습니다.
          </p>
        ) : (
          <ul className="flex flex-wrap gap-1.5">
            {filteredStacks.map((stack) => (
              <li key={stack}>
                <button
                  type="button"
                  onClick={() => handleStackToggle(stack)}
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
