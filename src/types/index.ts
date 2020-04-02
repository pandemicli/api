import { User } from '../models'

export interface Context {
  user?: User
}

export interface AuthToken {
  userId: string
}

export enum CodeType {
  email = 'email',
  phone = 'phone'
}
