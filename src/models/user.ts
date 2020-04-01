import {
  arrayProp,
  getModelForClass,
  index,
  modelOptions,
  prop,
  Ref
} from '@typegoose/typegoose'
import { TimeStamps } from '@typegoose/typegoose/lib/defaultClasses'
import shortid from 'shortid'
import { Field, ID, ObjectType } from 'type-graphql'

import { Contact } from './contact'
import { Place } from './place'

@ObjectType()
@modelOptions({
  schemaOptions: {
    timestamps: true
  }
})
@index(
  {
    phone: 1
  },
  {
    unique: true
  }
)
export class User extends TimeStamps {
  @Field(() => ID)
  id!: string

  @Field()
  @prop({
    default: shortid.generate
  })
  code!: string

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
  phone!: string

  @Field()
  @prop({
    default: false
  })
  covid19Positive!: boolean

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

  @arrayProp({
    foreignField: 'user',
    localField: '_id',
    options: {
      sort: {
        createdAt: -1
      }
    },
    ref: 'Place'
  })
  places!: Ref<Place>[]

  @Field()
  createdAt!: Date

  @Field()
  updatedAt!: Date
}

export const UserModel = getModelForClass(User)
