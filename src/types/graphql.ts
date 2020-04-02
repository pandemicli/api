import { Field, InputType, ObjectType, registerEnumType } from 'type-graphql'

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
  email?: string

  @Field({
    nullable: true
  })
  emailHash?: string

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
  deviceIdHash?: string
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

// symptoms

/* eslint-disable @typescript-eslint/camelcase */
export enum SymptomName {
  aches_and_pains = 'aches_and_pains',
  diarrhea = 'diarrhea',
  dry_cough = 'dry_cough',
  fever = 'fever',
  nasal_congestion = 'nasal_congestion',
  runny_nose = 'runny_nose',
  sore_throat = 'sore_throat',
  tiredness = 'tiredness'
}
/* eslint-enable @typescript-eslint/camelcase */

@ObjectType()
export class Symptom {
  @Field(() => SymptomName)
  name!: SymptomName

  @Field()
  experiencedToday?: boolean
}

registerEnumType(SymptomName, {
  name: 'SymptomName'
})

// today

@ObjectType()
export class TodayFeed {
  @Field(() => [Contact])
  contacts!: Contact[]

  @Field(() => [Place])
  places!: Place[]

  @Field(() => [Symptom])
  symptoms!: Symptom[]
}
