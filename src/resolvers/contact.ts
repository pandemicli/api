import moment from 'moment'
import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from 'type-graphql'

import { Contact, User } from '../models'
import { ContactService } from '../services'
import { ContactInput } from '../types/graphql'

@Resolver(Contact)
export class ContactResolver {
  constructor(private readonly service: ContactService) {}

  @Query(() => [Contact])
  @Authorized()
  contacts(
    @Ctx('user') user: User,
    @Arg('date', {
      defaultValue: moment().startOf('day').toISOString(),
      nullable: true
    })
    date: string
  ): Promise<Contact[]> {
    return this.service.contacts(user, date)
  }

  @Mutation(() => Contact)
  @Authorized()
  createContact(
    @Ctx('user') user: User,
    @Arg('contact') contact: ContactInput
  ): Promise<Contact> {
    return this.service.create(user, contact)
  }

  @Mutation(() => Contact)
  @Authorized()
  updateContact(
    @Ctx('user') user: User,
    @Arg('id') id: string,
    @Arg('contact') contact: ContactInput
  ): Promise<Contact> {
    return this.service.update(user, id, contact)
  }

  @Mutation(() => Boolean)
  @Authorized()
  removeContact(
    @Ctx('user') user: User,
    @Arg('id') id: string
  ): Promise<boolean> {
    return this.service.remove(user, id)
  }

  @Mutation(() => Boolean)
  @Authorized()
  toggleFavoriteContact(
    @Ctx('user') user: User,
    @Arg('id') id: string
  ): Promise<boolean> {
    return this.service.toggleFavorite(user, id)
  }

  @Mutation(() => Boolean)
  @Authorized()
  toggleInteraction(
    @Ctx('user') user: User,
    @Arg('id') id: string,
    @Arg('date') date: string
  ): Promise<boolean> {
    return this.service.toggleInteraction(user, id, date)
  }

  @Mutation(() => [Contact])
  @Authorized()
  syncContacts(
    @Ctx('user') user: User,
    @Arg('contacts', () => [ContactInput]) contacts: ContactInput[]
  ): Promise<Contact[]> {
    return this.service.sync(user, contacts)
  }

  @Mutation(() => User)
  @Authorized()
  addContact(@Arg('code') code: string): Promise<User> {
    return this.service.add(code)
  }
}
