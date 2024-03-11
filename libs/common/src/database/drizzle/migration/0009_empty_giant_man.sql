ALTER TABLE "postComment" RENAME TO "post_comment";--> statement-breakpoint
ALTER TABLE "post_comment" DROP CONSTRAINT "postComment_post_id_post_id_fk";
--> statement-breakpoint
ALTER TABLE "post_comment" DROP CONSTRAINT "postComment_parent_comment_id_postComment_id_fk";
--> statement-breakpoint
ALTER TABLE "post_comment" DROP CONSTRAINT "postComment_writer_user_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "post_comment" ADD CONSTRAINT "post_comment_post_id_post_id_fk" FOREIGN KEY ("post_id") REFERENCES "post"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "post_comment" ADD CONSTRAINT "post_comment_parent_comment_id_post_comment_id_fk" FOREIGN KEY ("parent_comment_id") REFERENCES "post_comment"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "post_comment" ADD CONSTRAINT "post_comment_writer_user_id_fk" FOREIGN KEY ("writer") REFERENCES "user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
