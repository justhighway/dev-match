'use client';

import { ArrowRightCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import Link from 'next/link';
import { cn } from '@/shared/lib/utils';

interface CarouselSectionProps {
  title: string;
  href: string;
  children: React.ReactNode;
}

// 렌더와 무관한 정적 값 — 모듈 레벨 상수로 선언
const ARROW_BUTTON_CLASS = cn(
  'bg-background border-border hover:bg-muted',
  'flex size-8 items-center justify-center rounded-full border shadow-sm transition-all',
  'disabled:cursor-not-allowed disabled:opacity-40 disabled:text-muted-foreground',
);

export default function CarouselSection({
  title,
  href,
  children,
}: CarouselSectionProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const updateScrollState = () => {
      setCanScrollLeft(el.scrollLeft > 8);
      setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 8);
    };

    updateScrollState();
    el.addEventListener('scroll', updateScrollState, { passive: true });
    const ro = new ResizeObserver(updateScrollState);
    ro.observe(el);

    return () => {
      el.removeEventListener('scroll', updateScrollState);
      ro.disconnect();
    };
  }, []);

  const scroll = (dir: 'left' | 'right') => {
    const el = scrollRef.current;
    if (!el) return;
    const cardWidth = el.querySelector(':first-child')?.clientWidth ?? 300;
    el.scrollBy({
      left: dir === 'left' ? -cardWidth : cardWidth,
      behavior: 'smooth',
    });
  };

  return (
    <section className="w-full">
      {/* 헤더 */}
      <div className="mb-5 flex items-center justify-between px-1">
        <Link href={href} className="flex items-center gap-3">
          <h2 className="text-xl font-bold tracking-tight md:text-2xl">
            {title}
          </h2>
          <ArrowRightCircle className="text-neutral-700" />
        </Link>
        <div className="flex items-center gap-2">
          {/* 화살표 버튼 (md 이상에서만) */}
          <div className="hidden items-center gap-1 md:flex">
            <button
              onClick={() => scroll('left')}
              disabled={!canScrollLeft}
              aria-label="이전"
              className={ARROW_BUTTON_CLASS}
            >
              <ChevronLeft className="size-4" />
            </button>
            <button
              onClick={() => scroll('right')}
              disabled={!canScrollRight}
              aria-label="다음"
              className={ARROW_BUTTON_CLASS}
            >
              <ChevronRight className="size-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 스크롤 영역 */}
      <div
        ref={scrollRef}
        className="no-scrollbar flex gap-4 overflow-x-auto scroll-smooth pb-2"
        style={{ scrollSnapType: 'x mandatory' }}
      >
        {children}
      </div>
    </section>
  );
}
