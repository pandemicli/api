import { Args, Authorized, Ctx, Mutation, Query, Resolver } from 'type-graphql'

import { User } from '../models'
import { UserService } from '../services'
import {
  AuthResult,
  SignInArgs,
  SignUpArgs,
  VerifyArgs
} from '../types/graphql'

@Resolver(User)
export class UserResolver {
  constructor(private readonly service: UserService) {}

  @Query(() => User)
  @Authorized()
  profile(@Ctx('user') user: User): User {
    return user
  }

  @Mutation(() => Boolean)
  signIn(@Args() { phone }: SignInArgs): Promise<boolean> {
    return this.service.signIn(phone)
  }

  @Mutation(() => Boolean)
  signUp(@Args() { email, name, phone }: SignUpArgs): Promise<boolean> {
    return this.service.signUp(email, name, phone)
  }

  @Mutation(() => AuthResult)
  verify(@Args() { code }: VerifyArgs): Promise<AuthResult> {
    return this.service.verify(code)
  }
}
