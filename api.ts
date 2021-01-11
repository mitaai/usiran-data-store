import * as path from 'path';
import { ApolloServer } from 'apollo-server-express';
import express from 'express'
import { nexusPrisma } from 'nexus-plugin-prisma';
import { DateTimeResolver } from 'graphql-scalars';
import { asNexusMethod, makeSchema, fieldAuthorizePlugin, connectionPluginCore } from 'nexus';
import { db } from './context';
import * as HTTP from 'http'
import * as types from './graphql';
import cors from 'cors';
import { loggingPlugin } from './loggingPlugin'

export const schema = makeSchema({
  types: [
    asNexusMethod(DateTimeResolver, 'date'),
    types,
  ],
  sourceTypes: {
    modules: [{ module: '.prisma/client', alias: 'PrismaClient' }],
  },
  contextType: {
    module: require.resolve('./context'),
    export: 'Context',
    alias: 'ContextModule'
  },
  shouldExitAfterGenerateArtifacts: Boolean(
    process.env.NEXUS_SHOULD_EXIT_AFTER_REFLECTION,
  ),
  shouldGenerateArtifacts: Boolean(
    process.env.NEXUS_SHOULD_GENERATE_ARTIFACTS,
  ),
  plugins: [nexusPrisma({
    prismaClient: (ctx) => ctx.db,
    experimentalCRUD: true,
    scalars: {
      DateTime: DateTimeResolver,
    },
    shouldGenerateArtifacts: Boolean(
      process.env.NEXUS_SHOULD_GENERATE_ARTIFACTS,
    )
  }),
  fieldAuthorizePlugin()],
  outputs: {
    typegen: path.join(
      __dirname,
      'node_modules/@types/nexus-typegen/index.d.ts',
    ),
    schema: path.join(__dirname, './api.graphql'),
  },
});

const apollo = new ApolloServer({
  context: (ctx) => {
    return { 
      db,
      req: ctx.req,
      res: ctx.res,
    }
  },
  schema,
  plugins: [
    loggingPlugin,
  ],
})

const app = express()
app.use(cors({ credentials: true, origin: "https://irus.vercel.app" }))
const http = HTTP.createServer(app)

apollo.applyMiddleware({
  app,
  cors: false,
})

const PORT = process.env.PORT || 4000;

http.listen(PORT, () => {
  console.log(`🚀 GraphQL service ready at http://localhost:4000/graphql`)
})