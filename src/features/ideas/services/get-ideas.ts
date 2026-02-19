import { desc, eq } from 'drizzle-orm';
import { ideasTable, usersTable } from '@/db/schema';

import { db } from '@/db';

export async function getIdeas() {
  const rows = await db
    .select({
      id: ideasTable.id,
      title: ideasTable.title,
      content: ideasTable.content,
      likeCount: ideasTable.likeCount,
      createdAt: ideasTable.createdAt,
      author: {
        nickname: usersTable.nickname,
        avatarUrl: usersTable.avatarUrl,
      },
    })
    .from(ideasTable)
    .innerJoin(usersTable, eq(ideasTable.authorId, usersTable.id))
    .orderBy(desc(ideasTable.createdAt));

  return rows;
}
