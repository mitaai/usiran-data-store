-- CreateTable
CREATE TABLE "_RelayId" (
    "id" TEXT NOT NULL,
    "modelId" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BriefingBook" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "briefingBookDescription" TEXT,
    "briefingBookTitle" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BriefingBookDocument" (
    "id" TEXT NOT NULL,
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BriefingBookEvent" (
    "id" TEXT NOT NULL,
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClassificationOnDocument" (
    "id" TEXT NOT NULL,
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DocumentAuthor" (
    "id" TEXT NOT NULL,
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DocumentEvent" (
    "id" TEXT NOT NULL,
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DocumentFile" (
    "id" TEXT NOT NULL,
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DocumentInvolvedStakeholder" (
    "id" TEXT NOT NULL,
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DocumentLocation" (
    "id" TEXT NOT NULL,
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "KindOnDocument" (
    "id" TEXT NOT NULL,
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LocationOnEvent" (
    "id" TEXT NOT NULL,
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StakeholderBriefingBook" (
    "id" TEXT NOT NULL,
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StakeholderEvent" (
    "id" TEXT NOT NULL,
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TagOnDocument" (
    "id" TEXT NOT NULL,
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TagOnEvent" (
    "id" TEXT NOT NULL,
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Classification" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Document" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dnsaAbstract" TEXT,
    "dnsaCitation" TEXT,
    "dnsaCollection" TEXT,
    "dnsaFrom" TEXT,
    "dnsaItemNumber" TEXT,
    "dnsaOrigin" TEXT,
    "dnsaStakeholder" TEXT,
    "dnsaSubject" TEXT,
    "dnsaTo" TEXT,
    "dnsaURL" TEXT,
    "documentCreationDate" TIMESTAMP(3),
    "documentDescription" TEXT,
    "documentMediaType" TEXT NOT NULL DEFAULT E'RawText',
    "documentOriginalID" TEXT NOT NULL,
    "documentPublicationDate" TIMESTAMP(3),
    "documentTitle" TEXT NOT NULL,
    "documentTranscript" TEXT,
    "sessionNumber" INTEGER,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Event" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "eventDescription" TEXT,
    "eventEndDate" TIMESTAMP(3),
    "eventStartDate" TIMESTAMP(3) NOT NULL,
    "eventTitle" TEXT NOT NULL,
"eventIdSeq" SERIAL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "File" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "contentType" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "secret" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "url" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Kind" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Location" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "locationDescription" TEXT,
    "locationLatitude" INTEGER,
    "locationLongitude" INTEGER,
    "locationName" TEXT NOT NULL,
    "locationWikipediaUri" TEXT,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Stakeholder" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isStakeholderInstitution" INTEGER NOT NULL DEFAULT 0,
    "stakeholderDescription" TEXT,
    "stakeholderFullName" TEXT NOT NULL,
    "stakeholderWikipediaUri" TEXT,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tag" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "description" TEXT,
    "name" TEXT NOT NULL,
    "tagWikipediaUri" TEXT,
    "type" TEXT,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "email" TEXT,
    "firstName" TEXT,
    "lastName" TEXT,
    "password" TEXT,
    "role" TEXT,
    "userName" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BriefingBook.briefingBookTitle_unique" ON "BriefingBook"("briefingBookTitle");

-- CreateIndex
CREATE UNIQUE INDEX "BriefingBookDocument_AB_unique" ON "BriefingBookDocument"("A", "B");

-- CreateIndex
CREATE INDEX "BriefingBookDocument_BriefingBookId" ON "BriefingBookDocument"("A");

-- CreateIndex
CREATE INDEX "BriefingBookDocument_DocumentId" ON "BriefingBookDocument"("B");

-- CreateIndex
CREATE UNIQUE INDEX "BriefingBookEvent_AB_unique" ON "BriefingBookEvent"("A", "B");

-- CreateIndex
CREATE INDEX "BriefingBookEvent_BriefingBookId" ON "BriefingBookEvent"("B");

-- CreateIndex
CREATE INDEX "BriefingBookEvent_EventId" ON "BriefingBookEvent"("A");

-- CreateIndex
CREATE UNIQUE INDEX "ClassificationOnDocument_AB_unique" ON "ClassificationOnDocument"("A", "B");

-- CreateIndex
CREATE INDEX "ClassificationOnDocument_ClassificationId" ON "ClassificationOnDocument"("A");

-- CreateIndex
CREATE INDEX "ClassificationOnDocument_DocumentId" ON "ClassificationOnDocument"("B");

-- CreateIndex
CREATE UNIQUE INDEX "DocumentAuthor_AB_unique" ON "DocumentAuthor"("A", "B");

-- CreateIndex
CREATE INDEX "DocumentAuthor_DocumentId" ON "DocumentAuthor"("A");

-- CreateIndex
CREATE INDEX "DocumentAuthor_StakeholderId" ON "DocumentAuthor"("B");

-- CreateIndex
CREATE UNIQUE INDEX "DocumentEvent_AB_unique" ON "DocumentEvent"("A", "B");

-- CreateIndex
CREATE INDEX "DocumentEvent_DocumentId" ON "DocumentEvent"("A");

-- CreateIndex
CREATE INDEX "DocumentEvent_EventId" ON "DocumentEvent"("B");

-- CreateIndex
CREATE UNIQUE INDEX "DocumentFile_AB_unique" ON "DocumentFile"("A", "B");

-- CreateIndex
CREATE INDEX "DocumentFile_DocumentId" ON "DocumentFile"("A");

-- CreateIndex
CREATE INDEX "DocumentFile_FileId" ON "DocumentFile"("B");

-- CreateIndex
CREATE UNIQUE INDEX "DocumentInvolvedStakeholder_AB_unique" ON "DocumentInvolvedStakeholder"("A", "B");

-- CreateIndex
CREATE INDEX "DocumentInvolvedStakeholder_DocumentId" ON "DocumentInvolvedStakeholder"("B");

-- CreateIndex
CREATE INDEX "DocumentInvolvedStakeholder_StakeholderId" ON "DocumentInvolvedStakeholder"("A");

-- CreateIndex
CREATE UNIQUE INDEX "DocumentLocation_AB_unique" ON "DocumentLocation"("A", "B");

-- CreateIndex
CREATE INDEX "DocumentLocation_DocumentId" ON "DocumentLocation"("B");

-- CreateIndex
CREATE INDEX "DocumentLocation_LocationId" ON "DocumentLocation"("A");

-- CreateIndex
CREATE UNIQUE INDEX "KindOnDocument_AB_unique" ON "KindOnDocument"("A", "B");

-- CreateIndex
CREATE INDEX "KindOnDocument_DocumentId" ON "KindOnDocument"("B");

-- CreateIndex
CREATE INDEX "KindOnDocument_KindId" ON "KindOnDocument"("A");

-- CreateIndex
CREATE UNIQUE INDEX "LocationOnEvent_AB_unique" ON "LocationOnEvent"("A", "B");

-- CreateIndex
CREATE INDEX "LocationOnEvent_EventId" ON "LocationOnEvent"("B");

-- CreateIndex
CREATE INDEX "LocationOnEvent_LocationId" ON "LocationOnEvent"("A");

-- CreateIndex
CREATE UNIQUE INDEX "StakeholderBriefingBook_AB_unique" ON "StakeholderBriefingBook"("A", "B");

-- CreateIndex
CREATE INDEX "StakeholderBriefingBook_BriefingBookId" ON "StakeholderBriefingBook"("B");

-- CreateIndex
CREATE INDEX "StakeholderBriefingBook_StakeholderId" ON "StakeholderBriefingBook"("A");

-- CreateIndex
CREATE UNIQUE INDEX "StakeholderEvent_AB_unique" ON "StakeholderEvent"("A", "B");

-- CreateIndex
CREATE INDEX "StakeholderEvent_EventId" ON "StakeholderEvent"("B");

-- CreateIndex
CREATE INDEX "StakeholderEvent_StakeholderId" ON "StakeholderEvent"("A");

-- CreateIndex
CREATE UNIQUE INDEX "TagOnDocument_AB_unique" ON "TagOnDocument"("A", "B");

-- CreateIndex
CREATE INDEX "TagOnDocument_DocumentId" ON "TagOnDocument"("B");

-- CreateIndex
CREATE INDEX "TagOnDocument_TagId" ON "TagOnDocument"("A");

-- CreateIndex
CREATE UNIQUE INDEX "TagOnEvent_AB_unique" ON "TagOnEvent"("A", "B");

-- CreateIndex
CREATE INDEX "TagOnEvent_EventId" ON "TagOnEvent"("B");

-- CreateIndex
CREATE INDEX "TagOnEvent_TagId" ON "TagOnEvent"("A");

-- CreateIndex
CREATE UNIQUE INDEX "Classification.name_unique" ON "Classification"("name");

-- CreateIndex
CREATE UNIQUE INDEX "File.secret_unique" ON "File"("secret");

-- CreateIndex
CREATE UNIQUE INDEX "File.url_unique" ON "File"("url");

-- CreateIndex
CREATE UNIQUE INDEX "Kind.name_unique" ON "Kind"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Location.locationName_unique" ON "Location"("locationName");

-- CreateIndex
CREATE UNIQUE INDEX "Stakeholder.stakeholderFullName_unique" ON "Stakeholder"("stakeholderFullName");

-- CreateIndex
CREATE UNIQUE INDEX "Tag.name_unique" ON "Tag"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Tag.tagWikipediaUri_unique" ON "Tag"("tagWikipediaUri");

-- CreateIndex
CREATE UNIQUE INDEX "User.email_unique" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User.userName_unique" ON "User"("userName");

-- AddForeignKey
ALTER TABLE "BriefingBookDocument" ADD FOREIGN KEY("A")REFERENCES "BriefingBook"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BriefingBookDocument" ADD FOREIGN KEY("B")REFERENCES "Document"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BriefingBookEvent" ADD FOREIGN KEY("A")REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BriefingBookEvent" ADD FOREIGN KEY("B")REFERENCES "BriefingBook"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClassificationOnDocument" ADD FOREIGN KEY("A")REFERENCES "Classification"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClassificationOnDocument" ADD FOREIGN KEY("B")REFERENCES "Document"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DocumentAuthor" ADD FOREIGN KEY("A")REFERENCES "Document"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DocumentAuthor" ADD FOREIGN KEY("B")REFERENCES "Stakeholder"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DocumentEvent" ADD FOREIGN KEY("A")REFERENCES "Document"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DocumentEvent" ADD FOREIGN KEY("B")REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DocumentFile" ADD FOREIGN KEY("A")REFERENCES "Document"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DocumentFile" ADD FOREIGN KEY("B")REFERENCES "File"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DocumentInvolvedStakeholder" ADD FOREIGN KEY("A")REFERENCES "Stakeholder"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DocumentInvolvedStakeholder" ADD FOREIGN KEY("B")REFERENCES "Document"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DocumentLocation" ADD FOREIGN KEY("A")REFERENCES "Location"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DocumentLocation" ADD FOREIGN KEY("B")REFERENCES "Document"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KindOnDocument" ADD FOREIGN KEY("A")REFERENCES "Kind"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KindOnDocument" ADD FOREIGN KEY("B")REFERENCES "Document"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LocationOnEvent" ADD FOREIGN KEY("A")REFERENCES "Location"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LocationOnEvent" ADD FOREIGN KEY("B")REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StakeholderBriefingBook" ADD FOREIGN KEY("A")REFERENCES "Stakeholder"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StakeholderBriefingBook" ADD FOREIGN KEY("B")REFERENCES "BriefingBook"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StakeholderEvent" ADD FOREIGN KEY("A")REFERENCES "Stakeholder"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StakeholderEvent" ADD FOREIGN KEY("B")REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TagOnDocument" ADD FOREIGN KEY("A")REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TagOnDocument" ADD FOREIGN KEY("B")REFERENCES "Document"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TagOnEvent" ADD FOREIGN KEY("A")REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TagOnEvent" ADD FOREIGN KEY("B")REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;
