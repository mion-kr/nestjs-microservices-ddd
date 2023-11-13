/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `user` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[nick_name]` on the table `user` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "post" ALTER COLUMN "update_by" DROP NOT NULL,
ALTER COLUMN "updatedAt" DROP NOT NULL,
ALTER COLUMN "delete_by" DROP NOT NULL;

-- AlterTable
ALTER TABLE "post_comment" ALTER COLUMN "update_by" DROP NOT NULL,
ALTER COLUMN "updatedAt" DROP NOT NULL,
ALTER COLUMN "delete_by" DROP NOT NULL;

-- AlterTable
ALTER TABLE "post_image" ALTER COLUMN "update_by" DROP NOT NULL,
ALTER COLUMN "updatedAt" DROP NOT NULL,
ALTER COLUMN "delete_by" DROP NOT NULL;

-- AlterTable
ALTER TABLE "user" ALTER COLUMN "update_by" DROP NOT NULL,
ALTER COLUMN "updatedAt" DROP NOT NULL,
ALTER COLUMN "delete_by" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "user_nick_name_key" ON "user"("nick_name");
