import { objectType } from 'nexus'
import { model } from './helper'

export const Document = objectType({
  name: 'Document',
  definition(t) {
    model(t).id()
    model(t).documentTitle()
    model(t).documentCreationDate()
    model(t).documentKind()
    model(t).documentTags()
    model(t).mentionedStakeholders()
    model(t).documentAuthors()
    model(t).documentDescription()
    model(t).documentFiles()
    model(t).mentionedLocations()
    model(t).documentOriginalID()
    model(t).documentClassification()
    model(t).documentPublicationDate()
    model(t).documentTranscript()
    model(t).dnsaAbstract()
    model(t).dnsaCitation()
    model(t).dnsaCollection()
    model(t).dnsaFrom()
    model(t).dnsaItemNumber()
    model(t).dnsaOrigin()
    model(t).dnsaStakeholder()
    model(t).dnsaSubject()
    model(t).dnsaTo()
    model(t).dnsaURL()
  },
});
