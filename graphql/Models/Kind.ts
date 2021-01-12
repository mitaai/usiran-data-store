import { objectType } from 'nexus'

export const Kind = objectType({
  name: 'Kind',
  definition(t) {
    t.model.id()
    t.model.name()
    t.model.createdAt()
    t.model.updatedAt()
    t.model.documentsWithKind()
  },
});
