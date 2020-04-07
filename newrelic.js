/* eslint-disable @typescript-eslint/camelcase */

const { NEW_RELIC_LICENSE_KEY } = process.env

exports.config = {
  allow_all_headers: true,
  app_name: ['My Application'],
  attributes: {
    exclude: [
      'request.headers.cookie',
      'request.headers.authorization',
      'request.headers.proxyAuthorization',
      'request.headers.setCookie*',
      'request.headers.x*',
      'response.headers.cookie',
      'response.headers.authorization',
      'response.headers.proxyAuthorization',
      'response.headers.setCookie*',
      'response.headers.x*'
    ]
  },
  license_key: NEW_RELIC_LICENSE_KEY,
  logging: {
    level: 'info'
  }
}
