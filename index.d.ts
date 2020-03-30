declare namespace NodeJS {
  export interface ProcessEnv {
    MONGO_URI: string

    TOKEN_SECRET: string

    GOOGLE_API_KEY: string

    TWILIO_ACCOUNT_ID: string
    TWILIO_AUTH_TOKEN: string
    TWILIO_NUMBER: string
  }
}
