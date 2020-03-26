declare namespace NodeJS {
  export interface ProcessEnv {
    MONGO_URI: string

    SALT_ROUNDS: string
    TOKEN_SECRET: string
  }
}