'use client';

import { SlidersHorizontal } from 'lucide-react';
import { useState } from 'react';

import { Slider } from '@/shared/components/ui/slider';
import { cn } from '@/shared/lib/utils';

import {
  RECRUITMENT_TYPE_OPTIONS,
  ROLE_OPTIONS,
} from '../constants/filter-options';
import {
  RECRUITMENT_HEADCOUNT_MAX,
  RECRUITMENT_HEADCOUNT_MIN,
} from '../constants/recruitment';
import FilterPanel, { FilterFooter } from './filter-panel';

const MIN = RECRUITMENT_HEADCOUNT_MIN;
const MAX = RECRUITMENT_HEADCOUNT_MAX;

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

const getActiveCount = (
  types: string[],
  roles: string[],
  headcountValue: [number, number] | null,
): number => {
  let count = 0;
  if (types.length > 0) count++;
  if (roles.length > 0) count++;
  if (
    headcountValue &&
    !(headcountValue[0] === MIN && headcountValue[1] === MAX)
  )
    count++;
  return count;
};

function ChipButton({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'cursor-pointer rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors',
        selected
          ? 'bg-primary/10 text-primary border-transparent'
          : 'border-border bg-background text-foreground hover:bg-secondary',
      )}
    >
      {label}
    </button>
  );
}

function ConditionContent({
  localTypes,
  localRoles,
  localHeadcount,
  onTypeToggle,
  onRoleToggle,
  onHeadcountChange,
}: {
  localTypes: string[];
  localRoles: string[];
  localHeadcount: [number, number];
  onTypeToggle: (value: string) => void;
  onRoleToggle: (value: string) => void;
  onHeadcountChange: (vals: number[]) => void;
}) {
  const rangeLabel =
    localHeadcount[1] === MAX
      ? `${localHeadcount[0]}~${localHeadcount[1]}명 이상`
      : `${localHeadcount[0]}~${localHeadcount[1]}명`;

  return (
    <div className="flex flex-col divide-y">
      <div className="px-6 py-8">
        <p className="text-foreground mb-4 text-sm font-semibold">모집종류</p>
        <div className="flex flex-wrap gap-2">
          {RECRUITMENT_TYPE_OPTIONS.map(({ label, value }) => (
            <ChipButton
              key={value}
              label={label}
              selected={localTypes.includes(value)}
              onClick={() => onTypeToggle(value)}
            />
          ))}
        </div>
      </div>

      <div className="px-6 py-8">
        <p className="text-foreground mb-4 text-sm font-semibold">모집대상</p>
        <div className="flex flex-wrap gap-2">
          {ROLE_OPTIONS.map(({ label, value }) => (
            <ChipButton
              key={value}
              label={label}
              selected={localRoles.includes(value)}
              onClick={() => onRoleToggle(value)}
            />
          ))}
        </div>
      </div>

      <div className="px-6 py-8">
        <div className="mb-4 flex items-center justify-between">
          <p className="text-foreground text-sm font-semibold">모집인원</p>
          <span className="text-muted-foreground text-sm">{rangeLabel}</span>
        </div>
        <Slider
          min={MIN}
          max={MAX}
          step={1}
          value={localHeadcount}
          onValueChange={onHeadcountChange}
          className="mb-4"
        />
        <div className="text-muted-foreground flex justify-between text-sm">
          <span>{MIN}명</span>
          <span>{MAX}명 이상</span>
        </div>
      </div>
    </div>
  );
}

export default function ConditionFilter({
  types,
  roles,
  headcountValue,
  onApply,
}: ConditionFilterProps) {
  const [open, setOpen] = useState(false);
  const [localTypes, setLocalTypes] = useState<string[]>(types);
  const [localRoles, setLocalRoles] = useState<string[]>(roles);
  const [localHeadcount, setLocalHeadcount] = useState<[number, number]>(
    headcountValue ?? [MIN, MAX],
  );

  const activeCount = getActiveCount(types, roles, headcountValue);
  const isActive = activeCount > 0;
  const localActiveCount = getActiveCount(
    localTypes,
    localRoles,
    localHeadcount[0] === MIN && localHeadcount[1] === MAX
      ? null
      : localHeadcount,
  );

  const handleOpen = (nextOpen: boolean) => {
    if (nextOpen) {
      setLocalTypes(types);
      setLocalRoles(roles);
      setLocalHeadcount(headcountValue ?? [MIN, MAX]);
    }
    setOpen(nextOpen);
  };

  const toggleType = (value: string) =>
    setLocalTypes((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value],
    );

  const toggleRole = (value: string) =>
    setLocalRoles((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value],
    );

  const handleReset = () => {
    setLocalTypes([]);
    setLocalRoles([]);
    setLocalHeadcount([MIN, MAX]);
  };

  const handleApply = () => {
    const headcount =
      localHeadcount[0] === MIN && localHeadcount[1] === MAX
        ? null
        : localHeadcount;
    onApply({
      types: localTypes,
      roles: localRoles,
      headcountValue: headcount,
    });
    setOpen(false);
  };

  const trigger = (
    <button
      onClick={() => handleOpen(true)}
      className={cn(
        'flex shrink-0 cursor-pointer items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm font-medium whitespace-nowrap transition-colors',
        isActive
          ? 'bg-primary/10 text-primary border-transparent'
          : 'border-border bg-background text-foreground hover:bg-secondary',
      )}
    >
      <SlidersHorizontal className="size-3.5 shrink-0 opacity-60" />
      <span>모집조건{isActive ? ` (${activeCount})` : ''}</span>
    </button>
  );

  return (
    <FilterPanel
      title="모집조건"
      open={open}
      onOpenChange={handleOpen}
      trigger={trigger}
      contentClassName="max-h-dialog-content"
      footer={
        <FilterFooter
          onReset={handleReset}
          onApply={handleApply}
          disableReset={localActiveCount === 0}
        />
      }
    >
      <ConditionContent
        localTypes={localTypes}
        localRoles={localRoles}
        localHeadcount={localHeadcount}
        onTypeToggle={toggleType}
        onRoleToggle={toggleRole}
        onHeadcountChange={(vals) => setLocalHeadcount([vals[0], vals[1]])}
      />
    </FilterPanel>
  );
}
