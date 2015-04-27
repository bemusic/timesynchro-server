var WebSocketServer = require('ws').Server
var http = require('http')
var express = require('express')
var app = express()
var port = (+process.env.PORT) || 1357

app.use(express.static(__dirname + '/public'))

var server = http.createServer(app)
var wss = new WebSocketServer({ server: server })

wss.on('connection', function(ws) {
  var count = 0
  ws.on('error', function(e) {
    console.error(e)
  })
  ws.on('message', function(message) {
    message = String(message)
    if (message.length <= 64) {
      ws.send(message + ',' + Date.now())
      count += 1
      if (count == 64) {
        ws.send('x')
        ws.close()
      }
    } else {
      ws.send('e')
      ws.close()
    }
  })
  ws.send('k')
})

server.listen(port, function(err) {
  if (err) throw err
  console.log('Yo!! We are listening on port', port)
})
