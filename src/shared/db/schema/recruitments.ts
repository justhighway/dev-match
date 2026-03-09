import {
  integer,
  pgEnum,
  pgTable,
  primaryKey,
  serial,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core';

import { usersTable } from './users';

export const roleEnum = pgEnum('recruit_role', ['LEADER', 'MEMBER']);

export const recruitmentsTable = pgTable('recruitments', {
  id: uuid('id').defaultRandom().primaryKey(),
  numId: serial('num_id').unique().notNull(),
  leaderId: uuid('leader_id')
    .references(() => usersTable.id, {
      onDelete: 'cascade',
    })
    .notNull(),

  title: text('title').notNull(),
  summary: text('summary').notNull(),
  content: text('content').notNull(),

  techStacks: text('tech_stacks').array().notNull(),
  projectType: text('project_type'),
  roles: text('roles').array().notNull().default([]),
  headcount: integer('headcount').notNull().default(2),
  openChatUrl: text('open_chat_url').notNull(),

  isClosed: text('is_closed').default('FALSE'),

  likeCount: integer('like_count').default(0).notNull(),
  bookmarkCount: integer('bookmark_count').default(0).notNull(),
  viewCount: integer('view_count').default(0).notNull(),

  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const recruitmentMembersTable = pgTable(
  'recruitment_members',
  {
    recruitmentId: uuid('recruitment_id')
      .references(() => recruitmentsTable.id, { onDelete: 'cascade' })
      .notNull(),
    userId: uuid('user_id')
      .references(() => usersTable.id, { onDelete: 'cascade' })
      .notNull(),
    role: roleEnum('role').default('MEMBER').notNull(),
    joinedAt: timestamp('joined_at').defaultNow().notNull(),
  },
  (t) => [primaryKey({ columns: [t.recruitmentId, t.userId] })],
);
