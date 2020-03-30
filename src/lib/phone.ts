const { TWILIO_ACCOUNT_ID, TWILIO_AUTH_TOKEN, TWILIO_NUMBER } = process.env

import twilio from 'twilio'

class Phone {
  client = twilio(TWILIO_ACCOUNT_ID, TWILIO_AUTH_TOKEN)

  async sendVerificationCode(phone: string, code: number): Promise<void> {
    await this.client.api.messages.create({
      body: `Your Pandemic.li code is ${code}`,
      from: TWILIO_NUMBER,
      to: phone
    })
  }
}

export const phoneLib = new Phone()
