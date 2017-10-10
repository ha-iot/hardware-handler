require('dotenv').config({silent: true})

if (!process.env.SOCKET_HOST) {
  throw new Error('You must set the "SOCKET_HOST" environment variable!')
}

const socket = require('socket.io-client').connect(process.env.SOCKET_HOST)
const five = require('johnny-five')

const port = process.env.PORT
const board = port ? new five.Board({port}) : new five.Board()

require('./events')({socket, board})
