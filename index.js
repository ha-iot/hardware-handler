require('dotenv').config({silent: true})

if (!process.env.SOCKET_HOST) {
  throw new Error('You must set the "SOCKET_HOST" environment variable!')
}

const socket = require('socket.io-client').connect(process.env.SOCKET_HOST)
const five = require('johnny-five')

const board = new five.Board()

board.on('ready', () => {
  const relays = five.Relays([5, 6, 7, 8])

  socket.on('toggle', data => {
    let message

    if (data.target === 'toggleAll') {
      relays.toggle()
      message = 'Toggled all relays.'
    } else if (data.target === 'openAll') {
      relays.open()
      message = 'Opened all relays.'
    } else if (data.target === 'closeAll') {
      relays.close()
      message = 'Closed all relays.'
    } else if (data.target in relays) {
      relays[data.target].toggle()
      message = `Toggled relay ${data.target}.`
    } else {
      message = `Did not find the relay ${data.target}.`
    }

    socket.emit('response', {message})
  })
})
