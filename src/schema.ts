import * as path from 'path';
import { ApolloServer } from 'apollo-server-express';
import express from 'express'
import { nexusPrisma } from 'nexus-plugin-prisma';
import { DateTimeResolver } from 'graphql-scalars';
import { asNexusMethod, makeSchema, fieldAuthorizePlugin } from 'nexus';
import { db } from './context';
import * as HTTP from 'http'
import * as types from './graphql';

export const schema = makeSchema({
  types: [
    asNexusMethod(DateTimeResolver, 'date'),
    types,
  ],
  sourceTypes: {
    modules: [
      {
        module: require.resolve('../node_modules/.prisma/client/index.d.ts'),
        alias: "prisma",
      }
    ]
  },
  contextType: {
    module: require.resolve('./context'),
    export: 'context',
    alias: 'ContextModule'
  },
  shouldExitAfterGenerateArtifacts: process.env.NEXUS_SHOULD_EXIT_AFTER_GENERATE_ARTIFACTS === 'true',
  plugins: [nexusPrisma({
    experimentalCRUD: true,
    scalars: {
      DateTime: DateTimeResolver,
    }
  }),
  fieldAuthorizePlugin()],
  outputs: {
    typegen: path.join(__dirname, '../node_modules/@types/typegen-nexus/index.d.ts'),
    schema: path.join(__dirname, './schema.graphql'),
  },
});



const apollo = new ApolloServer({
  context: () => ({ db }),
  schema,
})
const app = express()
const http = HTTP.createServer(app)

apollo.applyMiddleware({ app })

http.listen(4000, () => {
  console.log(`🚀 GraphQL service ready at http://localhost:4000/graphql`)
})