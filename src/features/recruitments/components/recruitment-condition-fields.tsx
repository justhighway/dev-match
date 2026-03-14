'use client';

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shared/components/ui/form';
import {
  RECRUITMENT_HEADCOUNT_MAX,
  RECRUITMENT_HEADCOUNT_MIN,
} from '../constants/recruitment';
import {
  RECRUITMENT_TYPE_OPTIONS,
  ROLE_OPTIONS,
} from '../constants/filter-options';
import { cn, toggleInArray } from '@/shared/lib/utils';

import type { CreateRecruitmentInput } from '../schemas/create-recruitment';
import { Input } from '@/shared/components/ui/input';
import TechStackSelector from './tech-stack-selector';
import type { UseFormReturn } from 'react-hook-form';

interface RecruitmentConditionFieldsProps {
  form: UseFormReturn<CreateRecruitmentInput>;
  isPending: boolean;
}

export default function RecruitmentConditionFields({
  form,
  isPending,
}: RecruitmentConditionFieldsProps) {
  return (
    <fieldset className="space-y-8">
      {/* 모집종류 */}
      <FormField
        control={form.control}
        name="projectType"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-base font-semibold">
              모집종류 <span className="text-destructive">*</span>
            </FormLabel>
            <p className="text-muted-foreground -mt-1.5 mb-1 text-sm">
              프로젝트의 종류를 선택해주세요.
            </p>
            <FormControl>
              <ul className="flex flex-wrap gap-2">
                {RECRUITMENT_TYPE_OPTIONS.map(({ label, value }) => (
                  <li key={value}>
                    <button
                      type="button"
                      aria-pressed={field.value === value}
                      disabled={isPending}
                      onClick={() => field.onChange(value)}
                      className={cn(
                        'cursor-pointer rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors',
                        field.value === value
                          ? 'bg-primary/10 text-primary border-transparent'
                          : 'border-border bg-background text-foreground hover:bg-secondary',
                      )}
                    >
                      {label}
                    </button>
                  </li>
                ))}
              </ul>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* 모집대상 */}
      <FormField
        control={form.control}
        name="roles"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-base font-semibold">
              모집대상 <span className="text-destructive">*</span>
            </FormLabel>
            <p className="text-muted-foreground -mt-1.5 mb-1 text-sm">
              모집할 직군을 선택해주세요.
            </p>
            <FormControl>
              <ul className="flex flex-wrap gap-2">
                {ROLE_OPTIONS.map(({ label, value }) => {
                  const isSelected = field.value.includes(value);
                  return (
                    <li key={value}>
                      <button
                        type="button"
                        aria-pressed={isSelected}
                        disabled={isPending}
                        onClick={() =>
                          field.onChange(toggleInArray(field.value, value))
                        }
                        className={cn(
                          'cursor-pointer rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors',
                          isSelected
                            ? 'bg-primary/10 text-primary border-transparent'
                            : 'border-border bg-background text-foreground hover:bg-secondary',
                        )}
                      >
                        {label}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* 모집인원 */}
      <FormField
        control={form.control}
        name="headcount"
        render={({ field }) => (
          <FormItem>
            <FormLabel
              htmlFor="headcount-input"
              className="text-base font-semibold"
            >
              모집인원 <span className="text-destructive">*</span>
            </FormLabel>
            <FormControl>
              <Input
                id="headcount-input"
                type="number"
                disabled={isPending}
                min={RECRUITMENT_HEADCOUNT_MIN}
                max={RECRUITMENT_HEADCOUNT_MAX}
                placeholder={`${RECRUITMENT_HEADCOUNT_MIN}~${RECRUITMENT_HEADCOUNT_MAX}명`}
                className="no-spinner"
                {...field}
                onChange={(e) => {
                  const parsedValue = e.target.valueAsNumber;
                  field.onChange(isNaN(parsedValue) ? undefined : parsedValue);
                }}
                onBlur={(e) => {
                  if (e.target.value === '')
                    field.onChange(RECRUITMENT_HEADCOUNT_MIN);
                  field.onBlur();
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* 기술스택 */}
      <FormField
        control={form.control}
        name="techStacks"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-base font-semibold">
              기술스택 <span className="text-destructive">*</span>
            </FormLabel>
            <FormControl>
              <TechStackSelector
                selectedStacks={field.value}
                onStacksChange={(stacks) => {
                  if (!isPending) field.onChange(stacks);
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </fieldset>
  );
}
