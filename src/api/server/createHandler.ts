import { ApolloServer, gql } from 'apollo-server-cloud-functions';

import createSchema from './createSchema';

export default async function createHandler(): Promise<any> {
  const schema = await createSchema();
  const apolloServer = new ApolloServer({ schema, introspection: true });
  return apolloServer.createHandler();
}