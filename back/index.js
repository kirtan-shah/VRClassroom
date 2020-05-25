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

//let rooms = {  }

io.on('connection', function(socket) {
	console.log(socket.id + ' connected')
	io.emit('studentConnected')

	socket.on('joinRoom', function(room, isTeacher) {
		socket.join(room)
		socket.room = room
		socket.isTeacher = isTeacher
		//rooms[room] = { teacher: socket }
		console.log(socket.id + ' joined ' + room)
	})

	socket.on('updateMovement', function(name, location, theta, state, room){
		io.to(room).emit('movement', name, location, theta, state, socket.id)
	})

	socket.on('quiz', function(questions) {
		if(socket.isTeacher) { //safety check
			socket.broadcast.to(socket.room).emit('quiz', questions)
			//console.log('quiz received!', questions)
		}
	})

	socket.on('disconnect', function() {
		io.emit('disconnect', socket.id)
		console.log(socket.id + ' disconnected')
	})
})

server.listen(port, function() {
  console.log('listening on:' + port)
})
