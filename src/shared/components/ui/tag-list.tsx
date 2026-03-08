'use client';

import { useEffect, useRef, useState } from 'react';

interface TagListProps {
  tags: string[];
}

// 측정 함수: 컨테이너 내 [data-tag] 엘리먼트 기준으로 2줄 내 표시 가능한 개수 반환
function countVisibleTags(container: HTMLElement, totalCount: number): number {
  const tagEls = Array.from(
    container.querySelectorAll<HTMLElement>('[data-tag]'),
  );
  if (tagEls.length === 0) return 0;

  const firstTop = tagEls[0].offsetTop;
  const rowHeight = tagEls[0].offsetHeight;
  const twoRowBottom = firstTop + rowHeight * 2 + 4; // gap 여유 4px

  for (let i = 0; i < tagEls.length; i++) {
    if (tagEls[i].offsetTop + tagEls[i].offsetHeight > twoRowBottom) {
      // +n 배지 공간 확보를 위해 하나 더 줄임
      return Math.max(0, i - 1);
    }
  }
  return totalCount;
}

export default function TagList({ tags }: TagListProps) {
  // 초기값을 tags.length로 설정 → 첫 렌더는 전체 표시, 측정 후 조정
  const [visibleCount, setVisibleCount] = useState(tags.length);
  const measureRef = useRef<HTMLDivElement>(null);
  // ResizeObserver가 측정 결과 변경으로 인한 리렌더를 재트리거하지 않도록 ref로 관리
  const visibleCountRef = useRef(tags.length);

  useEffect(() => {
    const container = measureRef.current;
    if (!container) return;

    const measure = () => {
      const next = countVisibleTags(container, tags.length);
      if (next !== visibleCountRef.current) {
        visibleCountRef.current = next;
        setVisibleCount(next);
      }
    };

    // 최초 측정
    measure();

    // 컨테이너 너비 변경(반응형) 시 재측정 — 측정 레이어만 observe
    const ro = new ResizeObserver(measure);
    ro.observe(container);
    return () => ro.disconnect();
  }, [tags]);

  const overflow = tags.length - visibleCount;

  return (
    <div className="relative">
      {/*
        측정 레이어: absolute로 레이아웃에서 분리, visibility:hidden으로 시각적으로 숨김.
        항상 전체 태그를 렌더하여 실제 wrapping 위치를 측정.
        이 레이어의 크기 변경만 ResizeObserver가 감지함.
      */}
      <div
        ref={measureRef}
        aria-hidden
        className="pointer-events-none invisible absolute inset-x-0 top-0 flex flex-wrap gap-1.5"
      >
        {tags.map((tag) => (
          <span
            key={tag}
            data-tag=""
            className="rounded-md px-2 py-0.5 text-sm font-medium"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* 표시 레이어: visibleCount 기준으로만 렌더, 레이아웃 공간 차지 */}
      <div className="flex flex-wrap gap-1.5">
        {tags.slice(0, visibleCount).map((tag) => (
          <span
            key={tag}
            className="bg-secondary rounded-md px-2 py-0.5 text-sm font-medium text-neutral-600"
          >
            {tag}
          </span>
        ))}
        {overflow > 0 && (
          <span className="text-muted-foreground py-0.5 text-sm">
            +{overflow}
          </span>
        )}
      </div>
    </div>
  );
}
