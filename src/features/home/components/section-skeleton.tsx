import { cn } from '@/shared/lib/utils';

interface SectionSkeletonProps {
  cardHeight?: string;
}

export default function SectionSkeleton({
  cardHeight = 'h-48',
}: SectionSkeletonProps) {
  return (
    <div className="w-full animate-pulse">
      {/* 헤더 */}
      <div className="mb-5 flex items-center justify-between px-1">
        <div className="bg-muted h-7 w-48 rounded-lg" />
        <div className="bg-muted h-4 w-16 rounded" />
      </div>
      {/* 카드 더미 */}
      <div className="flex gap-4 overflow-hidden">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className={cn(
              'bg-muted w-[280px] shrink-0 rounded-2xl md:w-[320px]',
              cardHeight,
            )}
          />
        ))}
      </div>
    </div>
  );
}
