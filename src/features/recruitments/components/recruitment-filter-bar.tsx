'use client';

import { X } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';

import { type SortValue } from '../constants/filter-options';
import ConditionFilter from './condition-filter';
import SortPopover from './sort-popover';
import TechStackFilter from './tech-stack-filter';

export default function RecruitmentFilterBar() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const sort = (searchParams.get('sort') ?? '') as SortValue | '';
  const types = searchParams.getAll('type');
  const roles = searchParams.getAll('role');
  const stacks = searchParams.getAll('stack');
  const headcountMin = searchParams.get('headcountMin');
  const headcountMax = searchParams.get('headcountMax');
  const headcountValue: [number, number] | null =
    headcountMin && headcountMax
      ? [Number(headcountMin), Number(headcountMax)]
      : null;

  const hasActiveFilters =
    types.length > 0 ||
    roles.length > 0 ||
    stacks.length > 0 ||
    headcountValue !== null;

  const updateParams = useCallback(
    (updates: Record<string, string | string[]>) => {
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
    },
    [router, searchParams],
  );

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
    newTypes.forEach((v) => params.append('type', v));

    params.delete('role');
    newRoles.forEach((v) => params.append('role', v));

    params.delete('headcountMin');
    params.delete('headcountMax');
    if (newHeadcount) {
      params.set('headcountMin', String(newHeadcount[0]));
      params.set('headcountMax', String(newHeadcount[1]));
    }

    router.push(`/recruitments?${params.toString()}`);
  };

  const handleStacksApply = (newStacks: string[]) => {
    updateParams({ stack: newStacks });
  };

  const clearAll = () => {
    const params = new URLSearchParams();
    if (sort) params.set('sort', sort);
    if (searchParams.get('onlyOpen')) params.set('onlyOpen', 'true');
    router.push(`/recruitments?${params.toString()}`);
  };

  return (
    <div className="no-scrollbar flex flex-nowrap items-center gap-2 overflow-x-auto pb-0.5 md:flex-wrap">
      <SortPopover
        value={sort}
        onChange={(value) => updateParams({ sort: value })}
      />

      <div className="bg-border mx-1 h-5 w-px shrink-0" />

      <ConditionFilter
        types={types}
        roles={roles}
        headcountValue={headcountValue}
        onApply={handleConditionApply}
      />

      <TechStackFilter selected={stacks} onApply={handleStacksApply} />

      {hasActiveFilters && (
        <button
          type="button"
          onClick={clearAll}
          className="text-muted-foreground hover:text-foreground flex shrink-0 cursor-pointer items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-medium whitespace-nowrap transition-colors"
        >
          <X className="size-3.5" />
          초기화
        </button>
      )}
    </div>
  );
}
