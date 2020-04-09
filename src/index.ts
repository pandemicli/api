const {
  MONGO_URI,
  PORT,
  VIRGIL_APP_ID,
  VIRGIL_APP_KEY,
  VIRGIL_APP_KEY_ID
} = process.env

import 'reflect-metadata'
import 'newrelic'

import { ApolloServer, AuthenticationError } from 'apollo-server-fastify'
import fastify, { FastifyRequest } from 'fastify'
import { connect } from 'mongoose'
import { buildSchema } from 'type-graphql'
import { Container } from 'typedi'
import {
  initCrypto,
  VirgilAccessTokenSigner,
  VirgilCrypto
} from 'virgil-crypto'
import { JwtGenerator } from 'virgil-sdk'

import { auth, authChecker } from './lib'
import { resolvers } from './resolvers'
import { Context } from './types'

const main = async (): Promise<void> => {
  const server = fastify({
    bodyLimit: 1000 * 1000 * 5
  })

  server.get('/virgil-jwt', async (request) => {
    const user = await auth.getUser(request)

    if (!user) {
      throw new AuthenticationError('Invalid token')
    }

    await initCrypto()

    const virgilCrypto = new VirgilCrypto()

    const generator = new JwtGenerator({
      accessTokenSigner: new VirgilAccessTokenSigner(virgilCrypto),
      apiKey: virgilCrypto.importPrivateKey(VIRGIL_APP_KEY),
      apiKeyId: VIRGIL_APP_KEY_ID,
      appId: VIRGIL_APP_ID,
      millisecondsToLive: 20 * 60 * 1000
    })

    return {
      virgilToken: generator.generateToken(user.id).toString()
    }
  })

  await connect(MONGO_URI, {
    useCreateIndex: true,
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true
  })

  const schema = await buildSchema({
    authChecker,
    container: Container,
    dateScalarMode: 'isoDate',
    resolvers
  })

  const graphql = new ApolloServer({
    context: async (request: FastifyRequest): Promise<Context> => ({
      user: await auth.getUser(request)
    }),
    schema
  })

  server.register(graphql.createHandler())

  await server.listen({
    port: Number(PORT)
  })

  console.log(`Running on ${PORT}`)
}

main()
