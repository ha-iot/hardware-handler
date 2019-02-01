const io = require('socket.io-client')

module.exports = {getSocketConnection}

function getSocketConnection() {
  return io.connect(process.env.SOCKET_HOST, {query: 'type=hardwareHandler'})
}
