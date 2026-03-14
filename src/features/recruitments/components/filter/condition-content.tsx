'use client';

import {
  RECRUITMENT_HEADCOUNT_MAX,
  RECRUITMENT_HEADCOUNT_MIN,
} from '../../constants/recruitment';
import {
  RECRUITMENT_TYPE_OPTIONS,
  ROLE_OPTIONS,
} from '../../constants/filter-options';

import { Slider } from '@/shared/components/ui/slider';
import { cn } from '@/shared/lib/utils';

const MIN = RECRUITMENT_HEADCOUNT_MIN;
const MAX = RECRUITMENT_HEADCOUNT_MAX;

function ChipButton({
  label,
  isSelected,
  onToggle,
}: {
  label: string;
  isSelected: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={isSelected}
      className={cn(
        'cursor-pointer rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors',
        isSelected
          ? 'bg-primary/10 text-primary border-transparent'
          : 'border-border bg-background text-foreground hover:bg-secondary',
      )}
    >
      {label}
    </button>
  );
}

interface ConditionContentProps {
  selectedTypes: string[];
  selectedRoles: string[];
  headcountRange: [number, number];
  onTypeToggle: (value: string) => void;
  onRoleToggle: (value: string) => void;
  onHeadcountRangeChange: (range: [number, number]) => void;
}

export default function ConditionContent({
  selectedTypes,
  selectedRoles,
  headcountRange,
  onTypeToggle,
  onRoleToggle,
  onHeadcountRangeChange,
}: ConditionContentProps) {
  const rangeLabel =
    headcountRange[1] === MAX
      ? `${headcountRange[0]}명 이상`
      : `${headcountRange[0]}~${headcountRange[1]}명`;

  return (
    <div className="flex flex-col divide-y">
      <div className="px-6 py-8">
        <p className="text-foreground mb-4 text-sm font-semibold">모집종류</p>
        <ul className="flex flex-wrap gap-2">
          {RECRUITMENT_TYPE_OPTIONS.map(({ label, value }) => (
            <li key={value}>
              <ChipButton
                label={label}
                isSelected={selectedTypes.includes(value)}
                onToggle={() => onTypeToggle(value)}
              />
            </li>
          ))}
        </ul>
      </div>

      <div className="px-6 py-8">
        <p className="text-foreground mb-4 text-sm font-semibold">모집대상</p>
        <ul className="flex flex-wrap gap-2">
          {ROLE_OPTIONS.map(({ label, value }) => (
            <li key={value}>
              <ChipButton
                label={label}
                isSelected={selectedRoles.includes(value)}
                onToggle={() => onRoleToggle(value)}
              />
            </li>
          ))}
        </ul>
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
          value={headcountRange}
          onValueChange={(range) => {
            if (range.length === 2) {
              onHeadcountRangeChange([range[0], range[1]]);
            }
          }}
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
