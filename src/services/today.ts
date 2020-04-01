import moment from 'moment'
import { Service } from 'typedi'

import { helpers } from '../lib'
import {
  CheckInModel,
  ContactModel,
  InteractionModel,
  PlaceModel,
  SymptomModel,
  User
} from '../models'
import { SymptomName, TodayFeed } from '../types/graphql'

@Service()
export class TodayService {
  async feed(user: User, date: string): Promise<TodayFeed> {
    const contacts = await ContactModel.find({
      favorite: true,
      user
    })

    const places = await PlaceModel.find({
      favorite: true,
      user
    })

    const day = moment(date).startOf('day').toDate()

    const interactions = await InteractionModel.find({
      contact: {
        $in: contacts.map(({ id }) => id)
      },
      interactedAt: day,
      user
    })

    const checkIns = await CheckInModel.find({
      checkedInAt: day,
      place: {
        $in: places.map(({ id }) => id)
      },
      user
    })

    const symptoms = await SymptomModel.find({
      experiencedAt: day,
      user
    })

    return {
      contacts: contacts.map((contact) => {
        contact.interactedToday = !!interactions.find(
          (interaction) =>
            helpers.equals(user.id, interaction.user) &&
            helpers.equals(contact.id, interaction.contact)
        )

        return contact
      }),
      places: places.map((place) => {
        place.checkedInToday = !!checkIns.find(
          (checkIn) =>
            helpers.equals(user.id, checkIn.user) &&
            helpers.equals(place.id, checkIn.place)
        )

        return place
      }),
      symptoms: Object.keys(SymptomName).map((name) => ({
        experiencedToday: !!symptoms.find((symptom) => symptom.name === name),
        name: name as SymptomName
      }))
    }
  }
}
