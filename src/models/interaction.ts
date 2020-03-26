import { getModelForClass, modelOptions, prop, Ref } from '@typegoose/typegoose'
import { TimeStamps } from '@typegoose/typegoose/lib/defaultClasses'
import { Field, ObjectType } from 'type-graphql'

import { Contact } from './contact'
import { User } from './user'

@ObjectType()
@modelOptions({
  schemaOptions: {
    timestamps: true
  }
})
export class Interaction extends TimeStamps {
  @Field(() => Contact)
  @prop({
    ref: 'Contact',
    required: true
  })
  contact!: Ref<Contact>

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
  interactedAt!: Date

  @Field()
  createdAt!: Date

  @Field()
  updatedAt!: Date
}

export const InteractionModel = getModelForClass(Interaction)
