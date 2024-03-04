ALTER TABLE "user" ALTER COLUMN "id" SET DATA TYPE char(21);--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "id" DROP DEFAULT;
ALTER TABLE "post" ALTER COLUMN "id" SET DATA TYPE char(21);--> statement-breakpoint
ALTER TABLE "post" ALTER COLUMN "id" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "post" ALTER COLUMN "writer" SET DATA TYPE char(21);--> statement-breakpoint
ALTER TABLE "postComment" ALTER COLUMN "id" SET DATA TYPE char(21);--> statement-breakpoint
ALTER TABLE "postComment" ALTER COLUMN "id" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "postComment" ALTER COLUMN "post_id" SET DATA TYPE char(21);--> statement-breakpoint
ALTER TABLE "postComment" ALTER COLUMN "writer" SET DATA TYPE char(21);--> statement-breakpoint