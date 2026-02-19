import { ideasTable, usersTable } from '@/db/schema';

import { db } from '@/db';
import { eq } from 'drizzle-orm';

export async function getIdea(id: string) {
  const rows = await db
    .select({
      id: ideasTable.id,
      title: ideasTable.title,
      content: ideasTable.content,
      likeCount: ideasTable.likeCount,
      createdAt: ideasTable.createdAt,
      author: {
        id: usersTable.id,
        nickname: usersTable.nickname,
        avatarUrl: usersTable.avatarUrl,
      },
    })
    .from(ideasTable)
    .innerJoin(usersTable, eq(ideasTable.authorId, usersTable.id))
    .where(eq(ideasTable.id, id))
    .limit(1);

  return rows[0];
}
