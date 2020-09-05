import cors from 'cors';
import { use, schema, server } from 'nexus';
import { prisma } from 'nexus-plugin-prisma';
import { arg, stringArg } from '@nexus/schema';
import bcrypt from 'bcrypt';
import { sign } from 'jsonwebtoken';

server.express.use(cors())

use(prisma({ 
  migrations: false,
  client: { options: { log: ['query', 'info', 'warn', 'error'] } },
  features: {
    crud: true,
  }
}))

//                          _        _      
//                         | |      | |     
//    _ __ ___    ___    __| |  ___ | | ___ 
//   | '_ ` _ \  / _ \  / _` | / _ \| |/ __|
//   | | | | | || (_) || (_| ||  __/| |\__ \
//   |_| |_| |_| \___/  \__,_| \___||_||___/
//                                          
// Models

// User

schema.objectType({
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
})

schema.objectType({
  name: 'UserAuthPayload',
  definition(t){
    t.string("token");
    t.field("user", { type: "User" });
  },
})

// Document

schema.objectType({
  name: 'Document',
  definition(t) {
    t.model.id()
    t.model.documentTitle()
    t.model.documentCreationDate()
    t.model.documentKind()
    t.model.documentTags()
    t.model.mentionedStakeholders()
    t.model.documentAuthors()
    t.model.documentDescription()
    t.model.documentFiles()
    t.model.mentionedLocations()
    t.model.documentOriginalID()
    t.model.documentClassification()
    t.model.documentPublicationDate()
    t.model.documentTranscript()
  },
})

// Event

schema.objectType({
  name: 'Event',
  definition(t) {
    t.model.id()
    t.model.eventTitle()
    t.model.eventStartDate()
    t.model.eventEndDate()
    t.model.eventTags()
    t.model.eventStakeholders()
    t.model.eventDescription()
    t.model.eventLocations()
  },
})

// Stakeholder

schema.objectType({
  name: 'Stakeholder',
  definition(t) {
    t.model.id()
    t.model.stakeholderFullName()
    t.model.stakeholderDescription()
    t.model.documents()
    t.model.documentsMentionedIn()
    t.model.eventsInvolvedIn()
    t.model.stakeholderWikipediaUri()
  },
})

// Location

schema.objectType({
  name: 'Location',
  definition(t) {
    t.model.id()
    t.model.locationName()
    t.model.locationDescription()
    t.model.documentsMentionedIn()
    t.model.locationEvents()
    t.model.locationWikipediaUri()
  },
})

// File

schema.objectType({
  name: 'File',
  definition(t) {
    t.model.id()
    t.model.url()
  },
})

// Kind

schema.objectType({
  name: 'Kind',
  definition(t) {
    t.model.id()
    t.model.name()
    t.model.createdAt()
    t.model.updatedAt()
    t.model.documentsWithKind()
  },
})

// Tag

schema.objectType({
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
})

// BriefingBook

schema.objectType({
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
})

// Classification

schema.objectType({
  name: 'Classification',
  definition(t) {
    t.model.id()
    t.model.name()
    t.model.documentsWithClassification()
    t.model.createdAt()
    t.model.updatedAt()
  },
})


//          .     .                 
//          |     |   o             
//  ;-. ,-. | ,-: |-  . ,-. ;-. ,-. 
//  |   |-' | | | |   | | | | | `-. 
//  '   `-' ' `-` `-' ' `-' ' ' `-' 
//                                  
// Relations

schema.objectType({
  name: 'BriefingBookDocument',
  definition(t) {
    t.model.id()
    t.model.A({alias:"BriefingBookId"})
    t.model.B({alias:"DocumentId"})
    t.model.BriefingBook()
    t.model.Document()
  }
})

schema.objectType({
  name: 'BriefingBookEvent',
  definition(t){
    t.model.id()
    t.model.A({alias:"EventId"})
    t.model.B({alias:"BriefingBookId"})
    t.model.Event()
    t.model.BriefingBook()
  }
})

schema.objectType({
  name: 'ClassificationOnDocument',
  definition(t) {
    t.model.id()
    t.model.A({alias:"ClassificationId"})
    t.model.B({alias:"DocumentId"})
    t.model.Classification()
    t.model.Document()
  }
})

schema.objectType({
  name: 'DocumentAuthor',
  definition(t){
    t.model.id()
    t.model.A({alias:"DocumentId"})
    t.model.B({alias:"StakeholderId"})
    t.model.Document()
    t.model.Stakeholder()
  }
})

schema.objectType({
  name: 'DocumentEvent',
  definition(t) {
    t.model.id()
    t.model.A({alias:"DocumentId"})
    t.model.B({alias:"EventId"})
    t.model.Document()
    t.model.Event()
  }
})

schema.objectType({
  name: 'DocumentFile',
  definition(t){
    t.model.id()
    t.model.A({alias:"DocumentId"})
    t.model.B({alias:"FileId"})
    t.model.Document()
    t.model.File()
  }
})

schema.objectType({
  name: 'DocumentInvolvedStakeholder',
  definition(t) {
    t.model.id()
    t.model.A({alias:"StakeholderId"})
    t.model.B({alias:"DocumentId"})
    t.model.Stakeholder()
    t.model.Document()
  }
})

schema.objectType({
  name: 'DocumentLocation',
  definition(t){
    t.model.id()
    t.model.A({alias:"LocationId"})
    t.model.B({alias:"DocumentId"})
    t.model.Location()
    t.model.Document()
  }
})

schema.objectType({
  name: 'KindOnDocument',
  definition(t) {
    t.model.id()
    t.model.A({alias:"KindId"})
    t.model.B({alias:"DocumentId"})
    t.model.Kind()
    t.model.Document()
  }
})

schema.objectType({
  name: 'LocationOnEvent',
  definition(t) {
    t.model.id()
    t.model.A({alias: "LocationId"})
    t.model.B({alias: "EventId"})
    t.model.Location()
    t.model.Event()
  }
})

schema.objectType({
  name: 'StakeholderBriefingBook',
  definition(t){
    t.model.id()
    t.model.A({alias: "StakeholderId"})
    t.model.B({alias: "BriefingBookId"})
    t.model.Stakeholder()
    t.model.BriefingBook()
  }
})

schema.objectType({
  name: 'StakeholderEvent',
  definition(t){
    t.model.id()
    t.model.A({alias: "StakeholderId"})
    t.model.B({alias: "EventId"})
    t.model.Stakeholder()
    t.model.Event()
  }
})

schema.objectType({
  name: 'TagOnDocument',
  definition(t){
    t.model.id()
    t.model.A({alias:"TagId"})
    t.model.B({alias:"DocumentId"})
    t.model.Tag()
    t.model.Document()
  }
})

schema.objectType({
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

schema.queryType({
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

schema.mutationType({
  definition(t) {
    //     ___                  _        
    //    / __| _ _  ___  __ _ | |_  ___ 
    //   | (__ | '_|/ -_)/ _` ||  _|/ -_)
    //    \___||_|  \___|\__,_| \__|\___|
    //                                   
    // Create

    t.crud.createOneLocation()
    t.crud.createOneTag()

    t.crud.createOneClassificationOnDocument()
    t.crud.createOneDocumentAuthor()
    t.crud.createOneDocumentEvent()
    t.crud.createOneDocumentInvolvedStakeholder()
    t.crud.createOneDocumentLocation()
    t.crud.createOneKindOnDocument()
    t.crud.createOneLocationOnEvent()
    t.crud.createOneStakeholderEvent()
    t.crud.createOneTagOnDocument()
    t.crud.createOneTagOnEvent()

    t.field('createUser', {
      type: 'UserAuthPayload',
      args: {
        userName: stringArg(),
        email: stringArg({ nullable: false }),
        password: stringArg({ nullable: false }),
      },
      resolve: async (_parent, { userName, email, password }, ctx) => {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await ctx.db.user.create({
          data: {
            userName,
            email,
            password: hashedPassword,
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

    t.crud.updateOneUser()
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
      }
    })
    t.crud.updateOneEvent({
      async resolve(root, args, ctx, info, originalResolve) {
        if(args.data.eventTags) await ctx.db.queryRaw(`DELETE FROM "TagOnEvent" WHERE "B" = '${args.where.id}';`)
        if(args.data.eventStakeholders) await ctx.db.queryRaw(`DELETE FROM "StakeholderEvent" WHERE "B" = '${args.where.id}';`)
        if(args.data.eventLocations) await ctx.db.queryRaw(`DELETE FROM "LocationOnEvent" WHERE "B" = '${args.where.id}';`)
        const res = await originalResolve(root, args, ctx, info)
        return res
      }
    })
    t.crud.updateOneStakeholder({
      async resolve(root, args, ctx, info, originalResolve) {
        if(args.data.documentsMentionedIn) await ctx.db.queryRaw(`DELETE FROM "DocumentInvolvedStakeholder" WHERE "A" = '${args.where.id}';`)
        if(args.data.documents) await ctx.db.queryRaw(`DELETE FROM "DocumentAuthor" WHERE "B" = '${args.where.id}';`)
        if(args.data.eventsInvolvedIn) await ctx.db.queryRaw(`DELETE FROM "StakeholderEvent" WHERE "A" = '${args.where.id}';`)
        const res = await originalResolve(root, args, ctx, info)
        return res
      }
    })
    t.crud.updateOneLocation({
      async resolve(root, args, ctx, info, originalResolve) {
        if(args.data.documentsMentionedIn) await ctx.db.queryRaw(`DELETE FROM "DocumentLocation" WHERE "A" = '${args.where.id}';`)
        if(args.data.locationEvents) await ctx.db.queryRaw(`DELETE FROM "LocationOnEvent" WHERE "A" = '${args.where.id}';`)
        const res = await originalResolve(root, args, ctx, info)
        return res
      }
    })

    //    ___        _       _        
    //   |   \  ___ | | ___ | |_  ___ 
    //   | |) |/ -_)| |/ -_)|  _|/ -_)
    //   |___/ \___||_|\___| \__|\___|
    //                                
    // Delete

    t.crud.deleteOneUser()
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
      }
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
      }
    })
    t.crud.deleteOneLocation({
      async resolve(root, args, ctx, info, originalResolve) {
        await ctx.db.queryRaw(`DELETE FROM "DocumentLocation" WHERE "A" = '${args.where.id}';`)
        await ctx.db.queryRaw(`DELETE FROM "LocationOnEvent" WHERE "A" = '${args.where.id}';`)
        const res = await originalResolve(root, args, ctx, info)
        return res
      }
    })
    t.crud.deleteOneStakeholder({
      async resolve(root, args, ctx, info, originalResolve) {
        await ctx.db.queryRaw(`DELETE FROM "DocumentAuthor" WHERE "B" = '${args.where.id}';`)
        await ctx.db.queryRaw(`DELETE FROM "DocumentInvolvedStakeholder" WHERE "A" = '${args.where.id}';`)
        await ctx.db.queryRaw(`DELETE FROM "StakeholderBriefingBook" WHERE "A" = '${args.where.id}';`)
        await ctx.db.queryRaw(`DELETE FROM "StakeholderEvent" WHERE "A" = '${args.where.id}';`)
        const res = await originalResolve(root, args, ctx, info)
        return res
      }
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
