import { Field, InputType, ObjectType } from 'type-graphql'

import { Contact, Place, User } from '../models'

// location

@ObjectType()
export class GooglePlace {
  @Field()
  id!: string

  @Field()
  name!: string

  @Field()
  latitude!: number

  @Field()
  longitude!: number
}

// auth

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
  phoneHash?: string

  @Field({
    nullable: true
  })
  deviceId?: string
}

// places

@InputType()
export class PlaceInput implements Partial<Place> {
  @Field()
  name!: string

  @Field({
    nullable: true
  })
  latitude?: string

  @Field({
    nullable: true
  })
  latitudeHash?: string

  @Field({
    nullable: true
  })
  longitude?: string

  @Field({
    nullable: true
  })
  longitudeHash?: string

  @Field({
    nullable: true
  })
  googlePlaceId?: string

  @Field({
    nullable: true
  })
  googlePlaceIdHash?: string
}

// today

@ObjectType()
export class TodayFeed {
  @Field(() => [Contact])
  contacts!: Contact[]

  @Field(() => [Place])
  places!: Place[]
}
