import { Field, InputType, ObjectType } from 'type-graphql'

import { Contact, Place, User } from '../models'

// location

@InputType()
export class LocationPointInput {
  @Field()
  latitude!: number

  @Field()
  longitude!: number
}

@ObjectType()
export class LocationPoint {
  @Field()
  latitude!: number

  @Field()
  longitude!: number
}

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
  location?: LocationPointInput

  @Field({
    nullable: true
  })
  googlePlaceId?: string
}

// today

@ObjectType()
export class TodayFeed {
  @Field(() => [Contact])
  contacts!: Contact[]

  @Field(() => [Place])
  places!: Place[]
}
