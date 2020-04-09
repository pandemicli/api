import { DocumentType } from '@typegoose/typegoose'
import { random } from 'lodash'
import { Service } from 'typedi'

import { auth, phoneLib } from '../lib'
import {
  CheckInModel,
  CodeModel,
  ContactModel,
  InteractionModel,
  PlaceModel,
  SymptomModel,
  User,
  UserModel
} from '../models'
import { CodeType } from '../types'
import { AuthResult } from '../types/graphql'

@Service()
export class UserService {
  async signIn(email: string, password: string): Promise<boolean> {
    const user = await UserModel.findOne({
      email
    })

    if (!user) {
      throw new Error('User not found')
    }

    if (!(await auth.checkPassword(password, user))) {
      throw new Error('Invalid password')
    }

    const code = random(100000, 999999)

    // await CodeModel.findOneAndUpdate(
    //   {
    //     data: user.email,
    //     type: CodeType.email
    //   },
    //   {
    //     code
    //   },
    //   {
    //     upsert: true
    //   }
    // )

    // // TODO: send email

    await CodeModel.findOneAndUpdate(
      {
        data: user.phone,
        type: CodeType.phone
      },
      {
        code
      },
      {
        upsert: true
      }
    )

    await phoneLib.sendVerificationCode(user.phone, code)

    return true
  }

  async signUp(
    name: string,
    email: string,
    password: string,
    phone: string
  ): Promise<boolean> {
    await UserModel.create({
      email,
      name,
      password: await auth.signPassword(password),
      phone
    })

    // const emailCode = random(100000, 999999)

    // await CodeModel.findOneAndUpdate(
    //   {
    //     data: email,
    //     type: CodeType.email
    //   },
    //   {
    //     code: emailCode
    //   },
    //   {
    //     upsert: true
    //   }
    // )

    // // TODO: send email

    const phoneCode = random(100000, 999999)

    await CodeModel.findOneAndUpdate(
      {
        data: phone,
        type: CodeType.phone
      },
      {
        code: phoneCode
      },
      {
        upsert: true
      }
    )

    await phoneLib.sendVerificationCode(phone, phoneCode)

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
      [exists.type]: exists.data
    })

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

  async changePassword(
    user: DocumentType<User>,
    currentPassword: string,
    newPassword: string
  ): Promise<boolean> {
    if (!(await auth.checkPassword(currentPassword, user))) {
      throw new Error('Invalid password')
    }

    user.password = await auth.signPassword(newPassword)

    await user.save()

    return true
  }

  async deleteAccount(
    user: DocumentType<User>,
    password: string
  ): Promise<boolean> {
    if (!(await auth.checkPassword(password, user))) {
      throw new Error('Invalid password')
    }

    await ContactModel.deleteMany({
      user
    })

    await PlaceModel.deleteMany({
      user
    })

    await InteractionModel.deleteMany({
      user
    })

    await CheckInModel.deleteMany({
      user
    })

    await SymptomModel.deleteMany({
      user
    })

    await user.remove()

    return true
  }

  async toggleCovid19Positive(user: User): Promise<boolean> {
    const covid19Positive = !user.covid19Positive

    await UserModel.findByIdAndUpdate(user.id, {
      covid19Positive
    })

    return covid19Positive
  }
}
