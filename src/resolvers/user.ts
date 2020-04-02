import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from 'type-graphql'

import { User } from '../models'
import { UserService } from '../services'
import { AuthResult } from '../types/graphql'

@Resolver(User)
export class UserResolver {
  constructor(private readonly service: UserService) {}

  @Query(() => User)
  @Authorized()
  profile(@Ctx('user') user: User): User {
    return user
  }

  @Mutation(() => Boolean)
  signIn(@Arg('phone') phone: string): Promise<boolean> {
    return this.service.signIn(phone)
  }

  @Mutation(() => Boolean)
  signUp(
    @Arg('name') name: string,
    @Arg('email') email: string,
    @Arg('phone') phone: string
  ): Promise<boolean> {
    return this.service.signUp(name, email, phone)
  }

  @Mutation(() => AuthResult)
  verify(@Arg('code') code: string): Promise<AuthResult> {
    return this.service.verify(code)
  }

  @Mutation(() => Boolean)
  toggleCovid19Positive(@Ctx('user') user: User): Promise<boolean> {
    return this.service.toggleCovid19Positive(user)
  }
}
