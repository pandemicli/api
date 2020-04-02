import {
  getModelForClass,
  index,
  modelOptions,
  prop
} from '@typegoose/typegoose'
import { TimeStamps } from '@typegoose/typegoose/lib/defaultClasses'

import { CodeType } from '../types'

@modelOptions({
  schemaOptions: {
    timestamps: true
  }
})
@index(
  {
    code: 1,
    data: 1
  },
  {
    unique: true
  }
)
export class Code extends TimeStamps {
  @prop({
    required: true
  })
  data!: string

  @prop({
    enum: CodeType,
    required: true
  })
  type!: string

  @prop({
    required: true
  })
  code!: string
}

export const CodeModel = getModelForClass(Code)
