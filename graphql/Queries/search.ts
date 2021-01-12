import { extendType, intArg, nonNull, stringArg } from 'nexus'

export const searchQueries = extendType({
  type: 'Query',
  definition(t) {
    t.field('searchQuery', {
      type: 'SearchResult',
      args: {
        searchQuery: nonNull(stringArg()),
        limit: intArg()
      },
      resolve: async (_parent, { searchQuery, limit }, ctx) => {

        const documents = await ctx.db.$queryRaw`
        SELECT id, "documentTitle", ts_rank_cd("documentTsVector"::tsvector, query) AS rank
        FROM "Document", plainto_tsquery('english', ${searchQuery}) query
        WHERE query @@ "documentTsVector"::tsvector
        ORDER BY rank DESC
        ${limit ? `LIMIT ${limit}` : ''};`

        const events = await ctx.db.$queryRaw`
        SELECT id, "eventTitle", ts_rank_cd("eventTsVector"::tsvector, query) AS rank
        FROM "Event", plainto_tsquery('english', ${searchQuery}) query
        WHERE query @@ "eventTsVector"::tsvector
        ORDER BY rank DESC
        ${limit ? `LIMIT ${limit}` : ''};`

        const stakeholders = await ctx.db.$queryRaw`
        SELECT id, "stakeholderFullName", ts_rank_cd("stakeholderTsVector"::tsvector, query) AS rank
        FROM "Stakeholder", plainto_tsquery('english', ${searchQuery}) query
        WHERE query @@ "stakeholderTsVector"::tsvector
        ORDER BY rank DESC
        ${limit ? `LIMIT ${limit}` : ''};`

        return {
          documents,
          events,
          stakeholders,
        }
      },
    })
  }
})