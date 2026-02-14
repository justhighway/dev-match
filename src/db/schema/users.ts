import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").primaryKey().notNull(),
  email: text("email").notNull(),
  nickname: text("nickname").notNull(),
  avatarUrl: text("avatar_url"),
  githubUrl: text("github_url"),
  workStyleTags: text("work_style_tags").array(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
