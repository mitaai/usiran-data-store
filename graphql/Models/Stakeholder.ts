import { objectType } from 'nexus'

export const Stakeholder = objectType({
  name: 'Stakeholder',
  definition(t) {
    t.model.id()
    t.model.stakeholderFullName()
    t.model.stakeholderDescription()
    t.model.documents()
    t.model.documentsMentionedIn()
    t.model.eventsInvolvedIn()
    t.model.stakeholderWikipediaUri()
    t.model.isStakeholderInstitution()
  },
});
