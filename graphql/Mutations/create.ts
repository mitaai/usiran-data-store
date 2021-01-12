import { stringArg, nonNull, extendType } from 'nexus';
import bcrypt from 'bcrypt';
import { Context } from '../../context';
import { sign, Secret } from 'jsonwebtoken';
import { userIsEditor } from '../util/authUtil'

export const createMutations = extendType({
  type: 'Mutation',
  definition(t) {
    t.crud.createOneDocument({
      authorize: (_root: any, _args: any, ctx: Context) => userIsEditor(ctx)
    })
    t.crud.createOneEvent({
      async resolve(root, args, ctx, info, originalResolve) {
        const res = await originalResolve(root, args, ctx, info)
        const id = `9-${(res.eventIdSeq as number) - 1573}`;
        const newRes = await ctx.db.event.update({
          where: {
            id: res.id as string,
          },
          data: {
            id: { set: id },
          },
        })
        return newRes
      },
      authorize: (_root: any, _args: any, ctx: Context) => userIsEditor(ctx)
    })
    t.crud.createOneLocation({
      authorize: (_root: any, _args: any, ctx: Context) => userIsEditor(ctx)
    })
    t.crud.createOneStakeholder({
      authorize: (_root: any, _args: any, ctx: Context) => userIsEditor(ctx)
    })
    t.crud.createOneTag({
      authorize: (_root: any, _args: any, ctx: Context) => userIsEditor(ctx)
    })
    t.crud.createOneFile({
      authorize: (_root: any, _args: any, ctx: Context) => userIsEditor(ctx)
    })

    t.crud.createOneClassificationOnDocument({
      authorize: (_root: any, _args: any, ctx: Context) => userIsEditor(ctx)
    })
    t.crud.createOneDocumentAuthor({
      authorize: (_root: any, _args: any, ctx: Context) => userIsEditor(ctx)
    })
    t.crud.createOneDocumentEvent({
      authorize: (_root: any, _args: any, ctx: Context) => userIsEditor(ctx)
    })
    t.crud.createOneDocumentFile({
      authorize: (_root: any, _args: any, ctx: Context) => userIsEditor(ctx)
    })
    t.crud.createOneDocumentInvolvedStakeholder({
      authorize: (_root: any, _args: any, ctx: Context) => userIsEditor(ctx)
    })
    t.crud.createOneDocumentLocation({
      authorize: (_root: any, _args: any, ctx: Context) => userIsEditor(ctx)
    })
    t.crud.createOneKindOnDocument({
      authorize: (_root: any, _args: any, ctx: Context) => userIsEditor(ctx)
    })
    t.crud.createOneLocationOnEvent({
      authorize: (_root: any, _args: any, ctx: Context) => userIsEditor(ctx)
    })
    t.crud.createOneStakeholderEvent({
      authorize: (_root: any, _args: any, ctx: Context) => userIsEditor(ctx)
    })
    t.crud.createOneTagOnDocument({
      authorize: (_root: any, _args: any, ctx: Context) => userIsEditor(ctx)
    })
    t.crud.createOneTagOnEvent({
      authorize: (_root: any, _args: any, ctx: Context) => userIsEditor(ctx)
    })

    t.field('createUser', {
      type: 'UserAuthPayload',
      args: {
        userName: stringArg(),
        email: nonNull(stringArg()),
        password: nonNull(stringArg()),
        role: nonNull(stringArg()),
      },
      resolve: async (_parent, { userName, email, password, role }, ctx) => {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await ctx.db.user.create({
          data: {
            userName: userName as string,
            email,
            password: hashedPassword,
            role,
          },
        })
        return {
          token: sign({ userId: user.id }, process.env.AUTH_SECRET as Secret),
          user,
        }
      },
    })
  },
})

