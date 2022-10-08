import { ApolloServer, ExpressContext } from 'apollo-server-express';
import { GraphQLResponse } from 'apollo-server-types';
import { Express } from 'express';
import gql from 'graphql-tag';

import createServer, { APIServer } from '../../server/createServer';

describe('HelloWorldResolver', () => {
  let server: ApolloServer<ExpressContext>;
  let app: Express;

  beforeAll(async () => {
    const apiServer: APIServer = await createServer();
    server = apiServer.server;
    app = apiServer.app;
  })

  it('does get expected response', async () => {
    const response: GraphQLResponse = await server.executeOperation({
      query: gql`
        {
          ping {
            message
          }
        }
      `,
    });
    const expectedData = {
      ping: {
        message: 'pong!',
      }
    };
    expect(response.data).toEqual(expectedData);
  });
});