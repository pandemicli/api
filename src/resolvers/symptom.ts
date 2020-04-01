import { Arg, Authorized, Ctx, Mutation, Resolver } from 'type-graphql'

import { Symptom, User } from '../models'
import { SymptomService } from '../services'
import { SymptomName } from '../types/graphql'

@Resolver(Symptom)
export class SymptomResolver {
  constructor(private readonly service: SymptomService) {}

  @Mutation(() => Boolean)
  @Authorized()
  toggleSymptom(
    @Ctx('user') user: User,
    @Arg('name', () => SymptomName) name: SymptomName,
    @Arg('date') date: string
  ): Promise<boolean> {
    return this.service.toggleSymptom(user, name, date)
  }
}
