/*
  Warnings:

  - Added the required column `decisionMakerStatus` to the `AuditRequest` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "DecisionMakerStatus" AS ENUM ('YES', 'NO', 'SHARED');

-- AlterTable
ALTER TABLE "AuditRequest" ADD COLUMN     "country" TEXT,
ADD COLUMN     "decisionMakerEmail" TEXT,
ADD COLUMN     "decisionMakerName" TEXT,
ADD COLUMN     "decisionMakerRole" TEXT,
ADD COLUMN     "decisionMakerStatus" "DecisionMakerStatus" NOT NULL DEFAULT 'YES',
ADD COLUMN     "decisionMakerWhatsApp" TEXT,
ADD COLUMN     "industry" TEXT,
ADD COLUMN     "linkedinUrl" TEXT,
ADD COLUMN     "offerSummary" TEXT,
ADD COLUMN     "primaryAcquisitionChannel" TEXT,
ADD COLUMN     "schedulerUrl" TEXT,
ADD COLUMN     "toolsStack" TEXT,
ADD COLUMN     "whatsapp" TEXT;

-- backfill existing rows (safety)
UPDATE "AuditRequest" SET "decisionMakerStatus" = 'YES' WHERE "decisionMakerStatus" IS NULL;

-- optional: remove default to force explicit value on new inserts handled by API
ALTER TABLE "AuditRequest" ALTER COLUMN "decisionMakerStatus" DROP DEFAULT;
