import { extendType } from 'nexus';
import { Context } from '../../context';
import { userIsAdmin, userIsEditor } from '../util/authUtil'

export const deleteMutations  = extendType({
  type: 'Mutation',
  definition(t) {
    t.crud.deleteOneUser({
      authorize: (_root: any, _args: any, ctx: Context) => userIsAdmin(ctx)
    })
    t.crud.deleteOneDocument({
      async resolve(root, args, ctx, info, originalResolve) {
        await ctx.db.$queryRaw`DELETE FROM "BriefingBookDocument" WHERE "B" = '${args.where.id}';`
        await ctx.db.$queryRaw`DELETE FROM "ClassificationOnDocument" WHERE "B" = '${args.where.id}';`
        await ctx.db.$queryRaw`DELETE FROM "DocumentAuthor" WHERE "A" = '${args.where.id}';`
        await ctx.db.$queryRaw`DELETE FROM "DocumentEvent" WHERE "A" = '${args.where.id}';`
        await ctx.db.$queryRaw`DELETE FROM "DocumentFile" WHERE "A" = '${args.where.id}';`
        await ctx.db.$queryRaw`DELETE FROM "DocumentInvolvedStakeholder" WHERE "B" = '${args.where.id}';`
        await ctx.db.$queryRaw`DELETE FROM "DocumentLocation" WHERE "B" = '${args.where.id}';`
        await ctx.db.$queryRaw`DELETE FROM "KindOnDocument" WHERE "B" = '${args.where.id}';`
        await ctx.db.$queryRaw`DELETE FROM "TagOnDocument" WHERE "B" = '${args.where.id}';`
        const res = await originalResolve(root, args, ctx, info)
        return res
      },
      authorize: (_root: any, _args: any, ctx: Context) => userIsEditor(ctx)
    })
    t.crud.deleteOneEvent({
      async resolve(root, args, ctx, info, originalResolve) {
        await ctx.db.$queryRaw`DELETE FROM "BriefingBookEvent" WHERE "A" = '${args.where.id}';`
        await ctx.db.$queryRaw`DELETE FROM "DocumentEvent" WHERE "B" = '${args.where.id}';`
        await ctx.db.$queryRaw`DELETE FROM "LocationOnEvent" WHERE "B" = '${args.where.id}';`
        await ctx.db.$queryRaw`DELETE FROM "StakeholderEvent" WHERE "B" = '${args.where.id}';`
        await ctx.db.$queryRaw`DELETE FROM "TagOnEvent" WHERE "B" = '${args.where.id}';`
        const res = await originalResolve(root, args, ctx, info)
        return res
      },
      authorize: (_root: any, _args: any, ctx: Context) => userIsEditor(ctx)
    })
    t.crud.deleteOneLocation({
      async resolve(root, args, ctx, info, originalResolve) {
        await ctx.db.$queryRaw`DELETE FROM "DocumentLocation" WHERE "A" = '${args.where.id}';`
        await ctx.db.$queryRaw`DELETE FROM "LocationOnEvent" WHERE "A" = '${args.where.id}';`
        const res = await originalResolve(root, args, ctx, info)
        return res
      },
      authorize: (_root: any, _args: any, ctx: Context) => userIsEditor(ctx)
    })
    t.crud.deleteOneStakeholder({
      async resolve(root, args, ctx, info, originalResolve) {
        await ctx.db.$queryRaw`DELETE FROM "DocumentAuthor" WHERE "B" = '${args.where.id}';`
        await ctx.db.$queryRaw`DELETE FROM "DocumentInvolvedStakeholder" WHERE "A" = '${args.where.id}';`
        await ctx.db.$queryRaw`DELETE FROM "StakeholderBriefingBook" WHERE "A" = '${args.where.id}';`
        await ctx.db.$queryRaw`DELETE FROM "StakeholderEvent" WHERE "A" = '${args.where.id}';`
        const res = await originalResolve(root, args, ctx, info)
        return res
      },
      authorize: (_root: any, _args: any, ctx: Context) => userIsEditor(ctx)
    })
  }
})
