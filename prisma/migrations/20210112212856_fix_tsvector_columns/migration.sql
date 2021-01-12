-- Update
UPDATE "Document" SET "documentTsVector" = 
    (setweight(to_tsvector(coalesce("documentTitle",'')), 'A')    ||
    setweight(to_tsvector(coalesce("documentDescription",'')), 'B')  ||
    setweight(to_tsvector(coalesce("documentTranscript",'')), 'C'))::TEXT;

-- Update
UPDATE "Event" SET "eventTsVector" = 
    (setweight(to_tsvector(coalesce("eventTitle",'')), 'A')    ||
    setweight(to_tsvector(coalesce("eventDescription",'')), 'B'))::TEXT;

-- Update
UPDATE "Stakeholder" SET "stakeholderTsVector" = 
    (setweight(to_tsvector(coalesce("stakeholderFullName",'')), 'A')    ||
    setweight(to_tsvector(coalesce("stakeholderDescription",'')), 'B'))::TEXT;