'use client';

import { X } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';

import type { SortValue } from '../types';
import ConditionFilter from './filter/condition-filter';
import SortPopover from './filter/sort-popover';
import TechStackFilter from './filter/tech-stack-filter';

export default function RecruitmentFilterBar() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentSort = (searchParams.get('sort') ?? '') as SortValue | '';
  const selectedTypes = searchParams.getAll('type');
  const selectedRoles = searchParams.getAll('role');
  const selectedStacks = searchParams.getAll('stack');
  const headcountMin = searchParams.get('headcountMin');
  const headcountMax = searchParams.get('headcountMax');
  const headcountValue: [number, number] | null =
    headcountMin && headcountMax
      ? [Number(headcountMin), Number(headcountMax)]
      : null;

  const hasActiveFilters =
    selectedTypes.length > 0 ||
    selectedRoles.length > 0 ||
    selectedStacks.length > 0 ||
    headcountValue !== null;

  const updateSearchParams = (updates: Record<string, string | string[]>) => {
    const params = new URLSearchParams(searchParams.toString());

    for (const [key, value] of Object.entries(updates)) {
      params.delete(key);
      if (Array.isArray(value)) {
        value.forEach((v) => params.append(key, v));
      } else if (value) {
        params.set(key, value);
      }
    }

    router.push(`/recruitments?${params.toString()}`);
  };

  const handleConditionApply = ({
    types: newTypes,
    roles: newRoles,
    headcountValue: newHeadcount,
  }: {
    types: string[];
    roles: string[];
    headcountValue: [number, number] | null;
  }) => {
    const params = new URLSearchParams(searchParams.toString());

    params.delete('type');
    newTypes.forEach((type) => params.append('type', type));

    params.delete('role');
    newRoles.forEach((role) => params.append('role', role));

    params.delete('headcountMin');
    params.delete('headcountMax');
    if (newHeadcount) {
      params.set('headcountMin', String(newHeadcount[0]));
      params.set('headcountMax', String(newHeadcount[1]));
    }

    router.push(`/recruitments?${params.toString()}`);
  };

  const handleStacksApply = (newStacks: string[]) => {
    updateSearchParams({ stack: newStacks });
  };

  const handleSortChange = (newSort: SortValue | '') => {
    updateSearchParams({ sort: newSort });
  };

  const handleClearAllFilters = () => {
    const params = new URLSearchParams();
    if (currentSort) params.set('sort', currentSort);
    if (searchParams.get('onlyOpen')) params.set('onlyOpen', 'true');
    router.push(`/recruitments?${params.toString()}`);
  };

  return (
    <div className="no-scrollbar flex flex-nowrap items-center gap-2 overflow-x-auto pb-0.5 md:flex-wrap">
      <SortPopover value={currentSort} onChange={handleSortChange} />

      <div className="bg-border mx-1 h-5 w-px shrink-0" />

      <ConditionFilter
        types={selectedTypes}
        roles={selectedRoles}
        headcountValue={headcountValue}
        onApply={handleConditionApply}
      />

      <TechStackFilter selected={selectedStacks} onApply={handleStacksApply} />

      {hasActiveFilters && (
        <button
          type="button"
          onClick={handleClearAllFilters}
          className="text-muted-foreground hover:text-foreground flex shrink-0 cursor-pointer items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-medium whitespace-nowrap transition-colors"
        >
          <X className="size-3.5" aria-hidden />
          초기화
        </button>
      )}
    </div>
  );
}
