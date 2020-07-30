import cors from 'cors';
import { use, schema, server } from 'nexus';
import { prisma } from 'nexus-plugin-prisma';
import { arg } from '@nexus/schema';

server.express.use(cors())

use(prisma({ 
  migrations: false,
  client: { options: { log: ['query'] } },
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
    t.model.firstName()
    t.model.id()
    t.model.lastName()
    t.model.role()
    t.model.updatedAt()
    t.model.userName()
  },
})

schema.objectType({
  name: 'SignInUserPayload',
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
  name: 'KindOnDocument',
  definition(t) {
    t.model.id()
    t.model.Document()
    t.model.Kind()
  }
})

schema.objectType({
  name: 'TagOnDocument',
  definition(t){
    t.model.id()
    t.model.Tag()
    t.model.Document()
  }
})

schema.objectType({
  name: 'BriefingBookDocument',
  definition(t) {
    t.model.id()
    t.model.BriefingBook()
    t.model.Document()
  }
})

schema.objectType({
  name: 'BriefingBookEvent',
  definition(t){
    t.model.id()
    t.model.BriefingBook()
    t.model.Event()
  }
})

schema.objectType({
  name: 'ClassificationOnDocument',
  definition(t) {
    t.model.id()
    t.model.Classification()
    t.model.Document()
  }
})

schema.objectType({
  name: 'DocumentAuthor',
  definition(t){
    t.model.id()
    t.model.Document()
    t.model.Stakeholder()
  }
})

schema.objectType({
  name: 'DocumentEvent',
  definition(t) {
    t.model.id()
    t.model.Document()
    t.model.Event()
  }
})

schema.objectType({
  name: 'DocumentFile',
  definition(t){
    t.model.id()
    t.model.Document()
    t.model.File()
  }
})

schema.objectType({
  name: 'DocumentInvolvedStakeholder',
  definition(t) {
    t.model.id()
    t.model.Document()
    t.model.Stakeholder()
  }
})

schema.objectType({
  name: 'DocumentLocation',
  definition(t){
    t.model.id()
    t.model.Document()
    t.model.Location()
  }
})

schema.objectType({
  name: 'LocationOnEvent',
  definition(t) {
    t.model.id()
    t.model.Location()
    t.model.Event()
  }
})

schema.objectType({
  name: 'StakeholderBriefingBook',
  definition(t){
    t.model.id()
    t.model.Stakeholder()
    t.model.BriefingBook()
  }
})

schema.objectType({
  name: 'StakeholderEvent',
  definition(t){
    t.model.id()
    t.model.Stakeholder()
    t.model.Event()
  }
})

schema.objectType({
  name: 'TagOnEvent',
  definition(t){
    t.model.id()
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
    t.crud.createOneUser()
    t.crud.updateOneUser()
    t.crud.deleteOneUser()
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
