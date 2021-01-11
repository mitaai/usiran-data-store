import { Context } from "./context";
import { ApolloServerPlugin, GraphQLRequestContext } from 'apollo-server-plugin-base';

export const loggingPlugin: ApolloServerPlugin = ({

  // Fires whenever a GraphQL request is received from a client.
  requestDidStart(requestContext: GraphQLRequestContext) {
    console.log('Request started! Query:\n' +
      requestContext.request.query);
    console.log(requestContext.request.http?.headers)

    return {

      // Fires whenever Apollo Server will parse a GraphQL
      // request to create its associated document AST.
      parsingDidStart(requestContext: GraphQLRequestContext) {
        console.log('Parsing started!');
      },

      // Fires whenever Apollo Server will validate a
      // request's document AST against your GraphQL schema.
      validationDidStart(requestContext: GraphQLRequestContext) {
        console.log('Validation started!');
      },

    }
  },
});