-- CreateEnum
CREATE TYPE "ProjectStatus" AS ENUM ('NEW', 'ACTIVE', 'BLOCKED', 'COMPLETED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "ActorType" AS ENUM ('ADMIN', 'OZZI', 'CLIENT', 'SYSTEM');

-- CreateEnum
CREATE TYPE "EntityType" AS ENUM ('PROJECT', 'AUDIT_REQUEST', 'INTAKE_SUBMISSION', 'LEAD', 'LIBRARY_ITEM', 'PURCHASE');

-- CreateTable
CREATE TABLE "Project" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "status" "ProjectStatus" NOT NULL DEFAULT 'NEW',
    "auditRequestId" TEXT,
    "intakeSubmissionId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ActivityEvent" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "actorType" "ActorType" NOT NULL,
    "actorId" TEXT,
    "entityType" "EntityType" NOT NULL,
    "entityId" TEXT NOT NULL,
    "projectId" TEXT,
    "payload" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ActivityEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ServiceToken" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "scopes" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "lastUsedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ServiceToken_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Project_code_key" ON "Project"("code");

-- CreateIndex
CREATE INDEX "Project_status_createdAt_idx" ON "Project"("status", "createdAt");

-- CreateIndex
CREATE INDEX "ActivityEvent_createdAt_idx" ON "ActivityEvent"("createdAt");

-- CreateIndex
CREATE INDEX "ActivityEvent_type_createdAt_idx" ON "ActivityEvent"("type", "createdAt");

-- CreateIndex
CREATE INDEX "ActivityEvent_entityType_entityId_idx" ON "ActivityEvent"("entityType", "entityId");

-- CreateIndex
CREATE INDEX "ActivityEvent_projectId_createdAt_idx" ON "ActivityEvent"("projectId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "ServiceToken_name_key" ON "ServiceToken"("name");

-- CreateIndex
CREATE UNIQUE INDEX "ServiceToken_tokenHash_key" ON "ServiceToken"("tokenHash");

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_auditRequestId_fkey" FOREIGN KEY ("auditRequestId") REFERENCES "AuditRequest"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_intakeSubmissionId_fkey" FOREIGN KEY ("intakeSubmissionId") REFERENCES "IntakeSubmission"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActivityEvent" ADD CONSTRAINT "ActivityEvent_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;
