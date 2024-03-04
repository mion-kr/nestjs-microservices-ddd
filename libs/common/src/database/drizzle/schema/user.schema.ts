import { relations } from 'drizzle-orm';
import { char, pgTable, timestamp, varchar } from 'drizzle-orm/pg-core';
import { postComment } from './post-comment.schema';
import { post } from './post.schema';

// enums
// export const popularityEnum = pgEnum('popularity', ['unknown', 'known', 'popular']);
export const user = pgTable('user', {
  id: char('id', { length: 21 }).primaryKey(),
  email: varchar('email', { length: 100 }).notNull(),
  nickName: varchar('nick_name', { length: 100 }).notNull(),
  password: varchar('password', { length: 100 }).notNull(),
  signOutDate: timestamp('sign_out_date', { withTimezone: true }),
  lastLoginDate: timestamp('last_login_date', { withTimezone: true }),

  createBy: varchar('create_by', { length: 100 }).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull(),
  updateBy: varchar('update_by', { length: 100 }),
  updatedAt: timestamp('updated_at', { withTimezone: true }),
  deleteBy: varchar('delete_by', { length: 100 }),
  deletedAt: timestamp('deleted_at', { withTimezone: true }),
});

export const usersRelations = relations(user, ({ many }) => ({
  posts: many(post),
  comments: many(postComment),
}));

export type SelectUser = typeof user.$inferSelect;
export type InsertUser = typeof user.$inferInsert;
