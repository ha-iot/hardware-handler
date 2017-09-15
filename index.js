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
    if (relayNumber in lamps) {
      lamps[relayNumber].toggle()
      response.send(`Relay number ${relayNumber} switched. :D`)
    } else {
      response.send(`You must be crazy... The relay "${relayNumber}" doesn't exist! '-'`)
    }
  })

  app.listen(3000, () => {
    console.log('Relay app listening on port 3000!')
  })
})
