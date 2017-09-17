require('dotenv').config({silent: true})

if (!process.env.SOCKET_HOST) {
  throw new Error('You must set the "SOCKET_HOST" environment variable!')
}

const socket = require('socket.io-client').connect(process.env.SOCKET_HOST)
const five = require('johnny-five')

const board = new five.Board()

board.on('ready', () => {
  const relays = five.Relays([5, 6, 7, 8])

  socket.emit('specify client', {type: 'arduinoHandler'})

  socket.on('action', data => {
    let target
    let message
    let targetMessage

    if (data.target === 'all') {
      target = relays
      targetMessage = 'all relays.'
    } else if (data.target in relays) {
      target = relays[data.target]
      targetMessage = `relay ${data.target}.`
    } else {
      socket.emit('response', {message: `Did not find the relay ${data.target}.`})
      return
    }

    message = capitalizeFirstLetter(data.action) + (data.action === 'open' ? 'ed' : 'd') + ` ${targetMessage}`
    target[data.action]()
    socket.emit('response', {message})
  })
})

/**
 * Capitalize first letter of the word or phrase
 * @param {String} string
 * @returns {String}
 */
function capitalizeFirstLetter (string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}
