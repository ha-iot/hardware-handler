const five = require('johnny-five')

module.exports = ({ socket, board }) => {
  board.on('close', () => {
    socket.emit('hardware/lampsState', [])
    throw new Error('Board disconnected.')
  })

  board.on('ready', () => {
    board.relays = five.Relays([5, 6, 7, 8])
    board.relays.forEach(lamp => {
      lamp.upTime = null
    })

    const getLampsState = () => board.relays.map(({ isOn, upTime }, i) => ({
      isOn,
      upTime,
      label: 'Lâmpada ' + (i + 1),
      number: i + 1,
    }))

    socket.on('hardware/getData', () => {
      socket.emit('hardware/data', {
        hardwareActions: ['toggle', 'on', 'off'],
        lampsState: getLampsState(),
      })
    })

    socket.on('hardware/action', data => {
      let target

      if (data.target === 'all') {
        target = board.relays
        target.forEach(lamp => _setUpTime(lamp, data.action))
      } else if (/[0-9]+/.test(data.target) && +data.target - 1 in board.relays) {
        target = _setUpTime(board.relays[data.target - 1], data.action)
      } else {
        return
      }

      target[data.action]()
      socket.emit('hardware/lampsState', getLampsState())
    })
  })
}

function _setUpTime (lamp, action) {
  lamp.upTime = /toggle|on/.test(action) && !lamp.isOn ? new Date().getTime() : null
  return lamp
}
