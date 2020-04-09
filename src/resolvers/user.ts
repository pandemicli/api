import { DocumentType } from '@typegoose/typegoose'
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
  signIn(
    @Arg('email') email: string,
    @Arg('password') password: string
  ): Promise<boolean> {
    return this.service.signIn(email, password)
  }

  @Mutation(() => Boolean)
  signUp(
    @Arg('name') name: string,
    @Arg('email') email: string,
    @Arg('password') password: string,
    @Arg('phone') phone: string
  ): Promise<boolean> {
    return this.service.signUp(name, email, password, phone)
  }

  @Mutation(() => AuthResult)
  verify(@Arg('code') code: string): Promise<AuthResult> {
    return this.service.verify(code)
  }

  @Mutation(() => Boolean)
  @Authorized()
  changePassword(
    @Ctx('user') user: DocumentType<User>,
    @Arg('currentPassword') currentPassword: string,
    @Arg('newPassword') newPassword: string
  ): Promise<boolean> {
    return this.service.changePassword(user, currentPassword, newPassword)
  }

  @Mutation(() => Boolean)
  @Authorized()
  deleteAccount(
    @Ctx('user') user: DocumentType<User>,
    @Arg('password') password: string
  ): Promise<boolean> {
    return this.service.deleteAccount(user, password)
  }

  @Mutation(() => Boolean)
  @Authorized()
  toggleCovid19Positive(@Ctx('user') user: User): Promise<boolean> {
    return this.service.toggleCovid19Positive(user)
  }
}
