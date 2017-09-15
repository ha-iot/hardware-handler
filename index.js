const express = require('express')
const five = require('johnny-five')

const app = express()
const board = new five.Board()

board.on('ready', () => {
  const lamps = {}
  for (let i = 5; i < 9; i++) {
    lamps[i] = new five.Relay({pin: i, type: 'NC'})
  }

  // The express server must work along with the board connection
  app.get('/api/relay/:number', (request, response) => {
    const relayNumber = request.params.number
    if (lamps.hasOwnProperty(relayNumber)) {
      lamps[relayNumber].toggle()
      response.send(`<h1>Relay number ${relayNumber} switched. :D</h1>`)
    } else {
      response.send(`<h1>You must be crazy... The relay "${relayNumber}" doesn't exist! '-'</h1>`)
    }
  })

  app.listen(3000, () => {
    console.log('Relay app listening on port 3000!')
  })
})
