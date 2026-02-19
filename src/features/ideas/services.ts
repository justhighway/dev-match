import { desc, eq } from 'drizzle-orm';
import { ideas, users } from '@/db/schema';

import { db } from '@/db';

export async function getIdeas() {
  const rows = await db
    .select({
      id: ideas.id,
      title: ideas.title,
      content: ideas.content,
      likeCount: ideas.likeCount,
      createdAt: ideas.createdAt,
      author: {
        nickname: users.nickname,
        avatarUrl: users.avatarUrl,
      },
    })
    .from(ideas)
    .innerJoin(users, eq(ideas.authorId, users.id))
    .orderBy(desc(ideas.createdAt));

  return rows;
}

export type CreateIdeaDto = {
  title: string;
  content: string;
  authorId: string;
};

export async function createIdea(data: CreateIdeaDto) {
  const [newIdea] = await db
    .insert(ideas)
    .values({
      title: data.title,
      content: data.content,
      authorId: data.authorId,
    })
    .returning();

  return newIdea;
}
