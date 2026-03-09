'use client';

import { Code2, Search, X } from 'lucide-react';
import { useState } from 'react';

import { cn } from '@/shared/lib/utils';

import { ALL_TECH_STACKS } from '../constants/filter-options';
import FilterPanel, { FilterFooter } from './filter-panel';

interface TechStackFilterProps {
  selected: string[];
  onApply: (values: string[]) => void;
}

function TechStackContent({
  localSelected,
  query,
  onQueryChange,
  onToggle,
  onRemove,
}: {
  localSelected: string[];
  query: string;
  onQueryChange: (q: string) => void;
  onToggle: (stack: string) => void;
  onRemove: (stack: string) => void;
}) {
  const filtered = query.trim()
    ? ALL_TECH_STACKS.filter((s) =>
        s.toLowerCase().includes(query.trim().toLowerCase()),
      )
    : ALL_TECH_STACKS;

  return (
    <div className="flex flex-col">
      {/* 검색창 */}
      <div className="border-b px-4 py-3">
        <div className="border-border bg-secondary flex items-center gap-2 rounded-lg border px-3 py-2">
          <Search className="text-muted-foreground size-4 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder="기술스택 검색"
            className="placeholder:text-muted-foreground flex-1 bg-transparent text-sm outline-none"
          />
          {query && (
            <button
              type="button"
              onClick={() => onQueryChange('')}
              className="text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
            >
              <X className="size-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* 스택 목록 */}
      <div className="max-h-70 overflow-y-auto px-4 py-6">
        {filtered.length === 0 ? (
          <p className="text-muted-foreground py-8 text-center text-sm">
            검색 결과가 없습니다
          </p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {filtered.map((stack) => (
              <button
                key={stack}
                type="button"
                onClick={() => onToggle(stack)}
                className={cn(
                  'cursor-pointer rounded-full border px-3 py-1.5 text-sm font-medium transition-colors',
                  localSelected.includes(stack)
                    ? 'bg-primary/10 text-primary border-transparent'
                    : 'border-border bg-background text-foreground hover:bg-secondary',
                )}
              >
                {stack}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 선택된 스택 배지 */}
      <div className="border-t px-4 py-3">
        <div className="flex max-h-17 min-h-17 flex-wrap content-start gap-1.5 overflow-y-auto">
          {localSelected.length === 0 ? (
            <span className="text-muted-foreground flex min-h-17 w-full items-center justify-center text-sm">
              기술 스택을 선택해주세요.
            </span>
          ) : (
            localSelected.map((stack) => (
              <span
                key={stack}
                className="bg-primary/10 text-primary flex items-center gap-1 rounded-full px-2.5 py-1 text-sm font-medium"
              >
                {stack}
                <button
                  type="button"
                  onClick={() => onRemove(stack)}
                  className="cursor-pointer opacity-60 transition-opacity hover:opacity-100"
                >
                  <X className="size-3" />
                </button>
              </span>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default function TechStackFilter({
  selected,
  onApply,
}: TechStackFilterProps) {
  const [open, setOpen] = useState(false);
  const [localSelected, setLocalSelected] = useState<string[]>([]);
  const [query, setQuery] = useState('');

  const isActive = selected.length > 0;

  const handleOpen = (nextOpen: boolean) => {
    if (nextOpen) {
      setLocalSelected(selected);
      setQuery('');
    }
    setOpen(nextOpen);
  };

  const toggle = (stack: string) =>
    setLocalSelected((prev) =>
      prev.includes(stack) ? prev.filter((s) => s !== stack) : [...prev, stack],
    );

  const remove = (stack: string) =>
    setLocalSelected((prev) => prev.filter((s) => s !== stack));

  const handleReset = () => setLocalSelected([]);

  const handleApply = () => {
    onApply(localSelected);
    setOpen(false);
  };

  const trigger = (
    <button
      type="button"
      onClick={() => handleOpen(true)}
      className={cn(
        'flex shrink-0 cursor-pointer items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm font-medium whitespace-nowrap transition-colors',
        isActive
          ? 'bg-primary/10 text-primary border-transparent'
          : 'border-border bg-background text-foreground hover:bg-secondary',
      )}
    >
      <Code2 className="size-3.5 shrink-0 opacity-60" />
      <span>기술스택{isActive ? ` (${selected.length})` : ''}</span>
    </button>
  );

  return (
    <FilterPanel
      title="기술스택"
      open={open}
      onOpenChange={handleOpen}
      trigger={trigger}
      footer={
        <FilterFooter
          onReset={handleReset}
          onApply={handleApply}
          disableReset={localSelected.length === 0}
        />
      }
    >
      <TechStackContent
        localSelected={localSelected}
        query={query}
        onQueryChange={setQuery}
        onToggle={toggle}
        onRemove={remove}
      />
    </FilterPanel>
  );
}
