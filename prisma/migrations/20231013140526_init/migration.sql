-- CreateTable
CREATE TABLE "user" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "nick_name" TEXT,
    "password" TEXT NOT NULL,
    "sign_out_date" TIMESTAMP(3),
    "last_login_date" TIMESTAMP(3),
    "create_by" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_by" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "delete_by" TEXT NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "post" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT,
    "user_id" TEXT,
    "is_use" BOOLEAN NOT NULL DEFAULT true,
    "like_user_ids" TEXT[],
    "create_by" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_by" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "delete_by" TEXT NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "post_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "post_image" (
    "id" TEXT NOT NULL,
    "post_id" TEXT,
    "url" TEXT NOT NULL,
    "create_by" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_by" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "delete_by" TEXT NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "post_image_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "post_comment" (
    "id" TEXT NOT NULL,
    "post_id" TEXT,
    "user_id" TEXT,
    "comment" TEXT NOT NULL,
    "parent_comment_id" TEXT,
    "is_use" BOOLEAN NOT NULL DEFAULT true,
    "like_user_ids" TEXT[],
    "create_by" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_by" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "delete_by" TEXT NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "post_comment_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "post" ADD CONSTRAINT "post_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post_image" ADD CONSTRAINT "post_image_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "post"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post_comment" ADD CONSTRAINT "post_comment_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "post"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post_comment" ADD CONSTRAINT "post_comment_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post_comment" ADD CONSTRAINT "post_comment_parent_comment_id_fkey" FOREIGN KEY ("parent_comment_id") REFERENCES "post_comment"("id") ON DELETE SET NULL ON UPDATE CASCADE;
