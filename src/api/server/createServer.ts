import { ApolloServer, ExpressContext } from 'apollo-server-express';
import express, { Express } from 'express';

import createSchema from './createSchema';

export type APIServer = {
  server: ApolloServer<ExpressContext>;
  app: Express;
}

export default async function createServer(): Promise<APIServer> {
  const app = express();
  const schema = await createSchema();
  const apolloServer = new ApolloServer({ schema });
  await apolloServer.start();
  await apolloServer.applyMiddleware({ app, path: '/' });
  return {
    server: apolloServer,
    app,
  };
}