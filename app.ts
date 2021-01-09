import cors from 'cors';
import { makeSchema } from 'nexus'
import { nexusPrisma } from 'nexus-plugin-prisma'
import { arg, stringArg } from 'nexus';
import bcrypt from 'bcrypt';
import { sign, verify } from 'jsonwebtoken';


// Authentication and authorization logic

interface JWTData {
  id: string;
}
const isJWTData = (input: object | string): input is JWTData => { return typeof input === "object" && "id" in input; };  

function getUserId(context) {
  const Authorization = context.req.get('Authorization')
  if (Authorization) {
    const token = Authorization.replace('Bearer ', '')
    const verified = verify(token, process.env.AUTH_SECRET)
    if(isJWTData(verified)) {
      const { id } = verified
      return id
    } throw new Error(`JWT Data invalid: ${JSON.stringify(verified)}`)
  }
  throw new Error('Not authenticated')
}

async function getUserRole(context) {
  const id = getUserId(context)
  const user = await context.db.user.findOne({ where: { id } })
  if (user) return user.role
  throw new Error('User not found')
}

async function userIsEditor(context) {
  const role = await getUserRole(context);
  if (['Editor', 'Admin'].includes(role)) return true
  throw new Error(`Not authorized, user has role: ${role}`)
}

async function userIsAdmin(context) {
  const role = await getUserRole(context);
  if (role === 'Admin') return true
  throw new Error(`Not authorized, user has role: ${role}`)
}



//                      _          _    _                    
//                     | |        | |  (_)                   
//    _ __ ___   _   _ | |_  __ _ | |_  _   ___   _ __   ___ 
//   | '_ ` _ \ | | | || __|/ _` || __|| | / _ \ | '_ \ / __|
//   | | | | | || |_| || |_| (_| || |_ | || (_) || | | |\__ \
//   |_| |_| |_| \__,_| \__|\__,_| \__||_| \___/ |_| |_||___/
//                                                           
//                                                           
// Mutations

schema.mutationType({
  definition(t) {
    //     ___                  _        
    //    / __| _ _  ___  __ _ | |_  ___ 
    //   | (__ | '_|/ -_)/ _` ||  _|/ -_)
    //    \___||_|  \___|\__,_| \__|\___|
    //                                   
    // Create

    t.crud.createOneDocument({
      authorize: (root, args, ctx) => userIsEditor(ctx)
    })
    t.crud.createOneEvent({
      async resolve(root, args, ctx, info, originalResolve) {
        const res = await originalResolve(root, args, ctx, info)
        const id = `9-${res.eventIdSeq-1573}`;
        const newRes = await ctx.db.event.update({
          where: {
            id: res.id,
          },
          data: {
            id: { set: id },
          },
        })
        return newRes
      },
      authorize: (root, args, ctx) => userIsEditor(ctx)
    })
    t.crud.createOneLocation({
      authorize: (root, args, ctx) => userIsEditor(ctx)
    })
    t.crud.createOneStakeholder({
      authorize: (root, args, ctx) => userIsEditor(ctx)
    })
    t.crud.createOneTag({
      authorize: (root, args, ctx) => userIsEditor(ctx)
    })
    t.crud.createOneFile({
      authorize: (root, args, ctx) => userIsEditor(ctx)
    })

    t.crud.createOneClassificationOnDocument({
      authorize: (root, args, ctx) => userIsEditor(ctx)
    })
    t.crud.createOneDocumentAuthor({
      authorize: (root, args, ctx) => userIsEditor(ctx)
    })
    t.crud.createOneDocumentEvent({
      authorize: (root, args, ctx) => userIsEditor(ctx)
    })
    t.crud.createOneDocumentFile({
      authorize: (root, args, ctx) => userIsEditor(ctx)
    })
    t.crud.createOneDocumentInvolvedStakeholder({
      authorize: (root, args, ctx) => userIsEditor(ctx)
    })
    t.crud.createOneDocumentLocation({
      authorize: (root, args, ctx) => userIsEditor(ctx)
    })
    t.crud.createOneKindOnDocument({
      authorize: (root, args, ctx) => userIsEditor(ctx)
    })
    t.crud.createOneLocationOnEvent({
      authorize: (root, args, ctx) => userIsEditor(ctx)
    })
    t.crud.createOneStakeholderEvent({
      authorize: (root, args, ctx) => userIsEditor(ctx)
    })
    t.crud.createOneTagOnDocument({
      authorize: (root, args, ctx) => userIsEditor(ctx)
    })
    t.crud.createOneTagOnEvent({
      authorize: (root, args, ctx) => userIsEditor(ctx)
    })

    t.field('createUser', {
      type: 'UserAuthPayload',
      args: {
        userName: stringArg(),
        email: stringArg({ nullable: false }),
        password: stringArg({ nullable: false }),
        role: stringArg({ nullable: false }),
      },
      resolve: async (_parent, { userName, email, password, role }, ctx) => {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await ctx.db.user.create({
          data: {
            userName,
            email,
            password: hashedPassword,
            role,
          },
        })
        return {
          token: sign({ userId: user.id }, process.env.AUTH_SECRET),
          user,
        }
      },
    })

    //    _   _           _        _        
    //   | | | | _ __  __| | __ _ | |_  ___ 
    //   | |_| || '_ \/ _` |/ _` ||  _|/ -_)
    //    \___/ | .__/\__,_|\__,_| \__|\___|
    //          |_|                         
    // Update

    t.crud.updateOneUser({
      authorize: (root, args, ctx) => userIsAdmin(ctx)
    })
    t.crud.updateOneDocument({
      async resolve(root, args, ctx, info, originalResolve) {
        if(args.data.documentKind) await ctx.db.queryRaw(`DELETE FROM "KindOnDocument" WHERE "B" = '${args.where.id}';`)
        if(args.data.documentClassification) await ctx.db.queryRaw(`DELETE FROM "ClassificationOnDocument" WHERE "B" = '${args.where.id}';`)
        if(args.data.documentTags) await ctx.db.queryRaw(`DELETE FROM "TagOnDocument" WHERE "B" = '${args.where.id}';`)
        if(args.data.documentAuthors) await ctx.db.queryRaw(`DELETE FROM "DocumentAuthor" WHERE "A" = '${args.where.id}';`)
        if(args.data.mentionedStakeholders) await ctx.db.queryRaw(`DELETE FROM "DocumentInvolvedStakeholder" WHERE "B" = '${args.where.id}';`)
        if(args.data.mentionedLocations) await ctx.db.queryRaw(`DELETE FROM "DocumentLocation" WHERE "B" = '${args.where.id}';`);
        const res = await originalResolve(root, args, ctx, info)
        return res
      },
      authorize: (root, args, ctx) => userIsEditor(ctx)
    })
    t.crud.updateOneEvent({
      async resolve(root, args, ctx, info, originalResolve) {
        if(args.data.eventTags) await ctx.db.queryRaw(`DELETE FROM "TagOnEvent" WHERE "B" = '${args.where.id}';`)
        if(args.data.eventStakeholders) await ctx.db.queryRaw(`DELETE FROM "StakeholderEvent" WHERE "B" = '${args.where.id}';`)
        if(args.data.eventLocations) await ctx.db.queryRaw(`DELETE FROM "LocationOnEvent" WHERE "B" = '${args.where.id}';`)
        const res = await originalResolve(root, args, ctx, info)
        return res
      },
      authorize: (root, args, ctx) => userIsEditor(ctx)
    })
    t.crud.updateOneStakeholder({
      async resolve(root, args, ctx, info, originalResolve) {
        if(args.data.documentsMentionedIn) await ctx.db.queryRaw(`DELETE FROM "DocumentInvolvedStakeholder" WHERE "A" = '${args.where.id}';`)
        if(args.data.documents) await ctx.db.queryRaw(`DELETE FROM "DocumentAuthor" WHERE "B" = '${args.where.id}';`)
        if(args.data.eventsInvolvedIn) await ctx.db.queryRaw(`DELETE FROM "StakeholderEvent" WHERE "A" = '${args.where.id}';`)
        const res = await originalResolve(root, args, ctx, info)
        return res
      },
      authorize: (root, args, ctx) => userIsEditor(ctx)
    })
    t.crud.updateOneLocation({
      async resolve(root, args, ctx, info, originalResolve) {
        if(args.data.documentsMentionedIn) await ctx.db.queryRaw(`DELETE FROM "DocumentLocation" WHERE "A" = '${args.where.id}';`)
        if(args.data.locationEvents) await ctx.db.queryRaw(`DELETE FROM "LocationOnEvent" WHERE "A" = '${args.where.id}';`)
        const res = await originalResolve(root, args, ctx, info)
        return res
      },
      authorize: (root, args, ctx) => userIsEditor(ctx)
    })

    //    ___        _       _        
    //   |   \  ___ | | ___ | |_  ___ 
    //   | |) |/ -_)| |/ -_)|  _|/ -_)
    //   |___/ \___||_|\___| \__|\___|
    //                                
    // Delete

    t.crud.deleteOneUser({
      authorize: (root, args, ctx) => userIsAdmin(ctx)
    })
    t.crud.deleteOneDocument({
      async resolve(root, args, ctx, info, originalResolve) {
        await ctx.db.queryRaw(`DELETE FROM "BriefingBookDocument" WHERE "B" = '${args.where.id}';`)
        await ctx.db.queryRaw(`DELETE FROM "ClassificationOnDocument" WHERE "B" = '${args.where.id}';`)
        await ctx.db.queryRaw(`DELETE FROM "DocumentAuthor" WHERE "A" = '${args.where.id}';`)
        await ctx.db.queryRaw(`DELETE FROM "DocumentEvent" WHERE "A" = '${args.where.id}';`)
        await ctx.db.queryRaw(`DELETE FROM "DocumentFile" WHERE "A" = '${args.where.id}';`)
        await ctx.db.queryRaw(`DELETE FROM "DocumentInvolvedStakeholder" WHERE "B" = '${args.where.id}';`)
        await ctx.db.queryRaw(`DELETE FROM "DocumentLocation" WHERE "B" = '${args.where.id}';`)
        await ctx.db.queryRaw(`DELETE FROM "KindOnDocument" WHERE "B" = '${args.where.id}';`)
        await ctx.db.queryRaw(`DELETE FROM "TagOnDocument" WHERE "B" = '${args.where.id}';`)
        const res = await originalResolve(root, args, ctx, info)
        return res
      },
      authorize: (root, args, ctx) => userIsEditor(ctx)
    })
    t.crud.deleteOneEvent({
      async resolve(root, args, ctx, info, originalResolve) {
        await ctx.db.queryRaw(`DELETE FROM "BriefingBookEvent" WHERE "A" = '${args.where.id}';`)
        await ctx.db.queryRaw(`DELETE FROM "DocumentEvent" WHERE "B" = '${args.where.id}';`)
        await ctx.db.queryRaw(`DELETE FROM "LocationOnEvent" WHERE "B" = '${args.where.id}';`)
        await ctx.db.queryRaw(`DELETE FROM "StakeholderEvent" WHERE "B" = '${args.where.id}';`)
        await ctx.db.queryRaw(`DELETE FROM "TagOnEvent" WHERE "B" = '${args.where.id}';`)
        const res = await originalResolve(root, args, ctx, info)
        return res
      },
      authorize: (root, args, ctx) => userIsEditor(ctx)
    })
    t.crud.deleteOneLocation({
      async resolve(root, args, ctx, info, originalResolve) {
        await ctx.db.queryRaw(`DELETE FROM "DocumentLocation" WHERE "A" = '${args.where.id}';`)
        await ctx.db.queryRaw(`DELETE FROM "LocationOnEvent" WHERE "A" = '${args.where.id}';`)
        const res = await originalResolve(root, args, ctx, info)
        return res
      },
      authorize: (root, args, ctx) => userIsEditor(ctx)
    })
    t.crud.deleteOneStakeholder({
      async resolve(root, args, ctx, info, originalResolve) {
        await ctx.db.queryRaw(`DELETE FROM "DocumentAuthor" WHERE "B" = '${args.where.id}';`)
        await ctx.db.queryRaw(`DELETE FROM "DocumentInvolvedStakeholder" WHERE "A" = '${args.where.id}';`)
        await ctx.db.queryRaw(`DELETE FROM "StakeholderBriefingBook" WHERE "A" = '${args.where.id}';`)
        await ctx.db.queryRaw(`DELETE FROM "StakeholderEvent" WHERE "A" = '${args.where.id}';`)
        const res = await originalResolve(root, args, ctx, info)
        return res
      },
      authorize: (root, args, ctx) => userIsEditor(ctx)
    })

    //     ___           _               
    //    / __|_  _  ___| |_  ___  _ __  
    //   | (__| || |(_-<|  _|/ _ \| '  \ 
    //    \___|\_,_|/__/ \__|\___/|_|_|_|
    //                                   
    // Custom mutations

    t.field('signinUser', {
      type: 'UserAuthPayload',
      args: {
        email: stringArg({ nullable: false }),
        password: stringArg({ nullable: false }),
      },
      resolve: async (_, { email, password }, ctx): Promise<any> => {
        const user = await ctx.db.user.findOne({ where: { email }});
        if (!user) {
          throw new Error('Invalid Login');
        }
    
        const passwordMatch = await bcrypt.compare(password, user.password);
    
        if (!passwordMatch) {
          throw new Error('Invalid Login');
        }
    
        const token = sign(
          {
            id: user.id,
            email: user.email,
          },
          process.env.AUTH_SECRET,
          {
            expiresIn: '30d',
          },
        );
    
        console.log({ user, token });
    
        return { user, token };    
      }
    })
  },
})

//                                       
//                                       
//     ___  _ __   _   _  _ __ ___   ___ 
//    / _ \| '_ \ | | | || '_ ` _ \ / __|
//   |  __/| | | || |_| || | | | | |\__ \
//    \___||_| |_| \__,_||_| |_| |_||___/
//                                       
// Enums

schema.enumType({
  name: 'MediaType',
  members: ['RawText','Video','Image','Audio','Pdf','Embedd','Markdown'],
})

schema.enumType({
  name: 'UserRole',
  members: ['Admin', 'Editor', 'Viewer'],
})

