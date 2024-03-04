ALTER TABLE "postComment" DROP CONSTRAINT "postComment_post_id_post_id_fk";
--> statement-breakpoint
ALTER TABLE "post" DROP CONSTRAINT "post_writer_user_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "postComment" ADD CONSTRAINT "postComment_post_id_post_id_fk" FOREIGN KEY ("post_id") REFERENCES "post"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "post" ADD CONSTRAINT "post_writer_user_id_fk" FOREIGN KEY ("writer") REFERENCES "user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
