-- CreateEnum
CREATE TYPE "LeadStage" AS ENUM ('NEW', 'CONTACTED', 'REPLIED', 'QUALIFIED', 'BOOKED', 'WON', 'LOST');

-- CreateEnum
CREATE TYPE "OutreachChannel" AS ENUM ('WHATSAPP', 'INSTAGRAM', 'EMAIL', 'LINKEDIN');

-- CreateEnum
CREATE TYPE "TouchpointType" AS ENUM ('INITIAL', 'FOLLOW_UP', 'REPLY', 'NOTE');

-- CreateEnum
CREATE TYPE "TouchpointOutcome" AS ENUM ('SENT', 'DELIVERED', 'OPENED', 'CLICKED', 'REPLIED', 'BOUNCED', 'FAILED', 'NO_RESPONSE');

-- AlterEnum
ALTER TYPE "LeadSource" ADD VALUE 'OUTREACH';

-- AlterTable
ALTER TABLE "Lead" ADD COLUMN     "company" TEXT,
ADD COLUMN     "instagramUrl" TEXT,
ADD COLUMN     "lastContactedAt" TIMESTAMP(3),
ADD COLUMN     "lastRepliedAt" TIMESTAMP(3),
ADD COLUMN     "linkedinUrl" TEXT,
ADD COLUMN     "nextFollowUpAt" TIMESTAMP(3),
ADD COLUMN     "role" TEXT,
ADD COLUMN     "stage" "LeadStage" NOT NULL DEFAULT 'NEW',
ADD COLUMN     "tags" TEXT,
ADD COLUMN     "websiteUrl" TEXT;

-- CreateTable
CREATE TABLE "Touchpoint" (
    "id" TEXT NOT NULL,
    "leadId" TEXT NOT NULL,
    "channel" "OutreachChannel" NOT NULL,
    "type" "TouchpointType" NOT NULL,
    "subject" TEXT,
    "body" TEXT,
    "outcome" "TouchpointOutcome",
    "sentAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Touchpoint_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LeadNote" (
    "id" TEXT NOT NULL,
    "leadId" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LeadNote_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Touchpoint_leadId_createdAt_idx" ON "Touchpoint"("leadId", "createdAt");

-- CreateIndex
CREATE INDEX "Touchpoint_channel_createdAt_idx" ON "Touchpoint"("channel", "createdAt");

-- CreateIndex
CREATE INDEX "Touchpoint_sentAt_idx" ON "Touchpoint"("sentAt");

-- CreateIndex
CREATE INDEX "LeadNote_leadId_createdAt_idx" ON "LeadNote"("leadId", "createdAt");

-- CreateIndex
CREATE INDEX "Lead_stage_nextFollowUpAt_idx" ON "Lead"("stage", "nextFollowUpAt");

-- CreateIndex
CREATE INDEX "Lead_createdAt_idx" ON "Lead"("createdAt");

-- AddForeignKey
ALTER TABLE "Touchpoint" ADD CONSTRAINT "Touchpoint_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LeadNote" ADD CONSTRAINT "LeadNote_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead"("id") ON DELETE CASCADE ON UPDATE CASCADE;
