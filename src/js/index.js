(function(){
    'use strict';

    var socket = io();
    var chatWindow = document.getElementById('chatWindow');
    var sendButton = document.getElementById('chatMessageSendBtn');
    var chatInput = document.getElementById('chatInput');

    socket.on('connect', handlerConnect);
    socket.on('updateMessage', function(data){
        handlerUpdateMessage(data);
    });
    sendButton.addEventListener('click', handlerSendClick);


    function handlerConnect(){
        const options = {
            customButton : true,
            customButtonData : [
                {
                    type : 'button',
                    label : '접속',
                    event : function(){
                        const {content} = this.LayerPopup;
                        console.log('접속');
                    }
                },
                {
                    type : 'button',
                    label : '나가기',
                    event : function(){
                        const {content} = this.LayerPopup;
                        console.log('나가기');
                        
                    }
                }
            ]
        };

        const getNamePopup = new LayerPopup(options);
        getNamePopup.open();

        var name = prompt('대화명을 입력해주세요.', '');

        socket.emit('newUserConnect', name);
    }

    function handlerUpdateMessage(data){
        console.log(data);
        if(data.name === 'SERVER'){
            var info = document.getElementById('info');
            info.innerHTML = data.message;

            setTimeout(() => {
                info.innerText = '';
            }, 1000);

        }else{
            var chatMessageEl = drawChatMessage(data);
            chatWindow.appendChild(chatMessageEl);

            chatWindow.scrollTop = chatWindow.scrollHeight;
        }
    }
    function handlerSendClick(){
        var message = chatInput.value;
        if(!message) return false;
        
        socket.emit('sendMessage', {
            message
        });

        chatInput.value = '';
    }

    function drawChatMessage(data){
        var wrap = document.createElement('p');
        var message = document.createElement('span');
        var name = document.createElement('span');

        var wrapClassStr = 'output__user';
        var nameClassStr = 'output__user__name';
        var messageClassStr = 'output__user__message';

        name.innerText = data.name;
        message.innerText = data.message;

        if(data.id === socket.id){
            wrapClassStr = 'output__me';
            nameClassStr = 'output__me__name';
            messageClassStr = 'output__me__message';

            wrap.appendChild(message);
            wrap.appendChild(name);

        }else{
            wrap.appendChild(name);
            wrap.appendChild(message);
        }

        name.classList.add(nameClassStr);
        message.classList.add(messageClassStr);
        wrap.classList.add(wrapClassStr);
        wrap.dataset.id = socket.id;

        return wrap;
    }
})();

