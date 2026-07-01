-- AlterTable
ALTER TABLE "Application" ADD COLUMN     "resumeFileName" TEXT,
ADD COLUMN     "resumeUrl" TEXT,
ADD COLUMN     "resumeUsed" TEXT,
ADD COLUMN     "userId" TEXT;

-- CreateIndex
CREATE INDEX "Application_userId_idx" ON "Application"("userId");
