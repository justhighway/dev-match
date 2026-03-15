'use client';

import { SlidersHorizontal } from 'lucide-react';
import { useState } from 'react';

import { cn, toggleInArray } from '@/shared/lib/utils';

import {
  RECRUITMENT_HEADCOUNT_MAX,
  RECRUITMENT_HEADCOUNT_MIN,
} from '../../constants/recruitment';
import FilterPanel, { FilterFooter } from './filter-panel';
import ConditionContent from './condition-content';

const MIN = RECRUITMENT_HEADCOUNT_MIN;
const MAX = RECRUITMENT_HEADCOUNT_MAX;

const normalizeHeadcountRange = (
  range: [number, number],
): [number, number] | null =>
  range[0] === MIN && range[1] === MAX ? null : range;

interface ConditionFilterProps {
  types: string[];
  roles: string[];
  headcountValue: [number, number] | null;
  onApply: (params: {
    types: string[];
    roles: string[];
    headcountValue: [number, number] | null;
  }) => void;
}

function countActiveConditions(
  types: string[],
  roles: string[],
  headcountValue: [number, number] | null,
): number {
  let count = 0;
  if (types.length > 0) count++;
  if (roles.length > 0) count++;
  if (
    headcountValue &&
    !(headcountValue[0] === MIN && headcountValue[1] === MAX)
  )
    count++;
  return count;
}

export default function ConditionFilter({
  types,
  roles,
  headcountValue,
  onApply,
}: ConditionFilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [draftTypes, setDraftTypes] = useState<string[]>(types);
  const [draftRoles, setDraftRoles] = useState<string[]>(roles);
  const [draftHeadcountRange, setDraftHeadcountRange] = useState<
    [number, number]
  >(headcountValue ?? [MIN, MAX]);

  const activeConditionCount = countActiveConditions(
    types,
    roles,
    headcountValue,
  );
  const isActive = activeConditionCount > 0;
  const draftActiveCount = countActiveConditions(
    draftTypes,
    draftRoles,
    normalizeHeadcountRange(draftHeadcountRange),
  );

  const handleOpenChange = (nextOpen: boolean) => {
    if (nextOpen) {
      setDraftTypes(types);
      setDraftRoles(roles);
      setDraftHeadcountRange(headcountValue ?? [MIN, MAX]);
    }
    setIsOpen(nextOpen);
  };

  const handleReset = () => {
    setDraftTypes([]);
    setDraftRoles([]);
    setDraftHeadcountRange([MIN, MAX]);
  };

  const handleApply = () => {
    onApply({
      types: draftTypes,
      roles: draftRoles,
      headcountValue: normalizeHeadcountRange(draftHeadcountRange),
    });
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
      <SlidersHorizontal className="size-3.5 shrink-0 opacity-60" aria-hidden />
      <span>모집조건{isActive ? ` (${activeConditionCount})` : ''}</span>
    </button>
  );

  return (
    <FilterPanel
      title="모집조건"
      open={isOpen}
      onOpenChange={handleOpenChange}
      trigger={trigger}
      contentClassName="max-h-dialog-content"
      footer={
        <FilterFooter
          onReset={handleReset}
          onApply={handleApply}
          disableReset={draftActiveCount === 0}
        />
      }
    >
      <ConditionContent
        selectedTypes={draftTypes}
        selectedRoles={draftRoles}
        headcountRange={draftHeadcountRange}
        onTypeToggle={(value) =>
          setDraftTypes((prev) => toggleInArray(prev, value))
        }
        onRoleToggle={(value) =>
          setDraftRoles((prev) => toggleInArray(prev, value))
        }
        onHeadcountRangeChange={(range) =>
          setDraftHeadcountRange([range[0], range[1]])
        }
      />
    </FilterPanel>
  );
}
