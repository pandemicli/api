import {
  getModelForClass,
  index,
  modelOptions,
  prop,
  Ref
} from '@typegoose/typegoose'
import { TimeStamps } from '@typegoose/typegoose/lib/defaultClasses'

import { SymptomName } from '../types/graphql'
import { User } from './user'

@modelOptions({
  schemaOptions: {
    timestamps: true
  }
})
@index(
  {
    user: 1,
    // eslint-disable-next-line sort-keys-fix/sort-keys-fix
    name: 1,
    // eslint-disable-next-line sort-keys-fix/sort-keys-fix
    experiencedAt: 1
  },
  {
    unique: true
  }
)
@index({
  // eslint-disable-next-line sort-keys-fix/sort-keys-fix
  name: 1,
  // eslint-disable-next-line sort-keys-fix/sort-keys-fix
  experiencedAt: 1
})
export class Symptom extends TimeStamps {
  @prop({
    enum: SymptomName,
    required: true
  })
  name!: string

  @prop({
    ref: 'User',
    required: true
  })
  user!: Ref<User>

  @prop({
    required: true
  })
  experiencedAt!: Date
}

export const SymptomModel = getModelForClass(Symptom)
