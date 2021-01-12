import { objectType } from 'nexus'

export const Location = objectType({
  name: 'Location',
  definition(t) {
    t.model.id()
    t.model.locationName()
    t.model.locationDescription()
    t.model.documentsMentionedIn()
    t.model.locationEvents()
    t.model.locationWikipediaUri()
  },
});
