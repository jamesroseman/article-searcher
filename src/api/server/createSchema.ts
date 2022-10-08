import 'reflect-metadata';

import { GraphQLSchema } from 'graphql';
import { buildSchema } from 'type-graphql';

import HelloWorldResolver from '../resolvers/HelloWorldResolver';

export default async function createSchema(): Promise<GraphQLSchema> {
  return buildSchema({
    resolvers: [
      HelloWorldResolver,
    ],
  });
}