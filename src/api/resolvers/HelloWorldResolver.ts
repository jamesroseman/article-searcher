import {
  Field, ObjectType, Query, Resolver,
} from 'type-graphql';

@ObjectType()
class HelloWorldResponse {
  @Field(() => String)
  message: string;
}

@Resolver()
export default class HelloWorldResolver {
  @Query(() => HelloWorldResponse)
  ping(): HelloWorldResponse {
    return { message: 'pong!' };
  }
}