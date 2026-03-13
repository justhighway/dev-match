import { db } from '@/shared/db';
import { ideasTable } from '@/shared/db/schema';

export interface CreateIdeaDto {
  title: string;
  content: string;
  authorId: string;
}

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
