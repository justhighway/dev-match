'use client';

import { cn } from '@/shared/lib/utils';
import { useRouter, useSearchParams } from 'next/navigation';

export default function OnlyOpenToggle() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const onlyOpen = searchParams.get('onlyOpen') === 'true';

  const toggle = () => {
    const params = new URLSearchParams(searchParams.toString());
    if (onlyOpen) {
      params.delete('onlyOpen');
    } else {
      params.set('onlyOpen', 'true');
    }
    router.push(`/recruitments?${params.toString()}`);
  };

  return (
    <label
      className={cn(
        'flex cursor-pointer items-center gap-2 text-sm font-medium transition-colors',
        onlyOpen ? 'text-primary' : 'text-foreground',
      )}
    >
      <span
        className={cn(
          'flex size-4 shrink-0 items-center justify-center rounded-full border-2 transition-colors',
          onlyOpen ? 'border-primary' : 'border-muted-foreground',
        )}
      >
        {onlyOpen && <span className="bg-primary size-2 rounded-full" />}
      </span>
      <input
        type="checkbox"
        checked={onlyOpen}
        onChange={toggle}
        className="sr-only"
      />
      모집 중인 공고만 보기
    </label>
  );
}
