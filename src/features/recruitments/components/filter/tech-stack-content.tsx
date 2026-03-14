'use client';

import { Search, X } from 'lucide-react';

import { ALL_TECH_STACKS } from '../../constants/filter-options';
import { cn } from '@/shared/lib/utils';

interface TechStackContentProps {
  selectedStacks: string[];
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
  onStackToggle: (stack: string) => void;
  onStackRemove: (stack: string) => void;
}

export default function TechStackContent({
  selectedStacks,
  searchQuery,
  onSearchQueryChange,
  onStackToggle,
  onStackRemove,
}: TechStackContentProps) {
  const filteredStacks = searchQuery.trim()
    ? ALL_TECH_STACKS.filter((stack) =>
        stack.toLowerCase().includes(searchQuery.trim().toLowerCase()),
      )
    : ALL_TECH_STACKS;

  return (
    <div className="flex flex-col">
      <div className="border-b px-4 py-3">
        <div className="border-border bg-secondary flex items-center gap-2 rounded-lg border px-3 py-2">
          <Search
            className="text-muted-foreground size-4 shrink-0"
            aria-hidden
          />
          <input
            type="text"
            aria-label="기술스택 검색"
            value={searchQuery}
            onChange={(e) => onSearchQueryChange(e.target.value)}
            placeholder="기술스택 검색"
            className="placeholder:text-muted-foreground flex-1 bg-transparent text-sm outline-none"
          />
          {searchQuery && (
            <button
              type="button"
              aria-label="검색어 지우기"
              onClick={() => onSearchQueryChange('')}
              className="text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
            >
              <X className="size-3.5" aria-hidden />
            </button>
          )}
        </div>
      </div>

      <div className="max-h-70 overflow-y-auto px-4 py-6">
        {filteredStacks.length === 0 ? (
          <p className="text-muted-foreground py-8 text-center text-sm">
            검색 결과가 없습니다
          </p>
        ) : (
          <ul className="flex flex-wrap gap-2">
            {filteredStacks.map((stack) => (
              <li key={stack}>
                <button
                  type="button"
                  onClick={() => onStackToggle(stack)}
                  aria-pressed={selectedStacks.includes(stack)}
                  className={cn(
                    'cursor-pointer rounded-full border px-3 py-1.5 text-sm font-medium transition-colors',
                    selectedStacks.includes(stack)
                      ? 'bg-primary/10 text-primary border-transparent'
                      : 'border-border bg-background text-foreground hover:bg-secondary',
                  )}
                >
                  {stack}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="border-t px-4 py-3">
        <div className="flex max-h-16 min-h-16 flex-wrap content-start gap-1.5 overflow-y-auto">
          {selectedStacks.length === 0 ? (
            <span className="text-muted-foreground flex min-h-16 w-full items-center justify-center text-sm">
              기술 스택을 선택해주세요.
            </span>
          ) : (
            selectedStacks.map((stack) => (
              <span
                key={stack}
                className="bg-primary/10 text-primary flex items-center gap-1 rounded-full px-2.5 py-1 text-sm font-medium"
              >
                {stack}
                <button
                  type="button"
                  aria-label={`${stack} 제거`}
                  onClick={() => onStackRemove(stack)}
                  className="cursor-pointer opacity-60 transition-opacity hover:opacity-100"
                >
                  <X className="size-3" aria-hidden />
                </button>
              </span>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
