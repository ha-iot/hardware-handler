require('dotenv').config({silent: true})

if (!process.env.SOCKET_HOST) {
  throw new Error('You must set the "SOCKET_HOST" environment variable!')
}

const socket = require('socket.io-client').connect(process.env.SOCKET_HOST)
const five = require('johnny-five')

const board = new five.Board()

board.on('close', () => {
  socket.emit('hardware/lampsState', [])
  throw new Error('Board disconnected.')
})

board.on('ready', () => {
  const relays = five.Relays([5, 6, 7, 8])
  relays.forEach(lamp => {
    lamp.upTime = null
  })

  socket.emit('general/specifyClient', {type: 'hardwareHandler'})

  const getLampsState = () => relays.map(({isOn, upTime}, i) => ({
    isOn,
    upTime,
    label: 'Lâmpada ' + (i + 1),
    number: i + 1
  }))

  socket.on('hardware/getData', () => {
    socket.emit('hardware/data', {
      hardwareActions: ['toggle', 'on', 'off'],
      lampsState: getLampsState()
    })
  })

  socket.on('hardware/action', data => {
    let target

    if (data.target === 'all') {
      target = relays
      target.forEach(lamp => _setUpTime(lamp, data.action))
    } else if (/[0-9]+/.test(data.target) && +data.target - 1 in relays) {
      target = _setUpTime(relays[data.target - 1], data.action)
    } else {
      return
    }

    target[data.action]()
    socket.emit('hardware/lampsState', getLampsState())
  })
})

function _setUpTime (lamp, action) {
  lamp.upTime = /toggle|on/.test(action) && !lamp.isOn ? new Date().getTime() : null
  return lamp
}
