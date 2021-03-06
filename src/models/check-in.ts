import {
  getModelForClass,
  index,
  modelOptions,
  prop,
  Ref
} from '@typegoose/typegoose'
import { TimeStamps } from '@typegoose/typegoose/lib/defaultClasses'
import { Field, ObjectType } from 'type-graphql'

import { Place } from './place'
import { User } from './user'

@ObjectType()
@modelOptions({
  schemaOptions: {
    timestamps: true
  }
})
@index(
  {
    user: 1,
    // eslint-disable-next-line sort-keys-fix/sort-keys-fix
    place: 1,
    // eslint-disable-next-line sort-keys-fix/sort-keys-fix
    checkedInAt: 1
  },
  {
    unique: true
  }
)
export class CheckIn extends TimeStamps {
  @Field(() => Place)
  @prop({
    ref: 'Place',
    required: true
  })
  place!: Ref<Place>

  @Field(() => User)
  @prop({
    ref: 'User',
    required: true
  })
  user!: Ref<User>

  @Field()
  @prop({
    required: true
  })
  checkedInAt!: Date

  @Field()
  createdAt!: Date

  @Field()
  updatedAt!: Date
}

export const CheckInModel = getModelForClass(CheckIn)
