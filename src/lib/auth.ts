const { TOKEN_SECRET } = process.env

import { AuthenticationError } from 'apollo-server'
import { Request } from 'express'
import { sign, verify } from 'jsonwebtoken'
import { AuthChecker } from 'type-graphql'

import { User, UserModel } from '../models'
import { AuthToken, Context } from '../types'

export enum Roles {
  OWNER
}

export const authChecker: AuthChecker<Context, number> = async ({
  context: { user }
}): Promise<boolean> => !!user

class Auth {
  createToken(user: User): string {
    return sign(
      {
        userId: user.id
      },
      TOKEN_SECRET
    )
  }

  async getUser(req: Request): Promise<User | undefined> {
    const auth = req.get('authorization')

    if (!auth) {
      return
    }

    const token = auth.substr(7)

    if (!token) {
      throw new AuthenticationError('Invalid token')
    }

    const { userId } = verify(token, TOKEN_SECRET) as AuthToken

    if (!userId) {
      throw new AuthenticationError('Invalid token')
    }

    const user = await UserModel.findById(userId).select('+password')

    if (!user) {
      throw new AuthenticationError('User not found')
    }

    return user
  }
}

export const auth = new Auth()
