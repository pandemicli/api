import {
  arrayProp,
  getModelForClass,
  modelOptions,
  prop,
  Ref
} from '@typegoose/typegoose'
import { TimeStamps } from '@typegoose/typegoose/lib/defaultClasses'
import { Field, ID, ObjectType } from 'type-graphql'

import { CheckIn } from './check-in'
import { User } from './user'

@ObjectType()
@modelOptions({
  schemaOptions: {
    timestamps: true
  }
})
export class Place extends TimeStamps {
  @Field(() => ID)
  id!: string

  @Field()
  @prop({
    required: true
  })
  name!: string

  @Field()
  @prop({
    default: false
  })
  favorite?: boolean

  @Field({
    nullable: true
  })
  @prop()
  latitude?: string

  @Field({
    nullable: true
  })
  @prop()
  latitudeHash?: string

  @Field({
    nullable: true
  })
  @prop()
  longitude?: string

  @Field({
    nullable: true
  })
  @prop()
  longitudeHash?: string

  @Field({
    nullable: true
  })
  @prop()
  googlePlaceId?: string

  @Field({
    nullable: true
  })
  @prop()
  googlePlaceIdHash?: string

  @Field(() => User)
  @prop({
    ref: 'User',
    required: true
  })
  user!: Ref<User>

  @arrayProp({
    foreignField: 'place',
    localField: '_id',
    options: {
      sort: {
        createdAt: -1
      }
    },
    ref: 'CheckIn'
  })
  checkIns!: Ref<CheckIn>[]

  @Field()
  checkedInToday?: boolean

  @Field()
  createdAt!: Date

  @Field()
  updatedAt!: Date
}

export const PlaceModel = getModelForClass(Place)
