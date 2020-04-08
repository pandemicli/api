const { TOKEN_SECRET } = process.env

import { AuthenticationError } from 'apollo-server'
import { FastifyRequest } from 'fastify'
import { sign, verify } from 'jsonwebtoken'
import { AuthChecker } from 'type-graphql'

import { User, UserModel } from '../models'
import { AuthToken, Context } from '../types'

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

  async getUser(request: FastifyRequest): Promise<User | undefined> {
    const authorization = request.headers.authorization

    if (!authorization) {
      return
    }

    const token = authorization.substr(7)

    if (!token) {
      throw new AuthenticationError('Invalid token')
    }

    const { userId } = verify(token, TOKEN_SECRET) as AuthToken

    if (!userId) {
      throw new AuthenticationError('Invalid token')
    }

    const user = await UserModel.findById(userId)

    if (!user) {
      throw new AuthenticationError('User not found')
    }

    return user
  }
}

export const auth = new Auth()
