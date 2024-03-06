import { relations } from 'drizzle-orm';
import {
  boolean,
  char,
  pgTable,
  text,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';
import { postComment } from './post-comment.schema';
import { user } from './user.schema';

export const post = pgTable('post', {
  id: char('id', { length: 21 }).primaryKey(),
  title: varchar('title', { length: 200 }).notNull(),
  content: text('content'),
  writer: char('writer', { length: 21 })
    .references(() => user.id, { onDelete: 'cascade' })
    .notNull(),
  isUse: boolean('is_use').default(true),
  imageUrls: text('image_urls').array(),
  lastLoginDate: timestamp('last_login_date', { withTimezone: true }),
  likeUserIds: char('like_user_ids', { length: 21 }).array(),
  createBy: varchar('create_by', { length: 100 }).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull(),
  updateBy: varchar('update_by', { length: 100 }),
  updatedAt: timestamp('updated_at', { withTimezone: true }),
  deleteBy: varchar('delete_by', { length: 100 }),
  deletedAt: timestamp('deleted_at', { withTimezone: true }),
});

export const postRelations = relations(post, ({ one, many }) => ({
  user: one(user, {
    fields: [post.writer],
    references: [user.id],
  }),
  comments: many(postComment),
}));

export type SelectPost = typeof post.$inferSelect;
export type InsertPost = typeof post.$inferInsert;
