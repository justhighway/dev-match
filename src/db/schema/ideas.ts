import { integer, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

import { users } from "./users";

export const ideas = pgTable("ideas", {
  id: uuid("id").defaultRandom().primaryKey(),
  authorId: uuid("author_id")
    .references(() => users.id, {
      onDelete: "cascade",
    })
    .notNull(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  likeCount: integer("like_count").default(0).notNull(),
  viewCount: integer("view_count").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
