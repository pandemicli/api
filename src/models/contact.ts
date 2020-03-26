import {
  arrayProp,
  getModelForClass,
  modelOptions,
  prop,
  Ref
} from '@typegoose/typegoose'
import { TimeStamps } from '@typegoose/typegoose/lib/defaultClasses'
import { Field, ID, ObjectType } from 'type-graphql'

import { Interaction } from './interaction'
import { User } from './user'

@ObjectType()
@modelOptions({
  schemaOptions: {
    timestamps: true
  }
})
export class Contact extends TimeStamps {
  @Field(() => ID)
  id!: string

  @Field()
  @prop({
    required: true
  })
  name!: string

  @Field({
    nullable: true
  })
  @prop()
  phone?: string

  @Field()
  @prop({
    default: false
  })
  favorite?: boolean

  @Field({
    nullable: true
  })
  @prop()
  deviceId?: string

  @Field(() => User)
  @prop({
    ref: 'User',
    required: true
  })
  user!: Ref<User>

  @Field(() => [Interaction])
  @arrayProp({
    foreignField: 'contact',
    localField: '_id',
    options: {
      sort: {
        createdAt: -1
      }
    },
    ref: 'Interaction'
  })
  interactions!: Ref<Interaction>[]

  @Field()
  interactedToday?: boolean

  @Field()
  createdAt!: Date

  @Field()
  updatedAt!: Date
}

export const ContactModel = getModelForClass(Contact)
