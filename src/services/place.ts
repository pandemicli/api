import moment from 'moment'
import { Service } from 'typedi'

import { helpers } from '../lib'
import { CheckInModel, Place, PlaceModel, User } from '../models'
import { PlaceInput } from '../types/graphql'

@Service()
export class PlaceService {
  async getAll(user: User, date: string): Promise<Place[]> {
    const places = await PlaceModel.find({
      user
    })

    const checkIns = await CheckInModel.find({
      checkedInAt: {
        $gte: moment(date).startOf('day').toDate(),
        $lt: moment(date).endOf('day').toDate()
      },
      place: {
        $in: places.map(({ id }) => id)
      },
      user
    })

    return places.map((place) => {
      place.checkedInToday = !!checkIns.find(
        (interaction) =>
          helpers.equals(user.id, interaction.user) &&
          helpers.equals(place.id, interaction.place)
      )

      return place
    })
  }

  async create(user: User, data: PlaceInput): Promise<Place> {
    const place = await PlaceModel.create({
      ...data,
      user
    })

    place.checkedInToday = false

    return place
  }

  async remove(user: User, id: string): Promise<boolean> {
    await PlaceModel.findOneAndDelete({
      _id: id,
      user
    })

    return true
  }

  async update(user: User, id: string, data: PlaceInput): Promise<Place> {
    const place = await PlaceModel.findOneAndUpdate(
      {
        _id: id,
        user
      },
      data,
      {
        new: true
      }
    )

    if (!place) {
      throw new Error('Place not found')
    }

    return place
  }

  async toggleFavorite(user: User, id: string): Promise<boolean> {
    const place = await PlaceModel.findById(id)

    if (!place) {
      throw new Error('Place not found')
    }

    if (!helpers.equals(user.id, place.user)) {
      throw new Error('You can only update your own places')
    }

    place.favorite = !place.favorite

    await place.save()

    return place.favorite
  }

  async toggleCheckIn(user: User, id: string, date: string): Promise<boolean> {
    const interaction = await CheckInModel.findOneAndUpdate(
      {
        checkedInAt: moment(date).startOf('day').toDate(),
        place: id,
        user
      },
      {}
    )

    if (interaction) {
      await interaction.remove()

      return false
    }

    await CheckInModel.create({
      checkedInAt: moment(date).startOf('day').toDate(),
      place: id,
      user
    })

    return true
  }
}
