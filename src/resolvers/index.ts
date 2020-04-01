import { ContactResolver } from './contact'
import { PlaceResolver } from './place'
import { SymptomResolver } from './symptom'
import { TodayResolver } from './today'
import { UserResolver } from './user'

export const resolvers = [
  ContactResolver,
  PlaceResolver,
  SymptomResolver,
  TodayResolver,
  UserResolver
]
