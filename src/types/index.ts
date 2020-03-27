import { User } from '../models'

export interface Context {
  user?: User
}

export interface AuthToken {
  userId: string
}

export interface LocationPoint {
  latitude: number
  longitude: number
}
