import { db } from '@/shared/db';
import { recruitmentsTable } from '@/shared/db/schema';

import { CreateRecruitmentInput } from '../schemas/create-recruitment';

export async function createRecruitment(
  data: CreateRecruitmentInput & { leaderId: string },
) {
  const [created] = await db
    .insert(recruitmentsTable)
    .values({
      leaderId: data.leaderId,
      title: data.title,
      summary: data.summary ?? '',
      content: data.content,
      projectType: data.projectType,
      roles: data.roles,
      headcount: data.headcount,
      techStacks: data.techStacks,
      openChatUrl: data.openChatUrl,
    })
    .returning();

  return created;
}
