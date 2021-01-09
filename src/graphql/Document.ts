import { objectType } from 'nexus'

export const Document = objectType({
  name: 'Document',
  definition(t) {
    t.model.id()
    t.model.documentTitle()
    t.model.documentCreationDate()
    t.model.documentKind()
    t.model.documentTags()
    t.model.mentionedStakeholders()
    t.model.documentAuthors()
    t.model.documentDescription()
    t.model.documentFiles()
    t.model.mentionedLocations()
    t.model.documentOriginalID()
    t.model.documentClassification()
    t.model.documentPublicationDate()
    t.model.documentTranscript()
    t.model.dnsaAbstract()
    t.model.dnsaCitation()
    t.model.dnsaCollection()
    t.model.dnsaFrom()
    t.model.dnsaItemNumber()
    t.model.dnsaOrigin()
    t.model.dnsaStakeholder()
    t.model.dnsaSubject()
    t.model.dnsaTo()
    t.model.dnsaURL()
  },
});
