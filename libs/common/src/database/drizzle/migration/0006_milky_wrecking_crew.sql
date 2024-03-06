DO $$ BEGIN
 ALTER TABLE "post" ADD CONSTRAINT "post_like_user_ids_user_id_fk" FOREIGN KEY ("like_user_ids") REFERENCES "user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
