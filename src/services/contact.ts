import moment from 'moment'
import { Service } from 'typedi'

import { helpers } from '../lib'
import { Contact, ContactModel, InteractionModel, User } from '../models'
import { ContactInput } from '../types/graphql'

@Service()
export class ContactService {
  async getAll(user: User, date: string): Promise<Contact[]> {
    const contacts = await ContactModel.find({
      user
    })

    const interactions = await InteractionModel.find({
      contact: {
        $in: contacts.map(({ id }) => id)
      },
      interactedAt: {
        $gte: moment(date).startOf('day').toDate(),
        $lt: moment(date).endOf('day').toDate()
      },
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

    return contact
  }

  async remove(user: User, id: string): Promise<boolean> {
    await ContactModel.findOneAndDelete({
      _id: id,
      user
    })

    return true
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

    return contact
  }

  async sync(user: User, data: ContactInput[]): Promise<Contact[]> {
    const contacts = await Promise.all(
      data.map(({ deviceId, name, phone }) =>
        ContactModel.findOneAndUpdate(
          {
            deviceId,
            user
          },
          {
            name,
            phone
          },
          {
            new: true,
            upsert: true
          }
        )
      )
    )

    return contacts
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
    const interaction = await InteractionModel.findOneAndUpdate(
      {
        contact: id,
        interactedAt: moment(date).startOf('day').toDate(),
        user
      },
      {}
    )

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
}
