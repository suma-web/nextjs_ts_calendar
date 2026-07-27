-- AlterTable
ALTER TABLE "Schedule" ADD COLUMN     "ownerEmail" TEXT;

-- CreateIndex
CREATE INDEX "Schedule_ownerEmail_startTime_idx" ON "Schedule"("ownerEmail", "startTime");
