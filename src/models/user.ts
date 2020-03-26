import {
  arrayProp,
  getModelForClass,
  modelOptions,
  prop,
  Ref
} from '@typegoose/typegoose'
import { TimeStamps } from '@typegoose/typegoose/lib/defaultClasses'
import { Field, ID, ObjectType } from 'type-graphql'

import { Contact } from './contact'

@ObjectType()
@modelOptions({
  schemaOptions: {
    timestamps: true
  }
})
export class User extends TimeStamps {
  @Field(() => ID)
  id!: string

  @Field()
  @prop({
    required: true
  })
  name!: string

  @Field()
  @prop({
    required: true,
    unique: true
  })
  email!: string

  @Field()
  @prop({
    required: true,
    unique: true
  })
  phone!: string

  @Field(() => [Contact])
  @arrayProp({
    foreignField: 'user',
    localField: '_id',
    options: {
      sort: {
        createdAt: -1
      }
    },
    ref: 'Contact'
  })
  contacts!: Ref<Contact>[]

  @Field()
  createdAt!: Date

  @Field()
  updatedAt!: Date
}

export const UserModel = getModelForClass(User)