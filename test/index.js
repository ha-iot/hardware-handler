require('should')
const http = require('http')
const express = require('express')
const socketLib = require('socket.io')
const socketClientLib = require('socket.io-client')
const five = require('johnny-five')
const firmata = new (require('mock-firmata').Firmata)()

const MOCKED_SOCKET_PORT = 8989

const _getMockedSocketServer = () => {
  const server = http.Server(express())
  const mockedSocketServer = socketLib(server)
  server.setTimeout(200) // Was taking too long to end the process. Default is 120.000 (2 minutes)
  server.listen(MOCKED_SOCKET_PORT)
  mockedSocketServer.close = server.close.bind(server)
  return mockedSocketServer
}

const _getSocketClient = () => socketClientLib.connect(`http://localhost:${MOCKED_SOCKET_PORT}/`)

const _getBoard = () => {
  const board = new five.Board({repl: false, debug: false, io: firmata})
  board.isClosed = false
  board.ready = () => {
    board.emit('ready')
  }
  board.close = () => {
    board.emit('close')
  }
  return board
}

let mockedServer, socketClient, board

const eventsSetter = require('../events')

describe('Hardware', () => {
  beforeEach(() => {
    mockedServer = _getMockedSocketServer()
    socketClient = _getSocketClient()
    board = _getBoard()
    eventsSetter({socket: socketClient, board})
  })

  afterEach(() => {
    socketClient.close()
    mockedServer.close()
    if (!board.isClosed) {
      try {
        board.close()
      } catch (e) {
        // Closed it, since its disconnection should break the server
      }
    }
  })

  it('should emit what it is', done => {
    mockedServer.on('connection', socket => {
      socket.on('general/specifyClient', data => {
        data.should.have.property('type', 'hardwareHandler')
        done()
      })
      board.ready()
    })
  })

  it('should retrieve data', done => {
    mockedServer.on('connection', socket => {
      socket.on('hardware/data', data => {
        data.should.have.property('hardwareActions', ['toggle', 'on', 'off'])
        data.should.have.property('lampsState', [
          {isOn: false, upTime: null, label: 'Lâmpada 1', number: 1},
          {isOn: false, upTime: null, label: 'Lâmpada 2', number: 2},
          {isOn: false, upTime: null, label: 'Lâmpada 3', number: 3},
          {isOn: false, upTime: null, label: 'Lâmpada 4', number: 4}
        ])
        done()
      })
      board.ready()
      socket.emit('hardware/getData')
    })
  })

  it('should throw an exception when the the board closes', done => {
    mockedServer.on('connection', () => {
      try {
        board.close()
      } catch (e) {
        done()
      }
    })
    board.ready()
  })

  it('should toggle all lamps', done => {
    mockedServer.on('connection', socket => {
      // Toggle relays 2 and 4
      board.relays[1].toggle()
      board.relays[3].toggle()
      socket.emit('hardware/action', {action: 'toggle', target: 'all'})
      socket.on('hardware/lampsState', data => {
        const timestamp = new Date().getTime()
        const timeOffset = 500
        // Lamps on
        data[0].should.have.property('isOn', true)
        data[0].should.have.property('label', 'Lâmpada 1')
        data[0].should.have.property('number', 1)
        data[0].should.have.property('upTime').greaterThan(timestamp - timeOffset) // 500ms before
        data[2].should.have.property('isOn', true)
        data[2].should.have.property('label', 'Lâmpada 3')
        data[2].should.have.property('number', 3)
        data[2].should.have.property('upTime').greaterThan(timestamp - timeOffset) // 500ms before
        // Lamps off
        data[1].should.be.deepEqual({isOn: false, upTime: null, label: 'Lâmpada 2', number: 2})
        data[3].should.be.deepEqual({isOn: false, upTime: null, label: 'Lâmpada 4', number: 4})
        done()
      })
    })
    board.ready()
  })

  it('should toggle one lamp', done => {
    mockedServer.on('connection', socket => {
      socket.emit('hardware/action', {action: 'toggle', target: 1})
      socket.on('hardware/lampsState', data => {
        const timestamp = new Date().getTime()
        const timeOffset = 500
        // Lamps on
        data[0].should.have.property('isOn', true)
        data[0].should.have.property('label', 'Lâmpada 1')
        data[0].should.have.property('number', 1)
        data[0].should.have.property('upTime').greaterThan(timestamp - timeOffset) // 500ms before
        // Lamps off
        data[1].should.be.deepEqual({isOn: false, upTime: null, label: 'Lâmpada 2', number: 2})
        data[2].should.be.deepEqual({isOn: false, upTime: null, label: 'Lâmpada 3', number: 3})
        data[3].should.be.deepEqual({isOn: false, upTime: null, label: 'Lâmpada 4', number: 4})
        done()
      })
    })
    board.ready()
  })

  it('should do nothing on an unknown target', done => {
    let firstLamps = true
    let _lamps
    mockedServer.on('connection', socket => {
      socket.emit('hardware/getData')

      socket.on('hardware/data', data => {
        if (firstLamps) {
          _lamps = data.lampsState
          firstLamps = false
          socket.emit('hardware/action', {action: 'on', target: 'boringNeighbor'})
          socket.emit('hardware/getData')
        } else {
          data.lampsState.should.be.deepEqual(_lamps)
          done()
        }
      })
    })
    board.ready()
  })
})
