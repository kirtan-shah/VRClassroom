const express = require('express')
const nocache = require('nocache')
const path = require('path')
const http = require('http')
let app = express()
let server = http.Server(app)
let io = require('socket.io')(server)
let port = process.env.PORT || 8080

app.use('/', express.static(path.join(__dirname, '/public')))
app.use(nocache())

io.on('connection', function(socket) {
	console.log(socket.id + ' connected')
	io.emit('studentConnected')

	socket.on('updateMovement', function(location){
		io.emit('movement', location, socket.id)
	})

	socket.on('disconnect', function() {
		io.emit('disconnect', socket.id)
		console.log(socket.id + ' disconnected')
	})
})

server.listen(port, function() {
  console.log('listening on:' + port)
})
