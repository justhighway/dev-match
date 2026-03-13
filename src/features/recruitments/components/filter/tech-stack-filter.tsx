'use client';

import { Code2 } from 'lucide-react';
import { useState } from 'react';

import { cn, toggleInArray } from '@/shared/lib/utils';

import FilterPanel, { FilterFooter } from './filter-panel';
import TechStackContent from './tech-stack-content';

interface TechStackFilterProps {
  selected: string[];
  onApply: (selectedStacks: string[]) => void;
}

export default function TechStackFilter({
  selected,
  onApply,
}: TechStackFilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [draftSelectedStacks, setDraftSelectedStacks] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const isActive = selected.length > 0;

  const handleOpenChange = (nextOpen: boolean) => {
    if (nextOpen) {
      setDraftSelectedStacks(selected);
      setSearchQuery('');
    }
    setIsOpen(nextOpen);
  };

  const handleStackToggle = (stack: string) =>
    setDraftSelectedStacks((prev) => toggleInArray(prev, stack));

  const handleStackRemove = (stack: string) =>
    setDraftSelectedStacks((prev) => prev.filter((s) => s !== stack));

  const handleReset = () => setDraftSelectedStacks([]);

  const handleApply = () => {
    onApply(draftSelectedStacks);
    setIsOpen(false);
  };

  const trigger = (
    <button
      type="button"
      onClick={() => handleOpenChange(true)}
      className={cn(
        'flex shrink-0 cursor-pointer items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm font-medium whitespace-nowrap transition-colors',
        isActive
          ? 'bg-primary/10 text-primary border-transparent'
          : 'border-border bg-background text-foreground hover:bg-secondary',
      )}
    >
      <Code2 className="size-3.5 shrink-0 opacity-60" aria-hidden />
      <span>기술스택{isActive ? ` (${selected.length})` : ''}</span>
    </button>
  );

  return (
    <FilterPanel
      title="기술스택"
      open={isOpen}
      onOpenChange={handleOpenChange}
      trigger={trigger}
      footer={
        <FilterFooter
          onReset={handleReset}
          onApply={handleApply}
          disableReset={draftSelectedStacks.length === 0}
        />
      }
    >
      <TechStackContent
        selectedStacks={draftSelectedStacks}
        searchQuery={searchQuery}
        onSearchQueryChange={setSearchQuery}
        onStackToggle={handleStackToggle}
        onStackRemove={handleStackRemove}
      />
    </FilterPanel>
  );
}
