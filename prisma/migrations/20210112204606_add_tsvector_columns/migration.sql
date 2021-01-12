-- AlterTable
ALTER TABLE "Document" ADD COLUMN     "documentTsVector" TEXT;

-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "eventTsVector" TEXT;

-- AlterTable
ALTER TABLE "Stakeholder" ADD COLUMN     "stakeholderTsVector" TEXT;
