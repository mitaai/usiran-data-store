import { objectType } from 'nexus';

export const BriefingBook = objectType({
  name: 'BriefingBook',
  definition(t) {
    t.model.id()
    t.model.briefingBookDescription()
    t.model.briefingBookTitle()
    t.model.mentionedDocuments()
    t.model.mentionedEvents()
    t.model.mentionedStakeholders()
    t.model.createdAt()
    t.model.updatedAt()
  },
});
