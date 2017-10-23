require('dotenv').config({silent: true})

if (!process.env.SOCKET_HOST) {
  throw new Error('You must set the "SOCKET_HOST" environment variable!')
}

const socket = require('socket.io-client').connect(process.env.SOCKET_HOST)
const five = require('johnny-five')

const boardOptions = {}

if (process.argv.indexOf('--mock-board') !== -1) {
  boardOptions.io = new (require('mock-firmata').Firmata)()
  setTimeout(() => {
    board.emit('ready')
    process.on('exit', () => {
      board.emit('close')
    })
  }, 500) // Give it half of a second to set the event listeners from "events.js"; then, trigger "ready"
} else {
  const port = process.env.PORT
  if (port) {
    boardOptions.port = port
    boardOptions.repl = false
  }
}

const board = new five.Board(boardOptions)

require('./events')({socket, board})
