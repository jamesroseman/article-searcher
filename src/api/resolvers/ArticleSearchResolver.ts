import {
  Args, ArgsType, Field, ObjectType, Query, Resolver,
} from 'type-graphql';
import ArticleSearcher from '../../utils/ArticleSearcher';
import { ArticleRanking } from '../../utils/SearchRelevanceScore';

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
    const searcher: ArticleSearcher = new ArticleSearcher();
    const rankings: ArticleRanking[] = await searcher.search(searchTerm);
    
    // Transform the rankings into an API response.
    const results: ArticleSearchResult[] = rankings.map((ranking: ArticleRanking) => ({
      url: ranking.url,
      ranking: ranking.ranking,
    }));

    return { results };
  }
}