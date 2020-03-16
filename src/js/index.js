/**
 * Chat app JS
 * @author Yoonseo.lee <okayoon.lee@gmail.com>
 * @since 2020.01
 * @version 1.0.0
 * @copyright Yoonseo 2020.01
 * @todo es6 사용, 압축 난독화 자동화
 * @todo 라우터(종료페이지)
 * @todo 텍스트 검색
 * @todo 닉네임 방식 변경
 * @todo 엔터로 메시지 발송
 * @todo 본인 메세지 style추가
 * @todo 메뉴바생성 - 현재 인원 정보 - 닉네임변경 - 귓속말, 해당사람 글 차단 - 대화저장
 */
(function(){

    // import { chatAppConnect } from './chatApp.js'

    const socket = io();
    const chatWindow = document.getElementById('chatWindow');
    const sendButton = document.getElementById('chatMessageSendBtn');
    const chatInput = document.getElementById('chatInput');

    socket.on('connect', chatAppConnect);

    socket.on('updateMessage', function(data){
        handlerUpdateMessage(data);
    });

    sendButton.addEventListener('click', handlerSendClick);


    function chatAppConnect(){
        getUserName();
    }

    function handlerUpdateMessage(data){
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

    // 대화명 입력받기
    function getUserName(){
        const inputObj = '<input id="getUserName" type="text" placeholder="닉네임을 입력해주세요.">';
        const connectEvent = function(){
            const userName = document.getElementById('getUserName').value.trim();
            if(!userName) return false; 
            
            nextStep(this.LayerPopup, userName);
        };
        const exitEvent = function(){
            // [TODO] 종료페이지로 보내기 (router 쓰기)
            closeStep(this.LayerPopup);
            alert('나가기를 눌렀다');
        };
    
        // @see layerPopup.js / layerPopup.css (https://github.com/leeyoonseo/LayerPopup)
        const popup = new LayerPopup({
            appendPosition : '#app',
            title : 'chat-app',
            content : inputObj,
            expire : false,
            customButton : true,
            customButtonData : [
                {
                    type : 'button',
                    label : '접속',
                    event : connectEvent
                },
                {
                    type : 'button',
                    label : '나가기',
                    event : exitEvent
                }
            ]
        })
        popup.open();

        function nextStep(popup, data){
            socket.emit('newUserConnect', data);
            popup.close();
        }

        function closeStep(popup){
            popup.close();
        }
    }
})();

