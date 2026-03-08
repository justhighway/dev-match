import { db } from '@/shared/db';
import { recruitmentsTable, usersTable } from '@/shared/db/schema';
import { desc, eq } from 'drizzle-orm';

export async function getFeaturedRecruitments(limit = 6) {
  return db
    .select({
      id: recruitmentsTable.id,
      title: recruitmentsTable.title,
      summary: recruitmentsTable.summary,
      techStacks: recruitmentsTable.techStacks,
      isClosed: recruitmentsTable.isClosed,
      createdAt: recruitmentsTable.createdAt,
      leader: {
        nickname: usersTable.nickname,
        avatarUrl: usersTable.avatarUrl,
      },
    })
    .from(recruitmentsTable)
    .innerJoin(usersTable, eq(recruitmentsTable.leaderId, usersTable.id))
    .orderBy(desc(recruitmentsTable.createdAt))
    .limit(limit);
}

export type FeaturedRecruitment = Awaited<
  ReturnType<typeof getFeaturedRecruitments>
>[number];
