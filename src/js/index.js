'use strict';

var socket = io();

socket.on('connect', function(){
    var name = prompt('대화명을 입력해주세요.', '');
    socket.emit('newUserConnect', name);
});

var chatWindow = document.getElementById('chatWindow');
socket.on('updateMessage', function(data){
    if(data.name === 'SERVER'){
        var info = document.getElementById('info');
        info.innerHTML = data.message;

    }else{
        var chatMessageEl = drawChatMessage(data);
        chatWindow.appendChild(chatMessageEl);
    }
});

function drawChatMessage(data){
    var wrap = document.createElement('p');
    var message = document.createElement('span');
    
    // 1.
    if(data.name === 'SERVER') {
        wrap.classList.add('output__server');
    
    }else{
        var name = document.createElement('span');

        name.innerText = data.name;
        name.classList.add('output__user__name');

        wrap.classList.add('output__user');
        wrap.dataset.id = socket.id;
        wrap.appendChild(name);
    }

    message.innerText = data.message;
    message.classList.add('output__user__message');

    wrap.appendChild(message);

    return wrap;
}


var sendButton = document.getElementById('chatMessageSendBtn');
var chatInput = document.getElementById('chatInput');

sendButton.addEventListener('click', function(){
    var message = chatInput.value;
    if(!message) return false;
    
    socket.emit('sendMessage', {
        message
    });

    chatInput.value = '';
});