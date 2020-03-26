import { getModelForClass, modelOptions, prop } from '@typegoose/typegoose'
import { TimeStamps } from '@typegoose/typegoose/lib/defaultClasses'

@modelOptions({
  schemaOptions: {
    timestamps: true
  }
})
export class Code extends TimeStamps {
  @prop({
    required: true
  })
  phone!: string

  @prop({
    required: true
  })
  code!: string
}

export const CodeModel = getModelForClass(Code)
