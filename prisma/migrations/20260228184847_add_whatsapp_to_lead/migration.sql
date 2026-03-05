-- AlterTable
ALTER TABLE "Lead" ADD COLUMN     "whatsapp" TEXT;

-- CreateIndex
CREATE INDEX "Lead_whatsapp_idx" ON "Lead"("whatsapp");
