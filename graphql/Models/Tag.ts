import { objectType } from 'nexus'

export const Tag = objectType({
  name: 'Tag',
  definition(t) {
    t.model.id()
    t.model.name()
    t.model.description()
    t.model.tagWikipediaUri()
    t.model.documentsWithTag()
    t.model.eventsWithTag()
    t.model.type()
    t.model.createdAt()
    t.model.updatedAt()
  },
});
