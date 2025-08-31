import { relations } from "drizzle-orm";
import {
  sqliteTable,
  integer,
  text,
  primaryKey,
} from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { randomUUID } from "node:crypto";

export type Topic =
  | "biology"
  | "physics"
  | "math"
  | "earth science"
  | "earth and space"
  | "energy"
  | "general science"
  | "astronomy"
  | "chemistry";

export type QuestionType = "shortAnswer" | "multipleChoice";

export const Question = sqliteTable("question", {
  id: text("id")
    .notNull()
    .primaryKey()
    .$defaultFn(() => randomUUID()),
  bonus: integer("bonus", { mode: "boolean" }).notNull(),
  number: integer("number").notNull(),
  topic: text("topic").notNull().$type<Topic>(),
  type: text("type").notNull().$type<QuestionType>(),
  pronunciations: text("pronunciations").$type<string[]>().notNull(),
  question: text("question").notNull(),
  htmlUrl: text("html_url").notNull(),
  answer: text("answer")
    .$type<
      | {
          answer: string;
          letter: string;
          correct: boolean;
          pronunciations: string[];
        }[]
      | string
    >()
    .notNull(),
  explanation: text("explanation").notNull(),
  valid: integer("valid", { mode: "boolean" }).notNull().default(true),
});

export const Post = sqliteTable("post", {
  id: text("id")
    .notNull()
    .primaryKey()
    .$defaultFn(() => randomUUID()),
  title: text("title").notNull(),
  content: text("content").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$onUpdateFn(
    () => new Date(),
  ),
});

export const CreatePostSchema = createInsertSchema(Post, {
  title: z.string().max(256),
  content: z.string().max(256),
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const User = sqliteTable("user", {
  id: text("id")
    .notNull()
    .primaryKey()
    .$defaultFn(() => randomUUID()),
  name: text("name"),
  email: text("email").notNull(),
  emailVerified: integer("email_verified", { mode: "timestamp" }),
  image: text("image"),
});

export const UserRelations = relations(User, ({ many }) => ({
  accounts: many(Account),
}));

export const Account = sqliteTable(
  "account",
  {
    userId: text("user_id")
      .notNull()
      .references(() => User.id, { onDelete: "cascade" }),
    type: text("type", { length: 255 })
      .$type<"email" | "oauth" | "oidc" | "webauthn">()
      .notNull(),
    provider: text("provider", { length: 255 }).notNull(),
    providerAccountId: text("provider_account_id", { length: 255 }).notNull(),
    refresh_token: text("refresh_token", { length: 255 }),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type", { length: 255 }),
    scope: text("scope", { length: 255 }),
    id_token: text("id_token"),
    session_state: text("session_state", { length: 255 }),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  }),
);

export const AccountRelations = relations(Account, ({ one }) => ({
  user: one(User, { fields: [Account.userId], references: [User.id] }),
}));

export const Session = sqliteTable("session", {
  sessionToken: text("session_token", { length: 255 }).notNull().primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => User.id, { onDelete: "cascade" }),
  expires: integer("expires", { mode: "timestamp" }).notNull(),
});

export const SessionRelations = relations(Session, ({ one }) => ({
  user: one(User, { fields: [Session.userId], references: [User.id] }),
}));
