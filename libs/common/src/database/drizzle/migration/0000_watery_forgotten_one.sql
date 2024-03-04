CREATE TABLE IF NOT EXISTS "postComment" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"post_id" uuid NOT NULL,
	"parent_comment_id" uuid,
	"comment" text,
	"writer" uuid NOT NULL,
	"is_use" boolean DEFAULT true,
	"last_login_date" timestamp with time zone,
	"create_by" varchar(100) NOT NULL,
	"created_at" timestamp with time zone NOT NULL,
	"update_by" varchar(100),
	"updated_at" timestamp with time zone,
	"delete_by" varchar(100),
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "post" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar(200) NOT NULL,
	"content" text,
	"writer" uuid NOT NULL,
	"is_use" boolean DEFAULT true,
	"image_urls" text[],
	"last_login_date" timestamp with time zone,
	"create_by" varchar(100) NOT NULL,
	"created_at" timestamp with time zone NOT NULL,
	"update_by" varchar(100),
	"updated_at" timestamp with time zone,
	"delete_by" varchar(100),
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar(100) NOT NULL,
	"nick_name" varchar(100) NOT NULL,
	"password" varchar(100) NOT NULL,
	"sign_out_date" timestamp with time zone,
	"last_login_date" timestamp with time zone,
	"create_by" varchar(100) NOT NULL,
	"created_at" timestamp with time zone NOT NULL,
	"update_by" varchar(100),
	"updated_at" timestamp with time zone,
	"delete_by" varchar(100),
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "postComment" ADD CONSTRAINT "postComment_post_id_post_id_fk" FOREIGN KEY ("post_id") REFERENCES "post"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "postComment" ADD CONSTRAINT "postComment_parent_comment_id_postComment_id_fk" FOREIGN KEY ("parent_comment_id") REFERENCES "postComment"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "postComment" ADD CONSTRAINT "postComment_writer_user_id_fk" FOREIGN KEY ("writer") REFERENCES "user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "post" ADD CONSTRAINT "post_writer_user_id_fk" FOREIGN KEY ("writer") REFERENCES "user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
