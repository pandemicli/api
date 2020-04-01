import { random } from 'lodash'
import { Service } from 'typedi'

import { auth, phoneLib } from '../lib'
import { CodeModel, User, UserModel } from '../models'
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
        phone
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

  async signUp(name: string, phone: string): Promise<boolean> {
    await UserModel.create({
      name,
      phone
    })

    const code = random(100000, 999999)

    await CodeModel.findOneAndUpdate(
      {
        phone
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

  async verify(code: string): Promise<AuthResult> {
    const exists = await CodeModel.findOne({
      code
    })

    if (!exists) {
      throw new Error('Invalid code')
    }

    const user = await UserModel.findOne({
      phone: exists.phone
    })

    if (!user) {
      throw new Error('User not found')
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
