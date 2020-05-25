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

let rooms = {  }

io.on('connection', function(socket) {
	console.log(socket.id + ' connected')
	io.emit('studentConnected')

	socket.on('joinRoom', function(room, isTeacher, name) {
		socket.join(room)
		socket.room = room
		socket.isTeacher = isTeacher
		socket.name = name
		rooms[room] = { quizzes: {} , feedbacks: {} }
		console.log(socket.id + ' joined ' + room)
	})

	socket.on('updateMovement', function(name, location, theta, state, room){
		io.to(room).emit('movement', name, location, theta, state, socket.id)
	})

	socket.on('quiz', function(questions, date) {
		if(socket.isTeacher) { //safety check
			rooms[socket.room].quizzes[date] = []
			socket.broadcast.to(socket.room).emit('quiz', questions, date)
			//console.log('quiz received!', questions)
		}
	})
	socket.on('quizScore', function(score, date) {
		rooms[socket.room].quizzes[date].push({ score, name: socket.name })
	})
	socket.on('requestQuizzes', function() {
		socket.emit('quizzes', rooms[socket.room].quizzes)
	})

	socket.on('smartFeedback', function(q, date) {
		if(socket.isTeacher) { //safety check
			rooms[socket.room].feedbacks[date] = []
			socket.broadcast.to(socket.room).emit('smartFeedback', q, date)
		}
	})
	socket.on('feedback', function(text, date) {
		rooms[socket.room].feedbacks[date].push({ text, name: socket.name })
	})
	socket.on('requestFeedbacks', function() {
		socket.emit('feedbacks', rooms[socket.room].feedbacks)
	})

	socket.on('disconnect', function() {
		io.emit('disconnect', socket.id)
		console.log(socket.id + ' disconnected')
	})
})

server.listen(port, function() {
  console.log('listening on:' + port)
})
