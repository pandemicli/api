import { random } from 'lodash'
import { MongooseFilterQuery } from 'mongoose'
import { Service } from 'typedi'

import { auth, phoneLib } from '../lib'
import { CodeModel, User, UserModel } from '../models'
import { CodeType } from '../types'
import { AuthResult } from '../types/graphql'

@Service()
export class UserService {
  async signIn(phone: string): Promise<boolean> {
    const user = await UserModel.findOne({
      phone
    })

    if (!user) {
      throw new Error('User not found')
    }

    const code = random(100000, 999999)

    await CodeModel.findOneAndUpdate(
      {
        data: phone,
        type: CodeType.phone
      },
      {
        code
      },
      {
        upsert: true
      }
    )

    await phoneLib.sendVerificationCode(phone, code)

    return true
  }

  async signUp(name: string, email: string, phone: string): Promise<boolean> {
    await UserModel.create({
      email,
      name,
      phone
    })

    const code = random(100000, 999999)

    await CodeModel.findOneAndUpdate(
      {
        data: phone,
        type: CodeType.phone
      },
      {
        code
      },
      {
        upsert: true
      }
    )

    await CodeModel.findOneAndUpdate(
      {
        data: email,
        type: CodeType.email
      },
      {
        code
      },
      {
        upsert: true
      }
    )

    await phoneLib.sendVerificationCode(phone, code)
    // TODO: send email

    return true
  }

  async verify(code: string): Promise<AuthResult> {
    const exists = await CodeModel.findOne({
      code
    })

    if (!exists) {
      throw new Error('Invalid code')
    }

    const query: MongooseFilterQuery<User> = {}

    if (exists.type === CodeType.email) {
      query.email = exists.data
    } else if (exists.type === CodeType.phone) {
      query.phone = exists.data
    } else {
      throw new Error('Invalid code')
    }

    const user = await UserModel.findOne(query)

    if (!user) {
      throw new Error('User not found')
    }

    if (exists.type === CodeType.email && !user.emailVerified) {
      user.emailVerified = true

      await user.save()
    } else if (exists.type === CodeType.phone && !user.phoneVerified) {
      user.phoneVerified = true

      await user.save()
    }

    await exists.remove()

    const token = auth.createToken(user)

    return {
      token,
      user
    }
  }

  async toggleCovid19Positive(user: User): Promise<boolean> {
    const covid19Positive = !user.covid19Positive

    await UserModel.findByIdAndUpdate(user.id, {
      covid19Positive
    })

    return covid19Positive
  }
}
