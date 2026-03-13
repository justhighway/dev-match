import { db } from '@/shared/db';
import { recruitmentsTable, usersTable } from '@/shared/db/schema';
import { and, arrayOverlaps, desc, eq, gte, lte, sql } from 'drizzle-orm';

import type { SortValue } from '../types';

const SELECTED_FIELDS = {
  id: recruitmentsTable.id,
  numId: recruitmentsTable.numId,
  title: recruitmentsTable.title,
  summary: recruitmentsTable.summary,
  techStacks: recruitmentsTable.techStacks,
  projectType: recruitmentsTable.projectType,
  roles: recruitmentsTable.roles,
  headcount: recruitmentsTable.headcount,
  isClosed: recruitmentsTable.isClosed,
  likeCount: recruitmentsTable.likeCount,
  bookmarkCount: recruitmentsTable.bookmarkCount,
  viewCount: recruitmentsTable.viewCount,
  createdAt: recruitmentsTable.createdAt,
  leader: {
    nickname: usersTable.nickname,
    avatarUrl: usersTable.avatarUrl,
  },
} as const;

export async function getFeaturedRecruitments(limit = 6) {
  return db
    .select(SELECTED_FIELDS)
    .from(recruitmentsTable)
    .innerJoin(usersTable, eq(recruitmentsTable.leaderId, usersTable.id))
    .orderBy(desc(recruitmentsTable.createdAt))
    .limit(limit);
}

export interface RecruitmentsFilter {
  onlyOpen?: boolean;
  // TODO: sort 구현 필요 (현재 createdAt desc 고정)
  sort?: SortValue;
  types?: string[];
  roles?: string[];
  stacks?: string[];
  headcountMin?: number;
  headcountMax?: number;
}

export async function getRecruitments(filter: RecruitmentsFilter = {}) {
  const conditions = [];

  if (filter.onlyOpen) {
    conditions.push(eq(recruitmentsTable.isClosed, 'FALSE'));
  }

  if (filter.types && filter.types.length > 0) {
    conditions.push(
      sql`${recruitmentsTable.projectType} = ANY(ARRAY[${sql.join(
        filter.types.map((t) => sql`${t}`),
        sql`, `,
      )}])`,
    );
  }

  if (filter.roles && filter.roles.length > 0) {
    conditions.push(arrayOverlaps(recruitmentsTable.roles, filter.roles));
  }

  if (filter.stacks && filter.stacks.length > 0) {
    conditions.push(arrayOverlaps(recruitmentsTable.techStacks, filter.stacks));
  }

  if (filter.headcountMin !== undefined) {
    conditions.push(gte(recruitmentsTable.headcount, filter.headcountMin));
  }

  if (filter.headcountMax !== undefined) {
    conditions.push(lte(recruitmentsTable.headcount, filter.headcountMax));
  }

  const query = db
    .select(SELECTED_FIELDS)
    .from(recruitmentsTable)
    .innerJoin(usersTable, eq(recruitmentsTable.leaderId, usersTable.id))
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(desc(recruitmentsTable.createdAt));

  return query;
}

export type Recruitment = Awaited<
  ReturnType<typeof getFeaturedRecruitments | typeof getRecruitments>
>[number];
