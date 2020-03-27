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
    @Arg('email') email: string,
    @Arg('name') name: string,
    @Arg('phone') phone: string
  ): Promise<boolean> {
    return this.service.signUp(email, name, phone)
  }

  @Mutation(() => AuthResult)
  verify(@Arg('code') code: string): Promise<AuthResult> {
    return this.service.verify(code)
  }
}
