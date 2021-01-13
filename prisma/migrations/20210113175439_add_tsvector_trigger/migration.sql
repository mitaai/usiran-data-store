--Create function
CREATE FUNCTION ts_document_trigger() RETURNS trigger AS $$
begin
  new."documentTsVector" :=
     (setweight(to_tsvector('pg_catalog.english', coalesce(new."documentTitle",'')), 'A') ||
     setweight(to_tsvector('pg_catalog.english', coalesce(new."documentDescription",'')), 'B') ||
     setweight(to_tsvector('pg_catalog.english', coalesce(new."documentTranscript",'')), 'D'))::text;
  return new;
end
$$ LANGUAGE plpgsql;

--Create trigger
CREATE TRIGGER ts_document BEFORE INSERT OR UPDATE ON "Document" FOR EACH ROW EXECUTE PROCEDURE ts_document_trigger();


--Create function
CREATE FUNCTION ts_event_trigger() RETURNS trigger AS $$
begin
  new."eventTsVector" :=
     (setweight(to_tsvector('pg_catalog.english', coalesce(new."eventTitle",'')), 'A') ||
     setweight(to_tsvector('pg_catalog.english', coalesce(new."eventDescription",'')), 'B'))::text;
  return new;
end
$$ LANGUAGE plpgsql;

--Create trigger
CREATE TRIGGER ts_event BEFORE INSERT OR UPDATE ON "Event" FOR EACH ROW EXECUTE PROCEDURE ts_event_trigger();


--Create function
CREATE FUNCTION ts_stakeholder_trigger() RETURNS trigger AS $$
begin
  new."stakeholderTsVector" :=
     (setweight(to_tsvector('pg_catalog.english', coalesce(new."stakeholderFullName",'')), 'A') ||
     setweight(to_tsvector('pg_catalog.english', coalesce(new."stakeholderDescription",'')), 'B'))::text;
  return new;
end
$$ LANGUAGE plpgsql;

--Create trigger
CREATE TRIGGER ts_stakeholder BEFORE INSERT OR UPDATE ON "Stakeholder" FOR EACH ROW EXECUTE PROCEDURE ts_stakeholder_trigger();