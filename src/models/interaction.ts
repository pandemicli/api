import {
  getModelForClass,
  index,
  modelOptions,
  prop,
  Ref
} from '@typegoose/typegoose'
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
@index(
  {
    user: 1,
    // eslint-disable-next-line sort-keys-fix/sort-keys-fix
    contact: 1,
    // eslint-disable-next-line sort-keys-fix/sort-keys-fix
    interactedAt: 1
  },
  {
    unique: true
  }
)
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
