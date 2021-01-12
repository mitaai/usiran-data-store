import { extendType } from 'nexus'
import { Prisma } from '@prisma/client';

export const countQueries = extendType({
  type: 'Query',
  definition(t) {
    t.int('documentsCount', {
      args: {
        where: "DocumentWhereInput",
      },
      async resolve(_parent, args, ctx) {
        const result = await ctx.db.document.count(args as Prisma.FindManyDocumentArgs);
        return result;
      }
    })
    t.int('eventsCount', {
        args: {
        where: "EventWhereInput",
      },
      async resolve(_parent, args, ctx) {
        const result = await ctx.db.event.count(args as Prisma.FindManyEventArgs);
        return result;
      }
    })
    t.int('stakeholdersCount', {
        args: {
        where: "StakeholderWhereInput",
      },
      async resolve(_parent, args, ctx) {
        const result = await ctx.db.stakeholder.count(args as Prisma.FindManyStakeholderArgs);
        return result;
      }
    })
  },
})
