import { objectType } from 'nexus'

export const Event = objectType({
  name: 'Event',
  definition(t) {
    t.model.id()
    t.model.eventIdSeq()
    t.model.eventTitle()
    t.model.eventStartDate()
    t.model.eventEndDate()
    t.model.eventTags()
    t.model.eventStakeholders()
    t.model.eventDescription()
    t.model.eventLocations()
  },
});
