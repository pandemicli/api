import moment from 'moment'
import {
  Arg,
  Args,
  Authorized,
  Ctx,
  Mutation,
  Query,
  Resolver
} from 'type-graphql'

import { Place, User } from '../models'
import { PlaceService } from '../services'
import {
  CheckInArgs,
  GooglePlace,
  PlaceInput,
  PlaceSearchArgs,
  UpdatePlaceArgs
} from '../types/graphql'

@Resolver(Place)
export class PlaceResolver {
  constructor(private readonly service: PlaceService) {}

  @Query(() => [Place])
  @Authorized()
  places(
    @Ctx('user') user: User,
    @Arg('date', {
      defaultValue: moment().toISOString(),
      nullable: true
    })
    date: string
  ): Promise<Place[]> {
    return this.service.places(user, date)
  }

  @Mutation(() => Place)
  @Authorized()
  createPlace(
    @Ctx('user') user: User,
    @Arg('place') place: PlaceInput
  ): Promise<Place> {
    return this.service.create(user, place)
  }

  @Mutation(() => Place)
  @Authorized()
  updatePlace(
    @Ctx('user') user: User,
    @Args() { id, place }: UpdatePlaceArgs
  ): Promise<Place> {
    return this.service.update(user, id, place)
  }

  @Mutation(() => Boolean)
  @Authorized()
  removePlace(
    @Ctx('user') user: User,
    @Arg('id') id: string
  ): Promise<boolean> {
    return this.service.remove(user, id)
  }

  @Mutation(() => Boolean)
  @Authorized()
  toggleFavoritePlace(
    @Ctx('user') user: User,
    @Arg('id') id: string
  ): Promise<boolean> {
    return this.service.toggleFavorite(user, id)
  }

  @Mutation(() => Boolean)
  @Authorized()
  toggleCheckIn(
    @Ctx('user') user: User,
    @Args() { date, id }: CheckInArgs
  ): Promise<boolean> {
    return this.service.toggleCheckIn(user, id, date)
  }

  @Query(() => [GooglePlace])
  @Authorized()
  searchPlaces(
    @Args() { language, location, query }: PlaceSearchArgs
  ): Promise<GooglePlace[]> {
    return this.service.searchPlaces(language, query, location)
  }
}
