import { objectType } from 'nexus'

export const BriefingBookDocument = objectType({
  name: 'BriefingBookDocument',
  definition(t) {
    t.model.id()
    t.model.A({alias:"BriefingBookId"})
    t.model.B({alias:"DocumentId"})
    t.model.BriefingBook()
    t.model.Document()
  }
})

export const BriefingBookEvent = objectType({
  name: 'BriefingBookEvent',
  definition(t){
    t.model.id()
    t.model.A({alias:"EventId"})
    t.model.B({alias:"BriefingBookId"})
    t.model.Event()
    t.model.BriefingBook()
  }
})

export const ClassificationOnDocument = objectType({
  name: 'ClassificationOnDocument',
  definition(t) {
    t.model.id()
    t.model.A({alias:"ClassificationId"})
    t.model.B({alias:"DocumentId"})
    t.model.Classification()
    t.model.Document()
  }
})

export const DocumentAuthor = objectType({
  name: 'DocumentAuthor',
  definition(t){
    t.model.id()
    t.model.A({alias:"DocumentId"})
    t.model.B({alias:"StakeholderId"})
    t.model.Document()
    t.model.Stakeholder()
  }
})

export const DocumentEvent = objectType({
  name: 'DocumentEvent',
  definition(t) {
    t.model.id()
    t.model.A({alias:"DocumentId"})
    t.model.B({alias:"EventId"})
    t.model.Document()
    t.model.Event()
  }
})

export const DocumentFile = objectType({
  name: 'DocumentFile',
  definition(t){
    t.model.id()
    t.model.A({alias:"DocumentId"})
    t.model.B({alias:"FileId"})
    t.model.Document()
    t.model.File()
  }
})

export const DocumentInvolvedStakeholder = objectType({
  name: 'DocumentInvolvedStakeholder',
  definition(t) {
    t.model.id()
    t.model.A({alias:"StakeholderId"})
    t.model.B({alias:"DocumentId"})
    t.model.Stakeholder()
    t.model.Document()
  }
})

export const DocumentLocation = objectType({
  name: 'DocumentLocation',
  definition(t){
    t.model.id()
    t.model.A({alias:"LocationId"})
    t.model.B({alias:"DocumentId"})
    t.model.Location()
    t.model.Document()
  }
})

export const KindOnDocument = objectType({
  name: 'KindOnDocument',
  definition(t) {
    t.model.id()
    t.model.A({alias:"KindId"})
    t.model.B({alias:"DocumentId"})
    t.model.Kind()
    t.model.Document()
  }
})

export const LocationOnEvent = objectType({
  name: 'LocationOnEvent',
  definition(t) {
    t.model.id()
    t.model.A({alias: "LocationId"})
    t.model.B({alias: "EventId"})
    t.model.Location()
    t.model.Event()
  }
})

export const StakeholderBriefingBook = objectType({
  name: 'StakeholderBriefingBook',
  definition(t){
    t.model.id()
    t.model.A({alias: "StakeholderId"})
    t.model.B({alias: "BriefingBookId"})
    t.model.Stakeholder()
    t.model.BriefingBook()
  }
})

export const StakeholderEvent = objectType({
  name: 'StakeholderEvent',
  definition(t){
    t.model.id()
    t.model.A({alias: "StakeholderId"})
    t.model.B({alias: "EventId"})
    t.model.Stakeholder()
    t.model.Event()
  }
})

export const TagOnDocument = objectType({
  name: 'TagOnDocument',
  definition(t){
    t.model.id()
    t.model.A({alias:"TagId"})
    t.model.B({alias:"DocumentId"})
    t.model.Tag()
    t.model.Document()
  }
})

export const TagOnEvent = objectType({
  name: 'TagOnEvent',
  definition(t){
    t.model.id()
    t.model.A({alias: "TagId"})
    t.model.B({alias: "EventId"})
    t.model.Tag()
    t.model.Event()
  }
})
