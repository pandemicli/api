import { Arg, Authorized, Ctx, Query, Resolver } from 'type-graphql'

import { User } from '../models'
import { TodayService } from '../services'
import { TodayFeed } from '../types/graphql'

@Resolver()
export class TodayResolver {
  constructor(private readonly service: TodayService) {}

  @Query(() => TodayFeed)
  @Authorized()
  todayFeed(
    @Ctx('user') user: User,
    @Arg('date')
    date: string
  ): Promise<TodayFeed> {
    return this.service.feed(user, date)
  }
}
