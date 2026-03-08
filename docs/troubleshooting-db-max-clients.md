# Troubleshooting: DB 커넥션 누수 — MaxClientsInSessionMode

> **발생일**: 2026-02-27
> **환경**: Next.js 16 (App Router) + Drizzle ORM + postgres-js + Supabase (Direct connection)
> **심각도**: High — 홈 페이지 전체 섹션 렌더링 불가

---

## 1. 문제 상황

홈 페이지에 새로운 섹션 컴포넌트들(RecruitmentSection, ShowcaseSection, IdeaSection)을 추가하고
UI를 수차례 수정하자 **시간차를 두고** 다음 에러가 발생했다.

```
⨯ Error: Failed query:
  select "showcases"."id", ... from "showcases" inner join "users" ...
  order by "showcases"."like_count" desc limit $1
  at async ShowcaseSection (src\features\home\components\showcase-section.tsx:7:21)

[cause]: Error [PostgresError]: MaxClientsInSessionMode: max clients reached
  severity: 'FATAL',
  code: 'XX000'
```

**증상의 특이점**

- 서버를 처음 시작할 때는 정상 동작
- `.env.local` 변경 없음, Supabase 프로젝트 정상 (pause 아님)
- UI 파일을 수정·저장할수록 **점진적으로** 악화되다 특정 시점에 터짐
- `pnpm dev` 재시작 시 일시 복구되지만, 개발을 이어가면 재발

---

## 2. Supabase 연결 방식 이해

원인을 파악하기 전에 Supabase가 제공하는 세 가지 연결 방식을 이해해야 한다.

### 커넥션이란

Next.js 서버가 PostgreSQL에 쿼리를 날리려면 먼저 **TCP 소켓 연결(커넥션)** 을 맺어야 한다.
커넥션을 맺는 것 자체가 비용이 크기 때문에(TCP handshake + 인증 + 세션 초기화),
미리 여러 개를 맺어두고 재사용하는 **커넥션 풀(Connection Pool)** 을 사용한다.

PostgreSQL은 커넥션 하나당 **별도 프로세스**를 띄운다. 그래서 커넥션 수에 상한이 있고,
Supabase 무료 플랜은 **최대 60개**로 제한된다.

### 세 가지 연결 방식

```
[Direct connection]
Next.js ──────────────────────────────────────► PostgreSQL
        중간 프록시 없음, 직접 TCP 소켓

[Session mode pooler]
Next.js ──► PgBouncer ──► PostgreSQL
            클라이언트 연결 시 커넥션 고정 할당, disconnect 전까지 반납 안 함

[Transaction mode pooler]
Next.js ──► PgBouncer ──► PostgreSQL
            트랜잭션이 끝나는 순간 커넥션을 pool에 반납, 다른 클라이언트가 재사용
```

|                                         | Direct         | Session Pooler         | Transaction Pooler |
| --------------------------------------- | -------------- | ---------------------- | ------------------ |
| 포트                                    | 5432           | 5432                   | 6543               |
| IPv4 호환                               | ❌ (IPv6 전용) | ✅                     | ✅                 |
| 커넥션 공유                             | 불가           | 불가 (클라이언트 고정) | 트랜잭션 단위 공유 |
| HMR 안전성                              | ❌             | ❌                     | ✅                 |
| 세션 기능 (SET, prepared statements 등) | 전부 가능      | 전부 가능              | **일부 불가**      |
| 적합한 환경                             | 장기 실행 서버 | 장기 실행 서버         | 서버리스           |

---

## 3. 원인 분석

### 3-1. 초기 설정

`.env.local`에는 **Direct connection** URL이 설정되어 있었다.

```
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"
```

그리고 `db/index.ts`는 모듈 최상위에서 클라이언트를 생성했다.

```ts
// src/shared/db/index.ts — 수정 전
const client = postgres(connectionString); // ← 모듈 최상위 실행
export const db = drizzle(client, { schema });
```

### 3-2. HMR이 커넥션을 누수시키는 메커니즘

Next.js dev 서버는 파일이 변경되면 영향받는 모듈을 **재평가(re-evaluate)** 한다.
`db/index.ts`가 직접 수정되지 않아도, 이를 import하는 파일이 변경되면
모듈 그래프를 따라 재평가가 전파된다.

모듈이 재평가될 때마다 `postgres(connectionString)`이 다시 실행되어
**새로운 커넥션 풀 인스턴스**가 생성된다.
이전 인스턴스의 참조는 끊기지만, `postgres-js`가 내부적으로 유지하는 TCP 소켓은
**Node.js GC가 수거하기 전까지 Supabase 측에서 살아있는 커넥션으로 집계**된다.

```
서버 시작      → client 인스턴스 1개 → 커넥션 1개 점유
HMR 1회 발생  → client 인스턴스 2개 → 커넥션 2개 점유 (이전 소켓 미해제)
HMR 2회 발생  → client 인스턴스 3개 → 커넥션 3개 점유
HMR N회 발생  → 커넥션 N+1개 → Supabase 한도 초과 → FATAL
```

UI를 수정할수록 HMR이 반복되고 커넥션이 누적 점유된다.
**시간차를 두고 발생하는 이유**, **재시작하면 일시 복구되는 이유**가 바로 이 때문이다.

### 3-3. production에서는 발생하지 않는 이유

`next build` + `next start` 또는 서버리스 환경에서는 HMR이 없다.
모듈은 서버 시작 시 단 한 번만 평가되므로 `postgres()` 호출도 한 번이다.

---

## 4. 해결 과정 및 의사결정

### 1차 시도: Transaction mode pooler로 전환 — 기각

처음에는 `.env.local`의 포트를 6543(Transaction mode)으로 바꿨다.
IPv4 호환 문제가 해결되고, 트랜잭션 단위 커넥션 반납으로 누수도 완화됐다.

**그러나 냉정하게 평가하면 잘못된 선택이었다.**

Transaction mode의 제약이 생각보다 크다.

- `postgres-js`는 기본적으로 **prepared statements**를 사용하는데,
  Transaction mode PgBouncer는 이를 지원하지 않는다.
  → `prepare: false` 옵션을 별도로 설정하지 않으면 프로덕션에서 잠재적 에러가 발생한다.
- 나중에 Supabase RLS(Row Level Security) 또는 `SET LOCAL`로
  auth context를 주입하는 패턴을 쓸 경우 Transaction mode에서 동작하지 않는다.
- Drizzle `db.transaction()` 내부에서 세션 상태에 의존하는 경우 예상치 못한 동작이 생길 수 있다.

즉, Transaction mode는 **서버리스 프로덕션 환경에서 커넥션 폭발을 막기 위해 감수하는 트레이드오프**이지,
개발 환경에서 굳이 이 제약을 감수할 이유가 없다.
문제의 실제 원인(HMR 커넥션 누수)을 해결한 게 아니라 우회한 것이기도 하다.

### 2차 시도 (최종): global singleton + Direct connection 유지

문제의 실제 원인은 **HMR마다 새 클라이언트 인스턴스가 생성되는 것**이다.
이를 직접 막는 것이 올바른 해법이다.

Node.js의 `global` 객체는 **모듈 재평가와 무관하게 프로세스 생애 전체에서 유지**된다.
HMR로 `db/index.ts`가 재평가되어도 `global`에 저장된 클라이언트 참조는 살아있으므로,
기존 클라이언트가 있으면 재사용하고 없을 때만 새로 생성한다.

```ts
// src/shared/db/index.ts — 최종
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error('DATABASE_URL is missing');

// dev 환경에서 HMR로 인한 커넥션 누수 방지
const globalForDb = global as typeof global & { pgClient?: postgres.Sql };
const client = globalForDb.pgClient ?? postgres(connectionString);
if (process.env.NODE_ENV !== 'production') globalForDb.pgClient = client;

export const db = drizzle(client, { schema });
```

| 코드                                    | 의도                                                             |
| --------------------------------------- | ---------------------------------------------------------------- |
| `globalForDb.pgClient ?? postgres(...)` | 기존 클라이언트가 있으면 재사용, 없을 때만 신규 생성             |
| `NODE_ENV !== 'production'` 조건        | production은 HMR이 없으므로 global 저장 불필요, global 오염 방지 |

이 패턴은 Next.js 커뮤니티에서 **"global singleton" 패턴**으로 널리 알려져 있으며,
Prisma 공식 문서에서도 동일한 이유로 동일한 해법을 권장한다.

---

## 5. 최종 설정

```bash
# .env.local (개발) — Direct connection 유지
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"
```

```ts
// src/shared/db/index.ts
const globalForDb = global as typeof global & { pgClient?: postgres.Sql };
const client = globalForDb.pgClient ?? postgres(connectionString);
if (process.env.NODE_ENV !== 'production') globalForDb.pgClient = client;
export const db = drizzle(client, { schema });
```

---

## 6. 결과

| 항목                | 변경 전                    | 변경 후                                   |
| ------------------- | -------------------------- | ----------------------------------------- |
| HMR 커넥션 누수     | HMR마다 신규 인스턴스 생성 | global singleton으로 단일 인스턴스 재사용 |
| 커넥션 방식         | Direct (변경 없음)         | Direct (변경 없음)                        |
| prepared statements | 정상                       | 정상 (제약 없음)                          |
| 세션 기능           | 정상                       | 정상 (제약 없음)                          |

- `MaxClientsInSessionMode` 에러 재발 없음
- UI를 반복 수정해도 커넥션 누수 없음
- Direct connection 유지로 기능 제약 없음

---

## 7. 프로덕션 배포 시 추가 고려사항

배포 환경이 확정되면 아래를 결정해야 한다.

**Vercel 등 서버리스 환경으로 배포 시**

서버리스는 요청마다 함수 인스턴스가 새로 뜨고 각각 커넥션을 맺으려 하므로,
트래픽이 몰리면 60개 한도를 초과할 위험이 있다.
이 경우 프로덕션 환경변수에만 Transaction mode pooler URL을 적용한다.

```bash
# 프로덕션 환경변수 (Vercel 등)
DATABASE_URL="postgresql://postgres.[REF]:[PASSWORD]@aws-1-[REGION].pooler.supabase.com:6543/postgres"
```

단, 이때 반드시 `prepare: false`를 함께 설정해야 한다.

```ts
// Transaction mode 사용 시 필수
const client = postgres(connectionString, { prepare: false });
```

**장기 실행 서버(VM, Docker)로 배포 시**

개발과 동일하게 Direct connection을 사용하면 된다.
global singleton은 production에서 동작하지 않으므로, 커넥션 풀 `max` 값을 적절히 설정한다.

```ts
const client = postgres(connectionString, { max: 10 }); // 서버 스펙에 맞게 조정
```
