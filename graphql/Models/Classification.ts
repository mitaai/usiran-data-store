import { objectType } from 'nexus'

export const Classification = objectType({
  name: 'Classification',
  definition(t) {
    t.model.id()
    t.model.name()
    t.model.documentsWithClassification()
    t.model.createdAt()
    t.model.updatedAt()
  },
});
