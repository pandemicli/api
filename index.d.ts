declare namespace NodeJS {
  export interface ProcessEnv {
    MONGO_URI: string

    TOKEN_SECRET: string
    NEW_RELIC_LICENSE_KEY: string

    GOOGLE_API_KEY: string

    TWILIO_ACCOUNT_ID: string
    TWILIO_AUTH_TOKEN: string
    TWILIO_NUMBER: string

    VIRGIL_APP_ID: string
    VIRGIL_APP_KEY_ID: string
    VIRGIL_APP_KEY: string
  }
}
