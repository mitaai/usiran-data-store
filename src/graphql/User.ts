import { objectType, extendType, enumType } from 'nexus'
import { model } from './helper'
import { Context } from '../context';
import { arg, stringArg, nonNull } from 'nexus';
import bcrypt from 'bcrypt';
import { sign, verify, Secret } from 'jsonwebtoken';


// Authentication and authorization logic

interface JWTData {
  id: string;
}
const isJWTData = (input: object | string): input is JWTData => { return typeof input === "object" && "id" in input; };  

function getUserId(context: Context) {
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
  const id = getUserId(context)
  const user = await context.db.user.findUnique({ where: { id } })
  if (user) return user.role
  throw new Error('User not found')
}

async function userIsEditor(context: Context) {
  await getUserRole(context)
    .then((role) => {
      if (['Editor', 'Admin'].includes(role as string)) return true
      throw new Error(`Not authorized, user has role: ${role}`)
    })
}

async function userIsAdmin(context: Context) {
  const role = await getUserRole(context);
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
    model(t).createdAt()
    model(t).email()
    model(t).password()
    model(t).firstName()
    model(t).id()
    model(t).lastName()
    model(t).role()
    model(t).updatedAt()
    model(t).userName()
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
    model(t).id()
    model(t).eventIdSeq()
    model(t).eventTitle()
    model(t).eventStartDate()
    model(t).eventEndDate()
    model(t).eventTags()
    model(t).eventStakeholders()
    model(t).eventDescription()
    model(t).eventLocations()
  },
});


export const Stakeholder = objectType({
  name: 'Stakeholder',
  definition(t) {
    model(t).id()
    model(t).stakeholderFullName()
    model(t).stakeholderDescription()
    model(t).documents()
    model(t).documentsMentionedIn()
    model(t).eventsInvolvedIn()
    model(t).stakeholderWikipediaUri()
    model(t).isStakeholderInstitution()
  },
});


export const Location = objectType({
  name: 'Location',
  definition(t) {
    model(t).id()
    model(t).locationName()
    model(t).locationDescription()
    model(t).documentsMentionedIn()
    model(t).locationEvents()
    model(t).locationWikipediaUri()
  },
});


export const File = objectType({
  name: 'File',
  definition(t) {
    model(t).id()
    model(t).url()
    model(t).size()
    model(t).name()
    model(t).contentType()
  },
});

export const Kind = objectType({
  name: 'Kind',
  definition(t) {
    model(t).id()
    model(t).name()
    model(t).createdAt()
    model(t).updatedAt()
    model(t).documentsWithKind()
  },
});

export const Tag = objectType({
  name: 'Tag',
  definition(t) {
    model(t).id()
    model(t).name()
    model(t).description()
    model(t).tagWikipediaUri()
    model(t).documentsWithTag()
    model(t).eventsWithTag()
    model(t).type()
    model(t).createdAt()
    model(t).updatedAt()
  },
});

export const BriefingBook = objectType({
  name: 'BriefingBook',
  definition(t) {
    model(t).id()
    model(t).briefingBookDescription()
    model(t).briefingBookTitle()
    model(t).mentionedDocuments()
    model(t).mentionedEvents()
    model(t).mentionedStakeholders()
    model(t).createdAt()
    model(t).updatedAt()
  },
});

export const Classification = objectType({
  name: 'Classification',
  definition(t) {
    model(t).id()
    model(t).name()
    model(t).documentsWithClassification()
    model(t).createdAt()
    model(t).updatedAt()
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
    model(t).id()
    model(t).A({alias:"BriefingBookId"})
    model(t).B({alias:"DocumentId"})
    model(t).BriefingBook()
    model(t).Document()
  }
})

export const BriefingBookEvent = objectType({
  name: 'BriefingBookEvent',
  definition(t){
    model(t).id()
    model(t).A({alias:"EventId"})
    model(t).B({alias:"BriefingBookId"})
    model(t).Event()
    model(t).BriefingBook()
  }
})

export const ClassificationOnDocument = objectType({
  name: 'ClassificationOnDocument',
  definition(t) {
    model(t).id()
    model(t).A({alias:"ClassificationId"})
    model(t).B({alias:"DocumentId"})
    model(t).Classification()
    model(t).Document()
  }
})

export const DocumentAuthor = objectType({
  name: 'DocumentAuthor',
  definition(t){
    model(t).id()
    model(t).A({alias:"DocumentId"})
    model(t).B({alias:"StakeholderId"})
    model(t).Document()
    model(t).Stakeholder()
  }
})

export const DocumentEvent = objectType({
  name: 'DocumentEvent',
  definition(t) {
    model(t).id()
    model(t).A({alias:"DocumentId"})
    model(t).B({alias:"EventId"})
    model(t).Document()
    model(t).Event()
  }
})

export const DocumentFile = objectType({
  name: 'DocumentFile',
  definition(t){
    model(t).id()
    model(t).A({alias:"DocumentId"})
    model(t).B({alias:"FileId"})
    model(t).Document()
    model(t).File()
  }
})

export const DocumentInvolvedStakeholder = objectType({
  name: 'DocumentInvolvedStakeholder',
  definition(t) {
    model(t).id()
    model(t).A({alias:"StakeholderId"})
    model(t).B({alias:"DocumentId"})
    model(t).Stakeholder()
    model(t).Document()
  }
})

export const DocumentLocation = objectType({
  name: 'DocumentLocation',
  definition(t){
    model(t).id()
    model(t).A({alias:"LocationId"})
    model(t).B({alias:"DocumentId"})
    model(t).Location()
    model(t).Document()
  }
})

export const KindOnDocument = objectType({
  name: 'KindOnDocument',
  definition(t) {
    model(t).id()
    model(t).A({alias:"KindId"})
    model(t).B({alias:"DocumentId"})
    model(t).Kind()
    model(t).Document()
  }
})

export const LocationOnEvent = objectType({
  name: 'LocationOnEvent',
  definition(t) {
    model(t).id()
    model(t).A({alias: "LocationId"})
    model(t).B({alias: "EventId"})
    model(t).Location()
    model(t).Event()
  }
})

export const StakeholderBriefingBook = objectType({
  name: 'StakeholderBriefingBook',
  definition(t){
    model(t).id()
    model(t).A({alias: "StakeholderId"})
    model(t).B({alias: "BriefingBookId"})
    model(t).Stakeholder()
    model(t).BriefingBook()
  }
})

export const StakeholderEvent = objectType({
  name: 'StakeholderEvent',
  definition(t){
    model(t).id()
    model(t).A({alias: "StakeholderId"})
    model(t).B({alias: "EventId"})
    model(t).Stakeholder()
    model(t).Event()
  }
})

export const TagOnDocument = objectType({
  name: 'TagOnDocument',
  definition(t){
    model(t).id()
    model(t).A({alias:"TagId"})
    model(t).B({alias:"DocumentId"})
    model(t).Tag()
    model(t).Document()
  }
})

export const TagOnEvent = objectType({
  name: 'TagOnEvent',
  definition(t){
    model(t).id()
    model(t).A({alias: "TagId"})
    model(t).B({alias: "EventId"})
    model(t).Tag()
    model(t).Event()
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

export const Queries = extendType({
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
        const result = await ctx.db.document.count(args);
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
        const result = await ctx.db.event.count(args);
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
        const result = await ctx.db.stakeholder.count(args);
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
        email: nonNull(stringArg()),
        password: nonNull(stringArg()),
        role: nonNull(stringArg()),
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
        email: nonNull(stringArg()),
        password: nonNull(stringArg()),
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

