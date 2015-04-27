
var raf = require('raf')
var sync = require('timesynchro')
var offset = 0

sync((location.protocol === 'https:' ? 'wss:' : 'ws:') +
    '//' + location.host, function(err, result) {
  if (err) {
    document.body.className = 'err'
  } else {
    offset = result
    document.body.className = 'ok'
    update()
  }
}, function(result) {
  offset = result
  update()
})

function update() {
  document.querySelector('#offset').innerHTML = offset + 'ms'
}

raf(frame)

function frame() {
  var insecond = ((Date.now() + offset) % 1000) / 1000
  var opacity = Math.pow(1 - insecond, 2)
  document.querySelector('#beat').style.opacity = opacity
  raf(frame)
}

