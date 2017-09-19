require('dotenv').config({silent: true})

if (!process.env.SOCKET_HOST) {
  throw new Error('You must set the "SOCKET_HOST" environment variable!')
}

const socket = require('socket.io-client').connect(process.env.SOCKET_HOST)
const five = require('johnny-five')

const board = new five.Board()

board.on('close', () => {
  socket.emit('hardware/lampsState', [])
})

board.on('ready', () => {
  const relays = five.Relays([5, 6, 7, 8])

  socket.emit('general/specifyClient', {type: 'hardwareHandler'})

  const getLampsState = () => relays.map(({isOn}, i) => ({isOn, number: i + 1}))

  socket.on('hardware/getLampsState', () => {
    socket.emit('hardware/lampsState', getLampsState())
  })

  socket.on('hardware/action', data => {
    let target

    if (data.target === 'all') {
      target = relays
    } else if (/[0-9]+/.test(data.target) && +data.target - 1 in relays) {
      target = relays[data.target - 1]
    } else {
      return
    }

    target[data.action]()
    socket.emit('hardware/lampsState', getLampsState())
  })
})
