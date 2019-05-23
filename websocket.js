const io = require('socket.io-client')

module.exports = {getConnection}

function getConnection() {
  return io.connect(process.env.SOCKET_HOST, {query: 'type=hardwareHandler'})
}
