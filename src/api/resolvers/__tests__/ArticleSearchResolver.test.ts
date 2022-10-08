import { ApolloServer, ExpressContext } from 'apollo-server-express';
import { GraphQLResponse } from 'apollo-server-types';
import { Express } from 'express';
import gql from 'graphql-tag';

import createServer, { APIServer } from '../../server/createServer';
import { ArticleSearchResolverResponse } from '../ArticleSearchResolver';

describe('ArticleSearchResolver', () => {
  let server: ApolloServer<ExpressContext>;
  let app: Express;

  beforeAll(async () => {
    const apiServer: APIServer = await createServer();
    server = apiServer.server;
    app = apiServer.app;
  })

  it('receives articles in response to search', async () => {
    const response: GraphQLResponse = await server.executeOperation({
      query: gql`
        {
          search(searchTerm:"James Madison") {
            results {
              url,
              ranking
            }
          }
        }
      `,
    });
    const { results } = response.data?.search as ArticleSearchResolverResponse;
    expect(results.length).toBeGreaterThan(0);
  });
});