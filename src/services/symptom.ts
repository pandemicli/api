import moment from 'moment'
import { Service } from 'typedi'

import { SymptomModel, User } from '../models'
import { SymptomName } from '../types/graphql'

@Service()
export class SymptomService {
  async toggleSymptom(
    user: User,
    name: SymptomName,
    date: string
  ): Promise<boolean> {
    const existing = await SymptomModel.findOne({
      experiencedAt: moment(date).startOf('day').toDate(),
      name,
      user
    })

    if (existing) {
      await existing.remove()

      return false
    }

    await SymptomModel.create({
      experiencedAt: moment(date).startOf('day').toDate(),
      name,
      user
    })

    return true
  }
}
