import { extendType } from 'nexus';
import { Context } from '../../context';
import { userIsAdmin, userIsEditor } from '../util/authUtil'

export const updateMutations  = extendType({
  type: 'Mutation',
  definition(t) {
    t.crud.updateOneUser({
      authorize: (_root: any, _args: any, ctx: Context) => userIsAdmin(ctx)
    })
    t.crud.updateOneDocument({
      async resolve(root, args, ctx, info, originalResolve) {
        if(args.data.documentKind) await ctx.db.$queryRaw`DELETE FROM "KindOnDocument" WHERE "B" = '${args.where.id}';`
        if(args.data.documentClassification) await ctx.db.$queryRaw`DELETE FROM "ClassificationOnDocument" WHERE "B" = '${args.where.id}';`
        if(args.data.documentTags) await ctx.db.$queryRaw`DELETE FROM "TagOnDocument" WHERE "B" = '${args.where.id}';`
        if(args.data.documentAuthors) await ctx.db.$queryRaw`DELETE FROM "DocumentAuthor" WHERE "A" = '${args.where.id}';`
        if(args.data.mentionedStakeholders) await ctx.db.$queryRaw`DELETE FROM "DocumentInvolvedStakeholder" WHERE "B" = '${args.where.id}';`
        if(args.data.mentionedLocations) await ctx.db.$queryRaw`DELETE FROM "DocumentLocation" WHERE "B" = '${args.where.id}';`;
        const res = await originalResolve(root, args, ctx, info)
        return res
      },
      authorize: (_root: any, _args: any, ctx: Context) => userIsEditor(ctx)
    })
    t.crud.updateOneEvent({
      async resolve(root, args, ctx, info, originalResolve) {
        if(args.data.eventTags) await ctx.db.$queryRaw`DELETE FROM "TagOnEvent" WHERE "B" = '${args.where.id}';`
        if(args.data.eventStakeholders) await ctx.db.$queryRaw`DELETE FROM "StakeholderEvent" WHERE "B" = '${args.where.id}';`
        if(args.data.eventLocations) await ctx.db.$queryRaw`DELETE FROM "LocationOnEvent" WHERE "B" = '${args.where.id}';`
        const res = await originalResolve(root, args, ctx, info)
        return res
      },
      authorize: (_root: any, _args: any, ctx: Context) => userIsEditor(ctx)
    })
    t.crud.updateOneStakeholder({
      async resolve(root, args, ctx, info, originalResolve) {
        if(args.data.documentsMentionedIn) await ctx.db.$queryRaw`DELETE FROM "DocumentInvolvedStakeholder" WHERE "A" = '${args.where.id}';`
        if(args.data.documents) await ctx.db.$queryRaw`DELETE FROM "DocumentAuthor" WHERE "B" = '${args.where.id}';`
        if(args.data.eventsInvolvedIn) await ctx.db.$queryRaw`DELETE FROM "StakeholderEvent" WHERE "A" = '${args.where.id}';`
        const res = await originalResolve(root, args, ctx, info)
        return res
      },
      authorize: (_root: any, _args: any, ctx: Context) => userIsEditor(ctx)
    })
    t.crud.updateOneLocation({
      async resolve(root, args, ctx, info, originalResolve) {
        if(args.data.documentsMentionedIn) await ctx.db.$queryRaw`DELETE FROM "DocumentLocation" WHERE "A" = '${args.where.id}';`
        if(args.data.locationEvents) await ctx.db.$queryRaw`DELETE FROM "LocationOnEvent" WHERE "A" = '${args.where.id}';`
        const res = await originalResolve(root, args, ctx, info)
        return res
      },
      authorize: (_root: any, _args: any, ctx: Context) => userIsEditor(ctx)
    })
  },
})
