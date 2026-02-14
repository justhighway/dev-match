import {
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

import { users } from "./users";

export const roleEnum = pgEnum("recruit_role", ["LEADER", "MEMBER"]);

export const recruitments = pgTable("recruitments", {
  id: uuid("id").defaultRandom().primaryKey(),
  leaderId: uuid("leader_id")
    .references(() => users.id, {
      onDelete: "cascade",
    })
    .notNull(),

  title: text("title").notNull(),
  summary: text("summary").notNull(),
  content: text("content").notNull(),

  techStacks: text("tech_stacks").array().notNull(),
  openChatUrl: text("open_chat_url").notNull(),

  isClosed: text("is_closed").default("FALSE"),

  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const recruitmentMembers = pgTable(
  "recruitment_members",
  {
    recruitmentId: uuid("recruitment_id")
      .references(() => recruitments.id, { onDelete: "cascade" })
      .notNull(),
    userId: uuid("user_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    role: roleEnum("role").default("MEMBER").notNull(),
    joinedAt: timestamp("joined_at").defaultNow().notNull(),
  },
  (t) => [primaryKey({ columns: [t.recruitmentId, t.userId] })],
);
