-- Google Calendar / Meet fields for booking requests
ALTER TABLE "BookingRequest"
  ADD COLUMN IF NOT EXISTS "googleCalendarEventId" TEXT,
  ADD COLUMN IF NOT EXISTS "googleMeetLink" TEXT;

CREATE INDEX IF NOT EXISTS "BookingRequest_googleCalendarEventId_idx" ON "BookingRequest"("googleCalendarEventId");
