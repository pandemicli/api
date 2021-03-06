import moment from 'moment'
import { Service } from 'typedi'

import { helpers } from '../lib'
import {
  Contact,
  ContactModel,
  InteractionModel,
  User,
  UserModel
} from '../models'
import { ContactInput } from '../types/graphql'

@Service()
export class ContactService {
  async contacts(user: User, date: string): Promise<Contact[]> {
    const contacts = await ContactModel.find({
      user
    })

    const interactions = await InteractionModel.find({
      contact: {
        $in: contacts.map(({ id }) => id)
      },
      interactedAt: moment(date).startOf('day').toDate(),
      user
    })

    return contacts.map((contact) => {
      contact.interactedToday = !!interactions.find(
        (interaction) =>
          helpers.equals(user.id, interaction.user) &&
          helpers.equals(contact.id, interaction.contact)
      )

      return contact
    })
  }

  async create(user: User, data: ContactInput): Promise<Contact> {
    const contact = await ContactModel.create({
      ...data,
      user
    })

    contact.interactedToday = false

    // TODO: email and text contact

    return contact
  }

  async update(user: User, id: string, data: ContactInput): Promise<Contact> {
    const contact = await ContactModel.findOneAndUpdate(
      {
        _id: id,
        user
      },
      data,
      {
        new: true
      }
    )

    if (!contact) {
      throw new Error('Contact not found')
    }

    const interaction = await InteractionModel.findOne({
      contact,
      interactedAt: moment().startOf('day').toDate()
    })

    contact.interactedToday = !!interaction

    return contact
  }

  async remove(user: User, id: string): Promise<boolean> {
    await ContactModel.findOneAndDelete({
      _id: id,
      user
    })

    return true
  }

  async toggleFavorite(user: User, id: string): Promise<boolean> {
    const contact = await ContactModel.findById(id)

    if (!contact) {
      throw new Error('Contact not found')
    }

    if (!helpers.equals(user.id, contact.user)) {
      throw new Error('You can only update your own contacts')
    }

    contact.favorite = !contact.favorite

    await contact.save()

    return contact.favorite
  }

  async toggleInteraction(
    user: User,
    id: string,
    date: string
  ): Promise<boolean> {
    const interaction = await InteractionModel.findOne({
      contact: id,
      interactedAt: moment(date).startOf('day').toDate(),
      user
    })

    if (interaction) {
      await interaction.remove()

      return false
    }

    await InteractionModel.create({
      contact: id,
      interactedAt: moment(date).startOf('day').toDate(),
      user
    })

    return true
  }

  async sync(user: User, data: ContactInput[]): Promise<Contact[]> {
    const contacts = await Promise.all(
      data.map((contact) => {
        const { deviceIdHash } = contact

        return ContactModel.findOneAndUpdate(
          {
            deviceIdHash,
            user
          },
          contact,
          {
            new: true,
            upsert: true
          }
        )
      })
    )

    return contacts
  }

  async add(code: string): Promise<User> {
    const user = await UserModel.findOne({
      code
    })

    if (!user) {
      throw new Error('Invalid code')
    }

    return user
  }
}
