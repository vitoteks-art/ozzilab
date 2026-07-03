-- Ozzi booking system + expanded audit qualification fields
CREATE TYPE "BookingStatus" AS ENUM ('NEW', 'CONFIRMED', 'RESCHEDULE_REQUESTED', 'COMPLETED', 'CANCELLED');
CREATE TYPE "BookingSource" AS ENUM ('BOOKING_PAGE', 'AUDIT_THANK_YOU', 'ADMIN');
ALTER TYPE "EntityType" ADD VALUE IF NOT EXISTS 'BOOKING_REQUEST';

ALTER TABLE "AuditRequest"
  ADD COLUMN IF NOT EXISTS "googleBusinessUrl" TEXT,
  ADD COLUMN IF NOT EXISTS "appointmentBookingMethod" TEXT,
  ADD COLUMN IF NOT EXISTS "averageClientValueRange" TEXT,
  ADD COLUMN IF NOT EXISTS "urgencyReadiness" TEXT,
  ADD COLUMN IF NOT EXISTS "preferredPackageInterest" TEXT;

CREATE TABLE IF NOT EXISTS "BookingRequest" (
  "id" TEXT NOT NULL,
  "bookingId" TEXT NOT NULL,
  "fullName" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "whatsapp" TEXT,
  "country" TEXT,
  "businessName" TEXT NOT NULL,
  "industry" TEXT,
  "websiteUrl" TEXT,
  "instagramUrl" TEXT,
  "linkedinUrl" TEXT,
  "youtubeUrl" TEXT,
  "googleBusinessUrl" TEXT,
  "schedulerUrl" TEXT,
  "meetingType" TEXT NOT NULL,
  "timezone" TEXT,
  "scheduledStart" TIMESTAMP(3) NOT NULL,
  "scheduledEnd" TIMESTAMP(3) NOT NULL,
  "alternativeDate" TEXT,
  "alternativeTime" TEXT,
  "currentLeadSources" TEXT,
  "mainProblem" TEXT,
  "monthlyLeadVolumeRange" TEXT,
  "budgetReadiness" TEXT,
  "preferredPackageInterest" TEXT,
  "status" "BookingStatus" NOT NULL DEFAULT 'NEW',
  "source" "BookingSource" NOT NULL DEFAULT 'BOOKING_PAGE',
  "internalNotes" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "BookingRequest_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "BookingRequest_bookingId_key" ON "BookingRequest"("bookingId");
CREATE INDEX IF NOT EXISTS "BookingRequest_status_createdAt_idx" ON "BookingRequest"("status", "createdAt");
CREATE INDEX IF NOT EXISTS "BookingRequest_scheduledStart_idx" ON "BookingRequest"("scheduledStart");
CREATE INDEX IF NOT EXISTS "BookingRequest_email_idx" ON "BookingRequest"("email");

CREATE TABLE IF NOT EXISTS "BookingAvailabilityRule" (
  "id" TEXT NOT NULL,
  "dayOfWeek" INTEGER NOT NULL,
  "startTime" TEXT NOT NULL,
  "endTime" TEXT NOT NULL,
  "slotMinutes" INTEGER NOT NULL DEFAULT 30,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "BookingAvailabilityRule_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "BookingAvailabilityRule_dayOfWeek_isActive_idx" ON "BookingAvailabilityRule"("dayOfWeek", "isActive");

CREATE TABLE IF NOT EXISTS "BookingSettings" (
  "id" INTEGER NOT NULL DEFAULT 1,
  "lookaheadDays" INTEGER NOT NULL DEFAULT 14,
  "minimumNoticeHours" INTEGER NOT NULL DEFAULT 4,
  "defaultTimezone" TEXT NOT NULL DEFAULT 'Africa/Lagos',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "BookingSettings_pkey" PRIMARY KEY ("id")
);
