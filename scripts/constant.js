const path = require('path')

const PATH = path.resolve(__dirname, '../')
const PROJECT_NAME = path.parse(PATH).name

const isDev = process.env.NODE_ENV !== 'production'
const SERVER_HOST = '127.0.0.1'
const SERVER_PORT = 9000

module.exports = {
  isDev,
  PATH,
  PROJECT_NAME,
  SERVER_HOST,
  SERVER_PORT
}
