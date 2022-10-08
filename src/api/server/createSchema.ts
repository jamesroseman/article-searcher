import 'reflect-metadata';

import { GraphQLSchema } from 'graphql';
import { buildSchema } from 'type-graphql';

import HelloWorldResolver from '../resolvers/HelloWorldResolver';
import ArticleSearchResolver from '../resolvers/ArticleSearchResolver';

export default async function createSchema(): Promise<GraphQLSchema> {
  return buildSchema({
    resolvers: [
      HelloWorldResolver,
      ArticleSearchResolver,
    ],
  });
}