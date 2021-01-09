# Migration `20200912201445-move-event-id-seq-into-event`

This migration has been generated by Ben Silverman at 9/12/2020, 2:14:45 PM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
ALTER TABLE "public"."Event" ADD COLUMN "eventIdSeq" SERIAL

DROP TABLE "public"."EventIdSeq"
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration 20200912194952-add-event-id-seq..20200912201445-move-event-id-seq-into-event
--- datamodel.dml
+++ datamodel.dml
@@ -4,9 +4,9 @@
 }
 datasource db {
   provider = "postgresql"
-  url = "***"
+  url = "***"
 }
 model RelayId {
   id      String @id
@@ -241,20 +241,17 @@
   eventEndDate              DateTime?
   eventStartDate            DateTime
   eventTitle                String
   id                        String                      @id
+  eventIdSeq                Int                         @default(autoincrement())
   updatedAt                 DateTime                    @default(now())
   briefingBooksMentionedIn  BriefingBookEvent[]
   documentsMentionedIn      DocumentEvent[]
   eventLocations            LocationOnEvent[]
   eventStakeholders         StakeholderEvent[]
   eventTags                 TagOnEvent[]
 }
-model EventIdSeq {
-  id      Int     @id @default(autoincrement())
-}
-
 model File {
   contentType               String
   createdAt                 DateTime                    @default(now())
   id                        String                      @id
```

