-- CreateEnum
CREATE TYPE "LibraryCategory" AS ENUM ('OPERATIONS', 'MARKETING', 'AUTOMATION', 'OTHER');

-- AlterTable
ALTER TABLE "LibraryItem" ADD COLUMN     "category" "LibraryCategory" NOT NULL DEFAULT 'OTHER';
