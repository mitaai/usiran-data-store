import { objectType, extendType, enumType } from 'nexus'
import { Context } from '../context';
import { stringArg, nonNull } from 'nexus';
import bcrypt from 'bcrypt';
import { sign, verify, Secret } from 'jsonwebtoken';
import { Prisma } from '@prisma/client';


// Authentication and authorization logic

interface JWTData {
  id: string;
}
const isJWTData = (input: object | string): input is JWTData => { return typeof input === "object" && "id" in input; };  

function getUserId(context: Context) {
  console.log('made it to getUserId')
  const Authorization = context.req.get('Authorization')
  if (Authorization) {
    const token = Authorization.replace('Bearer ', '')
    const verified = verify(token, process.env.AUTH_SECRET as Secret)
    if(isJWTData(verified)) {
      const { id } = verified
      return id
    } throw new Error(`JWT Data invalid: ${JSON.stringify(verified)}`)
  }
  throw new Error('Not authenticated')
}

async function getUserRole(context: Context) {
  console.log('made it to getUserRole')
  console.log(context)
  console.log('ctx in getUserRole ^')
  console.log(context.req)
  console.log(context.req.query)
  const id = getUserId(context)
  const user = await context.db.user.findUnique({ where: { id } })
  if (user) return user.role
  throw new Error('User not found')
}

async function userIsEditor(context: Context): Promise<boolean> {
  const role = await getUserRole(context)
  if (['Editor', 'Admin'].includes(role as string)) return true
  throw new Error(`Not authorized, user has role: ${role}`)
}

async function userIsAdmin(context: Context) {
  const role = await getUserRole(context)
  if (role === 'Admin') return true
  throw new Error(`Not authorized, user has role: ${role}`)
}



//                          _        _      
//                         | |      | |     
//    _ __ ___    ___    __| |  ___ | | ___ 
//   | '_ ` _ \  / _ \  / _` | / _ \| |/ __|
//   | | | | | || (_) || (_| ||  __/| |\__ \
//   |_| |_| |_| \___/  \__,_| \___||_||___/
//                                          
// Models

export const User = objectType({
  name: 'User',
  definition(t) {
    t.model.createdAt()
    t.model.email()
    t.model.password()
    t.model.firstName()
    t.model.id()
    t.model.lastName()
    t.model.role()
    t.model.updatedAt()
    t.model.userName()
  },
});

export const UserAuthPayload = objectType({
  name: 'UserAuthPayload',
  definition(t){
    t.string("token");
    t.field("user", { type: "User" });
  },
});

export const Event = objectType({
  name: 'Event',
  definition(t) {
    t.model.id()
    t.model.eventIdSeq()
    t.model.eventTitle()
    t.model.eventStartDate()
    t.model.eventEndDate()
    t.model.eventTags()
    t.model.eventStakeholders()
    t.model.eventDescription()
    t.model.eventLocations()
  },
});


export const Stakeholder = objectType({
  name: 'Stakeholder',
  definition(t) {
    t.model.id()
    t.model.stakeholderFullName()
    t.model.stakeholderDescription()
    t.model.documents()
    t.model.documentsMentionedIn()
    t.model.eventsInvolvedIn()
    t.model.stakeholderWikipediaUri()
    t.model.isStakeholderInstitution()
  },
});


export const Location = objectType({
  name: 'Location',
  definition(t) {
    t.model.id()
    t.model.locationName()
    t.model.locationDescription()
    t.model.documentsMentionedIn()
    t.model.locationEvents()
    t.model.locationWikipediaUri()
  },
});


export const File = objectType({
  name: 'File',
  definition(t) {
    t.model.id()
    t.model.url()
    t.model.size()
    t.model.name()
    t.model.contentType()
  },
});

export const Kind = objectType({
  name: 'Kind',
  definition(t) {
    t.model.id()
    t.model.name()
    t.model.createdAt()
    t.model.updatedAt()
    t.model.documentsWithKind()
  },
});

export const Tag = objectType({
  name: 'Tag',
  definition(t) {
    t.model.id()
    t.model.name()
    t.model.description()
    t.model.tagWikipediaUri()
    t.model.documentsWithTag()
    t.model.eventsWithTag()
    t.model.type()
    t.model.createdAt()
    t.model.updatedAt()
  },
});

export const BriefingBook = objectType({
  name: 'BriefingBook',
  definition(t) {
    t.model.id()
    t.model.briefingBookDescription()
    t.model.briefingBookTitle()
    t.model.mentionedDocuments()
    t.model.mentionedEvents()
    t.model.mentionedStakeholders()
    t.model.createdAt()
    t.model.updatedAt()
  },
});

export const Classification = objectType({
  name: 'Classification',
  definition(t) {
    t.model.id()
    t.model.name()
    t.model.documentsWithClassification()
    t.model.createdAt()
    t.model.updatedAt()
  },
});


//          .     .                 
//          |     |   o             
//  ;-. ,-. | ,-: |-  . ,-. ;-. ,-. 
//  |   |-' | | | |   | | | | | `-. 
//  '   `-' ' `-` `-' ' `-' ' ' `-' 
//                                  
// Relations

export const BriefingBookDocument = objectType({
  name: 'BriefingBookDocument',
  definition(t) {
    t.model.id()
    t.model.A({alias:"BriefingBookId"})
    t.model.B({alias:"DocumentId"})
    t.model.BriefingBook()
    t.model.Document()
  }
})

export const BriefingBookEvent = objectType({
  name: 'BriefingBookEvent',
  definition(t){
    t.model.id()
    t.model.A({alias:"EventId"})
    t.model.B({alias:"BriefingBookId"})
    t.model.Event()
    t.model.BriefingBook()
  }
})

export const ClassificationOnDocument = objectType({
  name: 'ClassificationOnDocument',
  definition(t) {
    t.model.id()
    t.model.A({alias:"ClassificationId"})
    t.model.B({alias:"DocumentId"})
    t.model.Classification()
    t.model.Document()
  }
})

export const DocumentAuthor = objectType({
  name: 'DocumentAuthor',
  definition(t){
    t.model.id()
    t.model.A({alias:"DocumentId"})
    t.model.B({alias:"StakeholderId"})
    t.model.Document()
    t.model.Stakeholder()
  }
})

export const DocumentEvent = objectType({
  name: 'DocumentEvent',
  definition(t) {
    t.model.id()
    t.model.A({alias:"DocumentId"})
    t.model.B({alias:"EventId"})
    t.model.Document()
    t.model.Event()
  }
})

export const DocumentFile = objectType({
  name: 'DocumentFile',
  definition(t){
    t.model.id()
    t.model.A({alias:"DocumentId"})
    t.model.B({alias:"FileId"})
    t.model.Document()
    t.model.File()
  }
})

export const DocumentInvolvedStakeholder = objectType({
  name: 'DocumentInvolvedStakeholder',
  definition(t) {
    t.model.id()
    t.model.A({alias:"StakeholderId"})
    t.model.B({alias:"DocumentId"})
    t.model.Stakeholder()
    t.model.Document()
  }
})

export const DocumentLocation = objectType({
  name: 'DocumentLocation',
  definition(t){
    t.model.id()
    t.model.A({alias:"LocationId"})
    t.model.B({alias:"DocumentId"})
    t.model.Location()
    t.model.Document()
  }
})

export const KindOnDocument = objectType({
  name: 'KindOnDocument',
  definition(t) {
    t.model.id()
    t.model.A({alias:"KindId"})
    t.model.B({alias:"DocumentId"})
    t.model.Kind()
    t.model.Document()
  }
})

export const LocationOnEvent = objectType({
  name: 'LocationOnEvent',
  definition(t) {
    t.model.id()
    t.model.A({alias: "LocationId"})
    t.model.B({alias: "EventId"})
    t.model.Location()
    t.model.Event()
  }
})

export const StakeholderBriefingBook = objectType({
  name: 'StakeholderBriefingBook',
  definition(t){
    t.model.id()
    t.model.A({alias: "StakeholderId"})
    t.model.B({alias: "BriefingBookId"})
    t.model.Stakeholder()
    t.model.BriefingBook()
  }
})

export const StakeholderEvent = objectType({
  name: 'StakeholderEvent',
  definition(t){
    t.model.id()
    t.model.A({alias: "StakeholderId"})
    t.model.B({alias: "EventId"})
    t.model.Stakeholder()
    t.model.Event()
  }
})

export const TagOnDocument = objectType({
  name: 'TagOnDocument',
  definition(t){
    t.model.id()
    t.model.A({alias:"TagId"})
    t.model.B({alias:"DocumentId"})
    t.model.Tag()
    t.model.Document()
  }
})

export const TagOnEvent = objectType({
  name: 'TagOnEvent',
  definition(t){
    t.model.id()
    t.model.A({alias: "TagId"})
    t.model.B({alias: "EventId"})
    t.model.Tag()
    t.model.Event()
  }
})


//                             _            
//                            (_)           
//    __ _  _   _   ___  _ __  _   ___  ___ 
//   / _` || | | | / _ \| '__|| | / _ \/ __|
//  | (_| || |_| ||  __/| |   | ||  __/\__ \
//   \__, | \__,_| \___||_|   |_| \___||___/
//      | |                                 
//      |_|                                 
//
// Queries

export const queries = extendType({
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
    t.int('documentsCount', {
      args: {
        where: "DocumentWhereInput",
      },
      async resolve(_parent, args, ctx) {
        const result = await ctx.db.document.count(args as Prisma.FindManyDocumentArgs);
        return result;
      }
    })
    t.crud.event()
    t.crud.events({
      pagination: true,
      filtering: true,
      ordering: true,
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
    t.crud.stakeholder()
    t.crud.stakeholders({
      pagination: true,
      filtering: true,
      ordering: true,
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
  },
})


//                      _          _    _                    
//                     | |        | |  (_)                   
//    _ __ ___   _   _ | |_  __ _ | |_  _   ___   _ __   ___ 
//   | '_ ` _ \ | | | || __|/ _` || __|| | / _ \ | '_ \ / __|
//   | | | | | || |_| || |_| (_| || |_ | || (_) || | | |\__ \
//   |_| |_| |_| \__,_| \__|\__,_| \__||_| \___/ |_| |_||___/
//                                                           
//                                                           
// Mutations

export const mutations  = extendType({
  type: 'Mutation',
  definition(t) {
    //     ___                  _        
    //    / __| _ _  ___  __ _ | |_  ___ 
    //   | (__ | '_|/ -_)/ _` ||  _|/ -_)
    //    \___||_|  \___|\__,_| \__|\___|
    //                                   
    // Create

    t.crud.createOneDocument({
      authorize: (_root: any, _args: any, ctx: Context) => userIsEditor(ctx)
    })
    t.crud.createOneEvent({
      async resolve(root, args, ctx, info, originalResolve) {
        const res = await originalResolve(root, args, ctx, info)
        const id = `9-${(res.eventIdSeq as number)-1573}`;
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

    //    _   _           _        _        
    //   | | | | _ __  __| | __ _ | |_  ___ 
    //   | |_| || '_ \/ _` |/ _` ||  _|/ -_)
    //    \___/ | .__/\__,_|\__,_| \__|\___|
    //          |_|                         
    // Update

    t.crud.updateOneUser({
      authorize: (_root: any, _args: any, ctx: Context) => userIsAdmin(ctx)
    })
    t.crud.updateOneDocument({
      async resolve(root, args, ctx, info, originalResolve) {
        if(args.data.documentKind) await ctx.db.$queryRaw(`DELETE FROM "KindOnDocument" WHERE "B" = '${args.where.id}';`)
        if(args.data.documentClassification) await ctx.db.$queryRaw(`DELETE FROM "ClassificationOnDocument" WHERE "B" = '${args.where.id}';`)
        if(args.data.documentTags) await ctx.db.$queryRaw(`DELETE FROM "TagOnDocument" WHERE "B" = '${args.where.id}';`)
        if(args.data.documentAuthors) await ctx.db.$queryRaw(`DELETE FROM "DocumentAuthor" WHERE "A" = '${args.where.id}';`)
        if(args.data.mentionedStakeholders) await ctx.db.$queryRaw(`DELETE FROM "DocumentInvolvedStakeholder" WHERE "B" = '${args.where.id}';`)
        if(args.data.mentionedLocations) await ctx.db.$queryRaw(`DELETE FROM "DocumentLocation" WHERE "B" = '${args.where.id}';`);
        const res = await originalResolve(root, args, ctx, info)
        return res
      },
      authorize: (_root: any, _args: any, ctx: Context) => userIsEditor(ctx)
    })
    t.crud.updateOneEvent({
      async resolve(root, args, ctx, info, originalResolve) {
        if(args.data.eventTags) await ctx.db.$queryRaw(`DELETE FROM "TagOnEvent" WHERE "B" = '${args.where.id}';`)
        if(args.data.eventStakeholders) await ctx.db.$queryRaw(`DELETE FROM "StakeholderEvent" WHERE "B" = '${args.where.id}';`)
        if(args.data.eventLocations) await ctx.db.$queryRaw(`DELETE FROM "LocationOnEvent" WHERE "B" = '${args.where.id}';`)
        const res = await originalResolve(root, args, ctx, info)
        return res
      },
      authorize: (_root: any, _args: any, ctx: Context) => userIsEditor(ctx)
    })
    t.crud.updateOneStakeholder({
      async resolve(root, args, ctx, info, originalResolve) {
        if(args.data.documentsMentionedIn) await ctx.db.$queryRaw(`DELETE FROM "DocumentInvolvedStakeholder" WHERE "A" = '${args.where.id}';`)
        if(args.data.documents) await ctx.db.$queryRaw(`DELETE FROM "DocumentAuthor" WHERE "B" = '${args.where.id}';`)
        if(args.data.eventsInvolvedIn) await ctx.db.$queryRaw(`DELETE FROM "StakeholderEvent" WHERE "A" = '${args.where.id}';`)
        const res = await originalResolve(root, args, ctx, info)
        return res
      },
      authorize: (_root: any, _args: any, ctx: Context) => userIsEditor(ctx)
    })
    t.crud.updateOneLocation({
      async resolve(root, args, ctx, info, originalResolve) {
        if(args.data.documentsMentionedIn) await ctx.db.$queryRaw(`DELETE FROM "DocumentLocation" WHERE "A" = '${args.where.id}';`)
        if(args.data.locationEvents) await ctx.db.$queryRaw(`DELETE FROM "LocationOnEvent" WHERE "A" = '${args.where.id}';`)
        const res = await originalResolve(root, args, ctx, info)
        return res
      },
      authorize: (_root: any, _args: any, ctx: Context) => userIsEditor(ctx)
    })

    //    ___        _       _        
    //   |   \  ___ | | ___ | |_  ___ 
    //   | |) |/ -_)| |/ -_)|  _|/ -_)
    //   |___/ \___||_|\___| \__|\___|
    //                                
    // Delete

    t.crud.deleteOneUser({
      authorize: (_root: any, _args: any, ctx: Context) => userIsAdmin(ctx)
    })
    t.crud.deleteOneDocument({
      async resolve(root, args, ctx, info, originalResolve) {
        await ctx.db.$queryRaw(`DELETE FROM "BriefingBookDocument" WHERE "B" = '${args.where.id}';`)
        await ctx.db.$queryRaw(`DELETE FROM "ClassificationOnDocument" WHERE "B" = '${args.where.id}';`)
        await ctx.db.$queryRaw(`DELETE FROM "DocumentAuthor" WHERE "A" = '${args.where.id}';`)
        await ctx.db.$queryRaw(`DELETE FROM "DocumentEvent" WHERE "A" = '${args.where.id}';`)
        await ctx.db.$queryRaw(`DELETE FROM "DocumentFile" WHERE "A" = '${args.where.id}';`)
        await ctx.db.$queryRaw(`DELETE FROM "DocumentInvolvedStakeholder" WHERE "B" = '${args.where.id}';`)
        await ctx.db.$queryRaw(`DELETE FROM "DocumentLocation" WHERE "B" = '${args.where.id}';`)
        await ctx.db.$queryRaw(`DELETE FROM "KindOnDocument" WHERE "B" = '${args.where.id}';`)
        await ctx.db.$queryRaw(`DELETE FROM "TagOnDocument" WHERE "B" = '${args.where.id}';`)
        const res = await originalResolve(root, args, ctx, info)
        return res
      },
      authorize: (_root: any, _args: any, ctx: Context) => userIsEditor(ctx)
    })
    t.crud.deleteOneEvent({
      async resolve(root, args, ctx, info, originalResolve) {
        await ctx.db.$queryRaw(`DELETE FROM "BriefingBookEvent" WHERE "A" = '${args.where.id}';`)
        await ctx.db.$queryRaw(`DELETE FROM "DocumentEvent" WHERE "B" = '${args.where.id}';`)
        await ctx.db.$queryRaw(`DELETE FROM "LocationOnEvent" WHERE "B" = '${args.where.id}';`)
        await ctx.db.$queryRaw(`DELETE FROM "StakeholderEvent" WHERE "B" = '${args.where.id}';`)
        await ctx.db.$queryRaw(`DELETE FROM "TagOnEvent" WHERE "B" = '${args.where.id}';`)
        const res = await originalResolve(root, args, ctx, info)
        return res
      },
      authorize: (_root: any, _args: any, ctx: Context) => userIsEditor(ctx)
    })
    t.crud.deleteOneLocation({
      async resolve(root, args, ctx, info, originalResolve) {
        await ctx.db.$queryRaw(`DELETE FROM "DocumentLocation" WHERE "A" = '${args.where.id}';`)
        await ctx.db.$queryRaw(`DELETE FROM "LocationOnEvent" WHERE "A" = '${args.where.id}';`)
        const res = await originalResolve(root, args, ctx, info)
        return res
      },
      authorize: (_root: any, _args: any, ctx: Context) => userIsEditor(ctx)
    })
    t.crud.deleteOneStakeholder({
      async resolve(root, args, ctx, info, originalResolve) {
        await ctx.db.$queryRaw(`DELETE FROM "DocumentAuthor" WHERE "B" = '${args.where.id}';`)
        await ctx.db.$queryRaw(`DELETE FROM "DocumentInvolvedStakeholder" WHERE "A" = '${args.where.id}';`)
        await ctx.db.$queryRaw(`DELETE FROM "StakeholderBriefingBook" WHERE "A" = '${args.where.id}';`)
        await ctx.db.$queryRaw(`DELETE FROM "StakeholderEvent" WHERE "A" = '${args.where.id}';`)
        const res = await originalResolve(root, args, ctx, info)
        return res
      },
      authorize: (_root: any, _args: any, ctx: Context) => userIsEditor(ctx)
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
        email: nonNull(stringArg()),
        password: nonNull(stringArg()),
      },
      resolve: async (_, { email, password }, ctx): Promise<any> => {
        const user = await ctx.db.user.findUnique({ where: { email }});
        if (!user) {
          throw new Error('Invalid Login');
        }
    
        const passwordMatch = await bcrypt.compare(password, user.password as string);
    
        if (!passwordMatch) {
          throw new Error('Invalid Login');
        }
    
        const token = sign(
          {
            id: user.id,
            email: user.email,
          },
          process.env.AUTH_SECRET as Secret,
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

const MediaType = enumType({
  name: 'MediaType',
  members: ['RawText','Video','Image','Audio','Pdf','Embedd','Markdown'],
})

const UserRole = enumType({
  name: 'UserRole',
  members: ['Admin', 'Editor', 'Viewer'],
})

