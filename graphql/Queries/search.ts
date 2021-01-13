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
        let documents;
        let events;
        let stakeholders;
        if (limit) {
          documents = await ctx.db.$queryRaw`
          SELECT id, "documentTitle", ts_rank_cd("documentTsVector"::tsvector, query) AS rank
          FROM "Document", plainto_tsquery('english', ${searchQuery}) query
          WHERE query @@ "documentTsVector"::tsvector
          ORDER BY rank DESC
          LIMIT ${limit};`

          events = await ctx.db.$queryRaw`
          SELECT id, "eventTitle", ts_rank_cd("eventTsVector"::tsvector, query) AS rank
          FROM "Event", plainto_tsquery('english', ${searchQuery}) query
          WHERE query @@ "eventTsVector"::tsvector
          ORDER BY rank DESC
          LIMIT ${limit};`

          stakeholders = await ctx.db.$queryRaw`
          SELECT id, "stakeholderFullName", ts_rank_cd("stakeholderTsVector"::tsvector, query) AS rank
          FROM "Stakeholder", plainto_tsquery('english', ${searchQuery}) query
          WHERE query @@ "stakeholderTsVector"::tsvector
          ORDER BY rank DESC
          LIMIT ${limit};`
        } else {
          documents = await ctx.db.$queryRaw`
          SELECT id, "documentTitle", ts_rank_cd("documentTsVector"::tsvector, query) AS rank
          FROM "Document", plainto_tsquery('english', ${searchQuery}) query
          WHERE query @@ "documentTsVector"::tsvector
          ORDER BY rank DESC;`

          events = await ctx.db.$queryRaw`
          SELECT id, "eventTitle", ts_rank_cd("eventTsVector"::tsvector, query) AS rank
          FROM "Event", plainto_tsquery('english', ${searchQuery}) query
          WHERE query @@ "eventTsVector"::tsvector
          ORDER BY rank DESC;`

          stakeholders = await ctx.db.$queryRaw`
          SELECT id, "stakeholderFullName", ts_rank_cd("stakeholderTsVector"::tsvector, query) AS rank
          FROM "Stakeholder", plainto_tsquery('english', ${searchQuery}) query
          WHERE query @@ "stakeholderTsVector"::tsvector
          ORDER BY rank DESC;`
        }
        return {
          documents,
          events,
          stakeholders,
        }
      },
    })
    t.int('searchQueryDocumentsCount', {
      args: {
        searchQuery: nonNull(stringArg()),
      },
      resolve: async (_parent, { searchQuery }, ctx) => {
        const count = await ctx.db.$executeRaw`
        SELECT id
        FROM "Document", plainto_tsquery('english', ${searchQuery}) query
        WHERE query @@ "documentTsVector"::tsvector;`;
        return count;
      },
    })
    t.int('searchQueryEventsCount', {
      args: {
        searchQuery: nonNull(stringArg()),
      },
      resolve: async (_parent, { searchQuery }, ctx) => {
        const count = await ctx.db.$executeRaw`
        SELECT id
        FROM "Event", plainto_tsquery('english', ${searchQuery}) query
        WHERE query @@ "eventTsVector"::tsvector;`;
        return count;
      },
    })
    t.int('searchQueryStakeholdersCount', {
      args: {
        searchQuery: nonNull(stringArg()),
      },
      resolve: async (_parent, { searchQuery }, ctx) => {
        const count = await ctx.db.$executeRaw`
        SELECT id
        FROM "Stakeholder", plainto_tsquery('english', ${searchQuery}) query
        WHERE query @@ "stakeholderTsVector"::tsvector;`;
        return count;
      },
    })
  }
})