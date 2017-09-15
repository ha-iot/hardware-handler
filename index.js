const path = require('path')
const express = require('express')
const five = require('johnny-five')

const app = express()
const board = new five.Board()

app.use(express.static(path.join(__dirname, 'public')))

board.on('ready', () => {
  const lamps = five.Relays([5, 6, 7, 8])

  // The express server must work along with the board connection
  app.get('/api/relays/:number', (request, response) => {
    const relayNumber = request.params.number
    let message

    if (relayNumber === 'toggleAll') {
      lamps.toggle()
      message = 'Toggled all relays!'
    } else if (relayNumber === 'onAll') {
      lamps.on()
      message = 'Switch all relays!'
    } else if (relayNumber === 'offAll') {
      lamps.off()
      message = 'Switch all relays!'
    } else if (relayNumber in lamps) {
      lamps[relayNumber].toggle()
      message = `Relay number ${+relayNumber + 1} switched!`
    } else {
      message = `You must be crazy... The relay "${+relayNumber + 1}" doesn't exist!`
    }

    response.send(message)
  })

  app.listen(3000, () => {
    console.log('Relay app listening on port 3000!')
  })
})
