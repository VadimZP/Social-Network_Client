const app = require('express')()
const http = require('http').Server(app)
const io = require('socket.io')(http)
const port = process.env.PORT || 8080

app.get('/', (req, res) => res.send('Hello World!'))

io.on('connection', socket => {
    socket.on('appendMessage', message => {
        io.emit(message.receiver_id, {type: 'message', ...message})
        io.emit(message.sender_id, {type: 'message', ...message})
    })
    socket.on('appendNotification', notification => {
        io.emit(notification.receiver_id, {type: 'notification', ...notification})
    })
})

http.listen(port, () => console.log(`listening on *:${port}`))
