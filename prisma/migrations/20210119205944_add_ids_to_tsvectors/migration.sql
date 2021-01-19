-- Update
UPDATE "Document" SET "documentTsVector" = 
    (setweight(to_tsvector(coalesce("documentTitle",'')), 'A')       ||
    setweight(to_tsvector(coalesce("documentDescription",'')), 'B')  ||
    setweight(to_tsvector(coalesce("id",'')), 'C')                   ||
    setweight(to_tsvector(coalesce("documentTranscript",'')), 'D'))::TEXT;

-- Update
UPDATE "Event" SET "eventTsVector" = 
    (setweight(to_tsvector(coalesce("eventTitle",'')), 'A')      ||
    setweight(to_tsvector(coalesce("eventDescription",'')), 'B') ||
    setweight(to_tsvector(coalesce("id",'')), 'C'))::TEXT;


--Create or replace function
CREATE OR REPLACE FUNCTION ts_document_trigger() RETURNS trigger AS $$
begin
  new."documentTsVector" :=
     (setweight(to_tsvector('pg_catalog.english', coalesce(new."documentTitle",'')), 'A') ||
     setweight(to_tsvector('pg_catalog.english', coalesce(new."documentDescription",'')), 'B') ||
     setweight(to_tsvector('pg_catalog.english', coalesce(new."id",'')), 'C') ||
     setweight(to_tsvector('pg_catalog.english', coalesce(new."documentTranscript",'')), 'D'))::text;
  return new;
end
$$ LANGUAGE plpgsql;

--Drop trigger
DROP TRIGGER IF EXISTS ts_document ON "Document";
--Create trigger
CREATE TRIGGER ts_document BEFORE INSERT OR UPDATE ON "Document" FOR EACH ROW EXECUTE PROCEDURE ts_document_trigger();


--Create or replace function
CREATE OR REPLACE FUNCTION ts_event_trigger() RETURNS trigger AS $$
begin
  new."eventTsVector" :=
     (setweight(to_tsvector('pg_catalog.english', coalesce(new."eventTitle",'')), 'A')      ||
     setweight(to_tsvector('pg_catalog.english', coalesce(new."eventDescription",'')), 'B') ||
     setweight(to_tsvector('pg_catalog.english', coalesce(new."id",'')), 'C'))::text;
  return new;
end
$$ LANGUAGE plpgsql;

--Drop trigger
DROP TRIGGER IF EXISTS ts_event ON "Event";

--Create trigger
CREATE TRIGGER ts_event BEFORE INSERT OR UPDATE ON "Event" FOR EACH ROW EXECUTE PROCEDURE ts_event_trigger();
