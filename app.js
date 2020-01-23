const express = require('express');
const http = require('http');
const app = express();
const server = http.createServer(app);
const fs = require('fs');
const io = require('socket.io')(server);

app.use(express.static('src'));
app.get('/', (req, res) => handlerRouting(res));

io.sockets.on('connection', socket => {
    socket.on('newUserConnect', name => handlerNewUserConnect(socket, name));
    socket.on('disconnect', () => handlerDisConnect(socket));
    socket.on('sendMessage', data => handlerSendMessage(socket, data));
});

server.listen(8080, () => {
    console.log('서버 실행');
});

function handlerRouting(res){
    fs.readFile('./src/index.html', (err, data) => {
        if(err) throw err;

        res.writeHead(200, {
            'Content-Type' : 'text/html'
        })
        .write(data)
        .end();
    });
}

function handlerNewUserConnect(socket, name){
    socket.name = name;

    var data = {
        name : 'SERVER',
        message : name + '님이 접속했습니다.'
    };

    io.sockets.emit('updateMessage', data);
}

function handlerDisConnect(socket){
    var data = {
        name : 'SERVER',
        message : socket.name + '님이 퇴장했습니다.'
    };
    
    io.sockets.emit('updateMessage', data);
}

function handlerSendMessage(socket, data){
    data.name = socket.name;
    data.id = socket.id;
    io.sockets.emit('updateMessage', data);
}