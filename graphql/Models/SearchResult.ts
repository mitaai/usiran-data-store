import { list, nonNull, objectType } from 'nexus'

export const SearchResult = objectType({
  name: 'SearchResult',
  definition(t){
    t.field('documents', {
      type: nonNull(list(nonNull('Document'))),
    })
    t.field('events', {
      type: nonNull(list(nonNull('Event'))),
    })
    t.field('stakeholders', {
      type: nonNull(list(nonNull('Stakeholder'))),
    })
  },
});
