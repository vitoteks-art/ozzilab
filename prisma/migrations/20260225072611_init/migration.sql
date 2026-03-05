-- CreateEnum
CREATE TYPE "AuditStatus" AS ENUM ('NEW', 'REVIEWING', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "IntakeStatus" AS ENUM ('NEW', 'REVIEWING', 'ACCEPTED', 'IN_PROGRESS', 'DELIVERED', 'REJECTED');

-- CreateEnum
CREATE TYPE "LeadSource" AS ENUM ('AUDIT', 'INTAKE', 'LIBRARY_FREE_DOWNLOAD');

-- CreateEnum
CREATE TYPE "LibraryAccessTier" AS ENUM ('FREE', 'PREMIUM');

-- CreateEnum
CREATE TYPE "PaymentProvider" AS ENUM ('PAYSTACK', 'FLUTTERWAVE');

-- CreateEnum
CREATE TYPE "Currency" AS ENUM ('NGN', 'USD');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'SUCCESS', 'FAILED', 'ABANDONED');

-- CreateEnum
CREATE TYPE "EntitlementType" AS ENUM ('LIBRARY_ITEM');

-- CreateTable
CREATE TABLE "AdminUser" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AdminUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdminSession" (
    "id" TEXT NOT NULL,
    "adminUserId" TEXT NOT NULL,
    "sessionTokenHash" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AdminSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditRequest" (
    "id" TEXT NOT NULL,
    "auditId" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "businessName" TEXT NOT NULL,
    "websiteUrl" TEXT,
    "instagramUrl" TEXT,
    "youtubeUrl" TEXT,
    "offerType" TEXT,
    "pricePointRange" TEXT,
    "monthlyLeadVolumeRange" TEXT,
    "primaryGoal" TEXT,
    "biggestConstraint" TEXT,
    "status" "AuditStatus" NOT NULL DEFAULT 'NEW',
    "internalNotes" TEXT,
    "reviewedAt" TIMESTAMP(3),
    "approvedAt" TIMESTAMP(3),
    "rejectedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AuditRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IntakeInviteToken" (
    "id" TEXT NOT NULL,
    "auditRequestId" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "usedAt" TIMESTAMP(3),
    "deliveryEmail" TEXT,
    "deliveryWhatsApp" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "IntakeInviteToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IntakeSubmission" (
    "id" TEXT NOT NULL,
    "submissionId" TEXT NOT NULL,
    "auditRequestId" TEXT NOT NULL,
    "businessName" TEXT NOT NULL,
    "websiteUrl" TEXT,
    "contactEmail" TEXT NOT NULL,
    "industry" TEXT,
    "kpiTarget" TEXT,
    "successDefinition" TEXT,
    "funnelSummary" TEXT,
    "toolsStack" TEXT,
    "constraints" TEXT,
    "requestedBuild" TEXT,
    "mustHaveFeatures" TEXT,
    "nonGoals" TEXT,
    "timeline" TEXT,
    "budgetRange" TEXT,
    "supportingLinks" TEXT,
    "status" "IntakeStatus" NOT NULL DEFAULT 'NEW',
    "internalNotes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "IntakeSubmission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SubmissionFile" (
    "id" TEXT NOT NULL,
    "intakeSubmissionId" TEXT NOT NULL,
    "originalName" TEXT NOT NULL,
    "storedPath" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "sizeBytes" BIGINT NOT NULL,
    "checksum" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SubmissionFile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Lead" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "source" "LeadSource" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Lead_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LibraryItem" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "summary" TEXT,
    "contentMarkdown" TEXT,
    "tier" "LibraryAccessTier" NOT NULL,
    "priceNGN" INTEGER,
    "priceUSD" INTEGER,
    "downloadFilePath" TEXT,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LibraryItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LibraryFreeDownload" (
    "id" TEXT NOT NULL,
    "libraryItemId" TEXT NOT NULL,
    "leadId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LibraryFreeDownload_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Purchase" (
    "id" TEXT NOT NULL,
    "provider" "PaymentProvider" NOT NULL,
    "providerReference" TEXT NOT NULL,
    "providerTransactionId" TEXT,
    "email" TEXT NOT NULL,
    "libraryItemId" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "currency" "Currency" NOT NULL,
    "status" "PaymentStatus" NOT NULL,
    "rawWebhookEvent" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Purchase_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Entitlement" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "type" "EntitlementType" NOT NULL,
    "libraryItemId" TEXT NOT NULL,
    "purchaseId" TEXT,
    "startsAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endsAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Entitlement_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AdminUser_email_key" ON "AdminUser"("email");

-- CreateIndex
CREATE UNIQUE INDEX "AdminSession_sessionTokenHash_key" ON "AdminSession"("sessionTokenHash");

-- CreateIndex
CREATE INDEX "AdminSession_adminUserId_idx" ON "AdminSession"("adminUserId");

-- CreateIndex
CREATE INDEX "AdminSession_expiresAt_idx" ON "AdminSession"("expiresAt");

-- CreateIndex
CREATE UNIQUE INDEX "AuditRequest_auditId_key" ON "AuditRequest"("auditId");

-- CreateIndex
CREATE INDEX "AuditRequest_status_createdAt_idx" ON "AuditRequest"("status", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "IntakeInviteToken_tokenHash_key" ON "IntakeInviteToken"("tokenHash");

-- CreateIndex
CREATE INDEX "IntakeInviteToken_auditRequestId_idx" ON "IntakeInviteToken"("auditRequestId");

-- CreateIndex
CREATE INDEX "IntakeInviteToken_expiresAt_idx" ON "IntakeInviteToken"("expiresAt");

-- CreateIndex
CREATE UNIQUE INDEX "IntakeSubmission_submissionId_key" ON "IntakeSubmission"("submissionId");

-- CreateIndex
CREATE INDEX "IntakeSubmission_status_createdAt_idx" ON "IntakeSubmission"("status", "createdAt");

-- CreateIndex
CREATE INDEX "IntakeSubmission_auditRequestId_idx" ON "IntakeSubmission"("auditRequestId");

-- CreateIndex
CREATE INDEX "SubmissionFile_intakeSubmissionId_idx" ON "SubmissionFile"("intakeSubmissionId");

-- CreateIndex
CREATE INDEX "Lead_email_idx" ON "Lead"("email");

-- CreateIndex
CREATE UNIQUE INDEX "LibraryItem_slug_key" ON "LibraryItem"("slug");

-- CreateIndex
CREATE INDEX "LibraryFreeDownload_libraryItemId_idx" ON "LibraryFreeDownload"("libraryItemId");

-- CreateIndex
CREATE INDEX "LibraryFreeDownload_leadId_idx" ON "LibraryFreeDownload"("leadId");

-- CreateIndex
CREATE UNIQUE INDEX "Purchase_providerReference_key" ON "Purchase"("providerReference");

-- CreateIndex
CREATE INDEX "Purchase_email_idx" ON "Purchase"("email");

-- CreateIndex
CREATE INDEX "Purchase_status_createdAt_idx" ON "Purchase"("status", "createdAt");

-- CreateIndex
CREATE INDEX "Entitlement_email_libraryItemId_idx" ON "Entitlement"("email", "libraryItemId");

-- AddForeignKey
ALTER TABLE "AdminSession" ADD CONSTRAINT "AdminSession_adminUserId_fkey" FOREIGN KEY ("adminUserId") REFERENCES "AdminUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IntakeInviteToken" ADD CONSTRAINT "IntakeInviteToken_auditRequestId_fkey" FOREIGN KEY ("auditRequestId") REFERENCES "AuditRequest"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IntakeSubmission" ADD CONSTRAINT "IntakeSubmission_auditRequestId_fkey" FOREIGN KEY ("auditRequestId") REFERENCES "AuditRequest"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubmissionFile" ADD CONSTRAINT "SubmissionFile_intakeSubmissionId_fkey" FOREIGN KEY ("intakeSubmissionId") REFERENCES "IntakeSubmission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LibraryFreeDownload" ADD CONSTRAINT "LibraryFreeDownload_libraryItemId_fkey" FOREIGN KEY ("libraryItemId") REFERENCES "LibraryItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LibraryFreeDownload" ADD CONSTRAINT "LibraryFreeDownload_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Purchase" ADD CONSTRAINT "Purchase_libraryItemId_fkey" FOREIGN KEY ("libraryItemId") REFERENCES "LibraryItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Entitlement" ADD CONSTRAINT "Entitlement_libraryItemId_fkey" FOREIGN KEY ("libraryItemId") REFERENCES "LibraryItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Entitlement" ADD CONSTRAINT "Entitlement_purchaseId_fkey" FOREIGN KEY ("purchaseId") REFERENCES "Purchase"("id") ON DELETE SET NULL ON UPDATE CASCADE;
