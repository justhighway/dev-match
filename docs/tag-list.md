# TagList 컴포넌트 — 2줄 초과 태그 +n 처리 트러블슈팅

## 문제 정의

`PostCard`의 기술스택 배지가 반응형 환경에서 카드 너비에 따라 줄 수가 달라지는 문제.
기존에는 고정 슬라이스(`tags.slice(0, 4)`)로 처리했는데, 태그 텍스트 길이가 제각각이라
4개라도 3줄이 될 수도 있고, 8개도 1줄에 들어올 수 있어서 레이아웃이 일정하지 않았음.

**요구사항**: 2줄까지만 표시하고, 초과분은 `+n`으로 일괄 처리.

---

## 시도 1 — 실패: 측정 후 state 변경 → 무한 루프

```tsx
const [visibleCount, setVisibleCount] = useState(tags.length);
const [measured, setMeasured] = useState(false);

useEffect(() => {
  const measure = () => { ... setVisibleCount(count); setMeasured(true); };

  setVisibleCount(tags.length); // 전체 렌더 후 측정하려고 초기화
  setMeasured(false);           // 깜빡임 방지용 opacity-0
  requestAnimationFrame(() => requestAnimationFrame(measure));

  const ro = new ResizeObserver(() => {
    setVisibleCount(tags.length); // ← 문제: ResizeObserver 콜백에서 state 변경
    setMeasured(false);
    requestAnimationFrame(() => requestAnimationFrame(measure));
  });
  ro.observe(container);
}, [tags]);
```

### 왜 실패했나

1. `ResizeObserver`가 컨테이너를 관찰 중
2. `setVisibleCount(tags.length)` 호출 → 리렌더 → 태그 개수 변경 → 컨테이너 크기 변경
3. 크기 변경을 `ResizeObserver`가 감지 → 콜백 재실행 → 다시 2번으로
4. **무한 루프** → 미친듯한 깜빡임 + 레이아웃 덜컹

추가로 `measured: false` 상태에서 `opacity-0` 처리를 했는데,
이게 매 측정 사이클마다 토글되어 깜빡임이 더 심해졌음.

---

## 시도 2 — 실패: invisible 표시 레이어

```tsx
const [visibleCount, setVisibleCount] = useState<number | null>(null);

// 측정 레이어: absolute + invisible (레이아웃 분리)
// 표시 레이어: visibleCount === null이면 invisible
<div className={cn('flex flex-wrap gap-1.5', visibleCount === null && 'invisible')}>
```

### 왜 실패했나

`invisible`은 `visibility: hidden`으로 **높이가 0**이 됨.
카드 내부에서 태그 영역이 `null` → 0 높이 → 측정 완료 후 실제 높이로 바뀌며
**카드 전체 높이가 덜컹거림**.

또한 표시 레이어도 `ResizeObserver`가 관찰하는 같은 컨테이너에 있어서
높이 변경 → 재측정 루프 재발.

---

## 최종 해결 — 측정 레이어와 표시 레이어 완전 분리

### 핵심 철학

> **측정은 레이아웃에 영향을 주지 않아야 한다.**
> **state 변경은 실제로 값이 바뀐 경우에만 발생해야 한다.**

### 구조

```
<div class="relative">
  <!-- 측정 레이어: absolute + invisible, 레이아웃 분리 -->
  <!-- 항상 전체 태그 렌더, ResizeObserver가 이것만 관찰 -->
  <div ref={measureRef} class="pointer-events-none invisible absolute ...">
    {tags.map(tag => <span data-tag="" ...>)}
  </div>

  <!-- 표시 레이어: visibleCount 기준으로만 렌더 -->
  <!-- 초기값이 tags.length라 첫 렌더부터 공간을 차지 → 덜컹 없음 -->
  <div class="flex flex-wrap gap-1.5">
    {tags.slice(0, visibleCount).map(...)}
    {overflow > 0 && <span>+{overflow}</span>}
  </div>
</div>
```

### 루프 차단 메커니즘

```tsx
const visibleCountRef = useRef(tags.length);

const measure = () => {
  const next = countVisibleTags(container, tags.length);
  // 값이 바뀐 경우에만 setState → 리렌더 발생
  // 같은 값이면 setState 호출 안 함 → ResizeObserver 재발화 없음
  if (next !== visibleCountRef.current) {
    visibleCountRef.current = next;
    setVisibleCount(next);
  }
};

const ro = new ResizeObserver(measure);
ro.observe(container); // 측정 레이어만 관찰
```

- `ResizeObserver`는 `measureRef`(absolute, 레이아웃 분리)만 관찰
- 표시 레이어가 변해도 측정 레이어 크기는 불변 → 재발화 없음
- `visibleCountRef`로 불필요한 `setState` 차단 → 리렌더 최소화

### 초기 상태에서 덜컹 없는 이유

`useState(tags.length)`로 초기화하여 첫 렌더에서 전체 태그를 표시.
측정 후 `visibleCount`가 줄어들 수 있지만, 이는 **한 번의 조정**이고
`opacity` 토글 없이 태그 개수만 바뀌므로 시각적으로 자연스러움.

---

## 교훈

| 안티패턴                                                              | 이유                                   |
| --------------------------------------------------------------------- | -------------------------------------- |
| ResizeObserver 콜백에서 관찰 중인 엘리먼트 크기를 변경하는 state 변경 | 무한 루프                              |
| 측정을 위해 `invisible` / `opacity-0` 토글                            | 깜빡임, 레이아웃 이동                  |
| 측정 레이어와 표시 레이어를 같은 DOM에 두기                           | 측정이 표시에 영향, 표시가 측정에 영향 |

| 올바른 패턴                                       | 이유                             |
| ------------------------------------------------- | -------------------------------- |
| 측정 레이어를 `absolute`로 레이아웃에서 완전 분리 | 측정이 레이아웃에 영향 없음      |
| `ref`로 이전 값 추적, 변경 시에만 `setState`      | 불필요한 리렌더 방지             |
| 초기 state를 "안전한 전체 표시" 값으로 설정       | 첫 렌더부터 공간 차지, 덜컹 없음 |
