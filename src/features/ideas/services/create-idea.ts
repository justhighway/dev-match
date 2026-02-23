import { CreateIdeaDto } from './types';
import { db } from '@/shared/server/db';
import { ideasTable } from '@/shared/server/db/schema';

export async function createIdea(data: CreateIdeaDto) {
  const [newIdea] = await db
    .insert(ideasTable)
    .values({
      title: data.title,
      content: data.content,
      authorId: data.authorId,
    })
    .returning();

  return newIdea;
}
