-- AlterTable
ALTER TABLE "likes" ADD COLUMN     "replyId" TEXT,
ALTER COLUMN "threadId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "likes" ADD CONSTRAINT "likes_replyId_fkey" FOREIGN KEY ("replyId") REFERENCES "replies"("id") ON DELETE CASCADE ON UPDATE CASCADE;
