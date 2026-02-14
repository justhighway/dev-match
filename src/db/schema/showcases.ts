import {
  integer,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

import { users } from "./users";

export const showcases = pgTable("showcases", {
  id: uuid("id").defaultRandom().primaryKey(),
  authorId: uuid("author_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),

  title: text("title").notNull(),
  summary: text("summary").notNull(),

  githubRepoUrl: text("github_repo_url").notNull(),
  serviceUrl: text("service_url").notNull(),
  thumbnailUrl: text("thumbnail_url"),

  likeCount: integer("like_count").default(0).notNull(),

  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const showcaseLikes = pgTable(
  "showcase_likes",
  {
    showcaseId: uuid("showcase_id")
      .references(() => showcases.id, { onDelete: "cascade" })
      .notNull(),
    userId: uuid("user_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => [primaryKey({ columns: [t.showcaseId, t.userId] })],
);
