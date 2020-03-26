import { ArgsType, Field, InputType, ObjectType } from 'type-graphql'

import { Contact, Place, User } from '../models'

// auth

@ArgsType()
export class SignInArgs {
  @Field()
  phone!: string
}

@ArgsType()
export class SignUpArgs {
  @Field()
  email!: string

  @Field()
  name!: string

  @Field()
  phone!: string
}

@ArgsType()
export class VerifyArgs {
  @Field()
  code!: string
}

@ObjectType()
export class AuthResult {
  @Field()
  token!: string

  @Field(() => User)
  user!: User
}

// contacts

@InputType()
export class ContactInput implements Partial<Contact> {
  @Field()
  name!: string

  @Field({
    nullable: true
  })
  phone?: string

  @Field({
    nullable: true
  })
  deviceId?: string
}

@ArgsType()
export class CreateContactArgs {
  @Field()
  contact!: ContactInput
}

@ArgsType()
export class UpdateContactArgs {
  @Field()
  id!: string

  @Field()
  contact!: ContactInput
}

@ArgsType()
export class SyncContactsArgs {
  @Field(() => [ContactInput])
  contacts!: ContactInput[]
}

@ArgsType()
export class InteractionArgs {
  @Field()
  id!: string

  @Field()
  date!: string
}

// places

@InputType()
export class PlaceInput implements Partial<Place> {
  @Field()
  name!: string

  @Field(() => [Number], {
    nullable: true
  })
  location?: number[]

  @Field({
    nullable: true
  })
  googlePlaceId?: string
}

@ArgsType()
export class CreatePlaceArgs {
  @Field()
  place!: PlaceInput
}

@ArgsType()
export class UpdatePlaceArgs {
  @Field()
  id!: string

  @Field()
  place!: PlaceInput
}

@ArgsType()
export class CheckInArgs {
  @Field()
  id!: string

  @Field()
  date!: string
}

// today

@ObjectType()
export class TodayFeed {
  @Field(() => [Contact])
  contacts!: Contact[]

  @Field(() => [Place])
  places!: Place[]
}
