import { relations } from 'drizzle-orm';
import {
  boolean,
  char,
  pgTable,
  text,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';
import { post } from './post.schema';
import { user } from './user.schema';

export const postComment = pgTable('post_comment', {
  id: char('id', { length: 21 }).primaryKey(),
  postId: char('post_id', { length: 21 })
    .references(() => post.id, { onDelete: 'cascade' })
    .notNull(),
  parentCommentId: char('parent_comment_id', { length: 21 }).references(
    () => postComment.id,
  ),
  comment: text('comment'),
  writer: char('writer', { length: 21 })
    .references(() => user.id, { onDelete: 'cascade' })
    .notNull(),
  isUse: boolean('is_use').default(true),
  lastLoginDate: timestamp('last_login_date', { withTimezone: true }),
  likeUserIds: char('like_user_ids', { length: 21 }).array(),

  createBy: varchar('create_by', { length: 100 }).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull(),
  updateBy: varchar('update_by', { length: 100 }),
  updatedAt: timestamp('updated_at', { withTimezone: true }),
  deleteBy: varchar('delete_by', { length: 100 }),
  deletedAt: timestamp('deleted_at', { withTimezone: true }),
});

export const postCommentRelations = relations(postComment, ({ one, many }) => ({
  user: one(user, {
    fields: [postComment.writer],
    references: [user.id],
  }),
  post: one(post, {
    fields: [postComment.postId],
    references: [post.id],
  }),
  parentComment: one(postComment, {
    fields: [postComment.parentCommentId],
    references: [postComment.id],
    relationName: 'parent',
  }),
  childComments: many(postComment, {
    relationName: 'parent',
  }),
}));

export type SelectPostComment = typeof postComment.$inferSelect;
export type InsertPostComment = typeof postComment.$inferInsert;
