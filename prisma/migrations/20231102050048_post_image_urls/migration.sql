/*
  Warnings:

  - You are about to drop the `post_image` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "post_image" DROP CONSTRAINT "post_image_post_id_fkey";

-- AlterTable
ALTER TABLE "post" ADD COLUMN     "image_urls" TEXT[];

-- DropTable
DROP TABLE "post_image";
