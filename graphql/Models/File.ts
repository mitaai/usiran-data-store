import { objectType } from 'nexus'

export const File = objectType({
  name: 'File',
  definition(t) {
    t.model.id()
    t.model.url()
    t.model.size()
    t.model.name()
    t.model.contentType()
  },
});
