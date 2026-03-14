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
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;

    const updateScrollButtonState = () => {
      setCanScrollLeft(scrollContainer.scrollLeft > 8);
      setCanScrollRight(
        scrollContainer.scrollLeft + scrollContainer.clientWidth <
          scrollContainer.scrollWidth - 8,
      );
    };

    updateScrollButtonState();
    scrollContainer.addEventListener('scroll', updateScrollButtonState, {
      passive: true,
    });
    const resizeObserver = new ResizeObserver(updateScrollButtonState);
    resizeObserver.observe(scrollContainer);

    return () => {
      scrollContainer.removeEventListener('scroll', updateScrollButtonState);
      resizeObserver.disconnect();
    };
  }, []);

  const scrollCarousel = (direction: 'left' | 'right') => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;
    const cardWidth = scrollContainer.firstElementChild?.clientWidth ?? 300;
    scrollContainer.scrollBy({
      left: direction === 'left' ? -cardWidth : cardWidth,
      behavior: 'smooth',
    });
  };

  return (
    <section className="w-full">
      <div className="mb-5 flex items-center justify-between px-1">
        <Link href={href} className="flex items-center gap-3">
          <h2 className="text-xl font-bold tracking-tight md:text-2xl">
            {title}
          </h2>
          <ArrowRightCircle className="text-neutral-700" aria-hidden />
        </Link>
        <div className="hidden items-center gap-1 md:flex">
          <button
            type="button"
            onClick={() => scrollCarousel('left')}
            disabled={!canScrollLeft}
            aria-label="이전"
            className={ARROW_BUTTON_CLASS}
          >
            <ChevronLeft className="size-4" aria-hidden />
          </button>
          <button
            type="button"
            onClick={() => scrollCarousel('right')}
            disabled={!canScrollRight}
            aria-label="다음"
            className={ARROW_BUTTON_CLASS}
          >
            <ChevronRight className="size-4" aria-hidden />
          </button>
        </div>
      </div>

      <div
        ref={scrollContainerRef}
        className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-2"
      >
        {children}
      </div>
    </section>
  );
}
