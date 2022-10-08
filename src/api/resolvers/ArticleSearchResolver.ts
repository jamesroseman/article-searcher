import {
  Args, ArgsType, Field, ObjectType, Query, Resolver,
} from 'type-graphql';

@ArgsType()
export class ArticleSearchResolverArgs {
  @Field(() => String)
  searchTerm: string;
}

@ObjectType()
class ArticleSearchResult {
  @Field(() => String)
  url: string;

  @Field(() => Number)
  ranking: number;
}

@ObjectType()
class ArticleSearchResolverResponse {
  @Field(() => [ArticleSearchResult])
  results: ArticleSearchResult[];
}

@Resolver()
export default class ArticleSearchResolver {
  @Query(() => ArticleSearchResolverResponse)
  async search(@Args() { 
    searchTerm 
  }: ArticleSearchResolverArgs): Promise<ArticleSearchResolverResponse> {
    return { results: [] };
  }
}