import { db } from '@/shared/db';
import { showcasesTable, usersTable } from '@/shared/db/schema';
import { desc, eq } from 'drizzle-orm';

export async function getShowcases(limit = 6) {
  return db
    .select({
      id: showcasesTable.id,
      title: showcasesTable.title,
      summary: showcasesTable.summary,
      thumbnailUrl: showcasesTable.thumbnailUrl,
      serviceUrl: showcasesTable.serviceUrl,
      likeCount: showcasesTable.likeCount,
      createdAt: showcasesTable.createdAt,
      author: {
        nickname: usersTable.nickname,
        avatarUrl: usersTable.avatarUrl,
      },
    })
    .from(showcasesTable)
    .innerJoin(usersTable, eq(showcasesTable.authorId, usersTable.id))
    .orderBy(desc(showcasesTable.likeCount))
    .limit(limit);
}

export type Showcase = Awaited<ReturnType<typeof getShowcases>>[number];
