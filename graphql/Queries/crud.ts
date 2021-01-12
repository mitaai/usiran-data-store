import { extendType } from 'nexus'

export const crudQueries = extendType({
  type: 'Query',
  definition(t) {
    t.crud.user()
    t.crud.users({
      pagination: true,
      filtering: true,
      ordering: true,
    })
    t.crud.document()
    t.crud.documents({
      pagination: true,
      filtering: true,
      ordering: true,
    })
    t.crud.event()
    t.crud.events({
      pagination: true,
      filtering: true,
      ordering: true,
    })
    t.crud.stakeholder()
    t.crud.stakeholders({
      pagination: true,
      filtering: true,
      ordering: true,
    })
    t.crud.location()
    t.crud.locations({
      pagination: true,
      filtering: true,
      ordering: true,
    })
    t.crud.file()
    t.crud.files({
      pagination: true,
      filtering: true,
      ordering: true,
    })
    t.crud.kind()
    t.crud.kinds({
      pagination: true,
      filtering: true,
      ordering: true,
    })
    t.crud.kindOnDocument()
    t.crud.kindOnDocuments({
      pagination: true,
      filtering: true,
      ordering: true,
    })
    t.crud.tag()
    t.crud.tags({
      pagination: true,
      filtering: true,
      ordering: true,
    })
    t.crud.briefingBook()
    t.crud.briefingBooks({
      pagination: true,
      filtering: true,
      ordering: true,
    })
  }
})