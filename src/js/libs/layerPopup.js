// dev 옵션 - min파일에서 디버깅
// require('source-map-support').install();
/**
 * @author yoonseo.lee <okayoon.lee@gmail.com>
 * @version 1.0.0
 * @since 2019.11
 * @file 레이어팝업 플러그인
 * @copyright yoonseo.lee 2019.11
 */
 class LayerPopup{

    /**
     * 레이어팝업 
     * @classdesc 생성, 삽입, 삭제, 커스텀이 가능한 레이어팝업 모듈
     * @param {object} parameters - 옵션 
     * @param {requestCallback} callbackFunc - 기본 버튼 클릭 시 실행될 콜백함수 
     */
    constructor(parameters, callbackFunc){
        
        /**
         * @prop {string} name 클래스 생성자 이름
         */
        this.name = "LayerPopup";        

        /**
         * @abstract
         * @prop {object} options 클래스 옵션 오브젝트 
         * @prop {string} options.appendPosition 팝업이 삽입될 상위 객체의 tagName or id or class
         * @prop {string} options.className 팝업의 클래스명
         * @prop {string} options.title 타이틀 문구 
         * @prop {string|object} options.content 내부 콘텐츠  
         * @prop {boolean} options.button 기본 버튼 사용여부 
         * @prop {boolean} options.dim 딤 배경처리 사용여부
         * @prop {boolean} options.scroll 딤 배경처리 시 스크롤 사용여부
         * @prop {boolean} options.expire 만료일 사용여부
         * @prop {object} options.expireData 만료일 관련 데이터 
         * @prop {string|number} options.expireData.date 만료일 날짜 
         * @prop {string} options.expireData.id 만료일 체크 객체 id 
         * @prop {string} options.expireData.label 만료일 체크 label 문구
         * @prop {boolean} options.closeButton 닫기 버튼 사용여부
         * @prop {object} options.closeButtonData 닫기버튼 데이터 
         * @prop {string} options.closeButtonData.src 닫기버튼 이미지 처리시 src 
         * @prop {string} options.closeButtonData.label 닫기버튼명
         * @prop {boolean} options.customButton 커스텀 버튼 사용여부
         * @prop {object} options.customButtonData 커스텀 버튼 데이터 
         * @prop {string} options.customButtonData.type 커스텀 버튼 타입 
         * @prop {string} options.customButtonData.className 커스텀 버튼 클래스 
         * @prop {string} options.customButtonData.label 커스텀 버튼 label
         * @prop {string|object} options.customButtonData.event 커스텀 버튼 클릭시 커스텀 이벤트
         */
        this.options = {
            appendPosition : 'body', 
            className : 'popup', 
            title : 'title',
            content : 'please write your message...',
            
            button : true,
            dim : true,
            scroll : true,
            
            expire : false,           
            expireData : {
                date : 1,
                id : 'day',
                label : '하루동안보지않기'
            },

            closeButton : true,
            closeButtonData : {
                src : '',
                label : 'x'
            },

            customButton : false,
            customButtonData : [
                {
                    type : '',
                    className : '',
                    label : '',
                    event : '',
                }
            ]
        };

        if(parameters){
            if(typeof parameters === 'object'){
                this.options = Object.assign({}, this.options, parameters);
                this.callback = callbackFunc || '';
    
            }else if(typeof parameters === 'function'){
                this.callback = parameters;
    
            }else{
                console.log('error : 옵션 값을 확인해주세요.');
                return false;
            }
        }
        
        this._initialize();
    }   

    /**
     * 레이어 팝업 객체 생성 및 삽입 컨트롤
     * @this LayerPopup
     */
    _initialize(){
        const {
            className, 
            closeButton, 
            closeButtonData, 
            button, 
            customButton,
            title, 
            dim, 
            expire, 
            expireData
        } = this.options;

        const _createElement = this._createElement;

        this.wrap = _createElement({
            className : className + '_wrap',
            expire
        });    

        this.wrapInner = _createElement({
            className : className + '_inner',
            expire
        });           

        this.container = _createElement({
            className : className + '_container',
            expire
        });        

        this.content = _createElement({
            tag : 'div', 
            className : className + '_content',
            expire
        });
        
        this.dim = document.querySelector('[data-type="dim"]');

        if(dim && !this.dim) {
            this.dim = _createElement({
                className : className + '_dim',
                expire
            });
        }

        if(title || closeButton){
            this.header = _createElement({
                className : className + '_header',
                expire
            });
        }

        if(title) {
            this.title = _createElement({
                tag : 'p', 
                className : className + '_title',
                expire
            });
        }

        if(closeButton){
            const closeLabel = (closeButtonData.label === '') 
                ? 'x' 
                : closeButtonData.label;

            this.closeButton = _createElement({
                tag : 'button',
                className : className + '_close',
                label : closeLabel,
                src : closeButtonData.src,
                expire
            });
        }

        if(button || expire){
            this.buttonsWrap = _createElement({
                tag : 'div', 
                className : className + '_buttons_wrap',
                expire
            });

            this.footer = _createElement({
                className : className + '_footer',
                expire
            });
        }

        if(button){
            if(customButton){
                const that = this;
                const {customButtonData, expire} = this.options;
    
                if(customButtonData === ''){
                    defaultButtons.call(this);
    
                }else if(Array.isArray(customButtonData) && customButtonData.length > 1){
                    customButtonData.map(e => {
                        let key = this._getRandomNumber();
                        e.key = key;
    
                        let el = _createElement.call(that, { 
                            tag : 'button', 
                            type : e.type, 
                            className : (e.className) ? e.className : key,                         
                            label : e.label,
                            expire
                        });
    
                        that.buttonsWrap.append(el);
                    });                
    
                }else{
                    const key = this._getRandomNumber();
                    let btn = (Array.isArray(customButtonData)) 
                        ? customButtonData[0] 
                        : customButtonData;
                    const {type, className, label, event} = btn;
                    btn.key = key;

                    const el = _createElement.call(this, { 
                        tag : 'button', 
                        type : type, 
                        className : (className) ? className : key, 
                        label : label,
                        expire
                    });
                    
                    this.buttonsWrap.append(el);
                }
    
            }else{
                defaultButtons.call(this);
            }
        }

        if(expire && expireData){
            const {className} = this.options;
            const prefix = className + '_expire';
            let expireBox, 
                expireBtn, 
                expireLabel;

            this.expireWrap = _createElement.call(this,{
                tag : 'div',
                className : prefix + '_wrap',
                expire
            });

            if(Array.isArray(expireData)){
                const that = this;

                expireData.map(({className, id, date, label}) => {
                    expireBox = _createElement.call(that, {
                        tag : 'p', 
                        className : prefix + '_box',
                        expire
                    }); 

                    expireBtn = _createElement.call(that, {
                        tag : 'input',
                        type : 'checkbox', 
                        name : prefix + '_chk', 
                        className : className, 
                        id : id,
                        label : date,
                        expire
                    });

                    expireLabel = _createElement.call(that,{
                        tag : 'label',
                        label : prefix + '_label', 
                        id : id,
                        text : label,
                        expire
                    });

                    expireBox.append(expireBtn, expireLabel);
                    this.expireWrap.append(expireBox);
                });

            }else{
                expireBox = _createElement.call(this, {
                    tag : 'p',
                    className : prefix + '_box',
                    expire
                });

                expireBtn = _createElement.call(this,{
                    tag : 'input',
                    type : 'checkbox', 
                    className : prefix + '_chk', 
                    id : expireData.id,
                    label : expireData.date,
                    expire
                });

                expireLabel = _createElement.call(this, {
                    tag : 'label',
                    label : prefix + '_label', 
                    id : expireData.id,
                    text : expireData.label,
                    expire
                });

                expireBox.append(expireBtn, expireLabel);
                this.expireWrap.append(expireBox);
            }
        } // expired

        this._setAttribute();
        this._layoutAppend(); 


        // 기본 버튼 생성(확인, 취소)
        function defaultButtons(){
            this.done = _createElement.call(this, {
                tag : 'button', 
                className : className + '_button_done', 
                type : 'submit',
                label : 'confirm',
                expire
            });

            this.cancel = _createElement.call(this, {
                tag : 'button', 
                className : className + '_button_cancel', 
                label : 'cancel',
                expire
            });

            this.buttonsWrap.append(this.done, this.cancel);
        }
    } // initialize


    /**
     * 객체 생성하는 함수, 버튼 생성할때는 호출 시 .call(this) 바인딩해줘야 함.
     * @param {string} tag 객체 tagName (default = div)
     * @param {string} id 객체 id
     * @param {string} className  객체 class
     * @param {string} name 객체 name
     * @param {string} type 객체 종류 (default = button)
     * @param {label} label label 텍스트 (default = 버튼)
     * @param {string} src 버튼 이미지 주소
     * @param {string} text 버튼 텍스트
     * @return {object} 레이어팝업 객체
     * @example
     * title = _createElement({ 
     *      tag : 'p', 
     *      className : 'title,title-red,title-required' 
     * });
     *      
     * button = _createElement.call(this,{ 
     *      tag : 'button', 
     *      className : 'cancel',
     *      type : 'button', 
     *      label : '취소버튼' 
     * });
     */
    _createElement({ 
        tag = 'div', 
        id, 
        className, 
        name, 
        type = 'button', 
        label = '버튼', 
        src,
        text,
        expire = false
    }){

        const el = document.createElement(tag);

        if(className){
            const splitClassName = className.split(',');

            if(splitClassName.length > 1){
                splitClassName.map(e =>  el.classList.add(e));

            }else{
                el.classList.add(className);
            }
        }

        if(name){
            el.name = name;
        }

        if(id && tag !== 'label'){
            el.id = id;
        }

        if(tag === 'label' && text){
            el.innerText = text;
        }
        
        if(tag === 'button'){   
            el.setAttribute('type', (type !== '') ? type : 'button');
            el.LayerPopup = this;
            el.innerText = (label !== '') ? label : '버튼';
            
            if(src && src !== ''){
                el.style.backgroundImage = 'url(' + src + ')';
                el.classList.add('bg');
            }
        }

        if(expire){
            if(type === 'radio' || type === 'checkbox'){
                el.value = label;
                el.setAttribute('type', type);
                el.dataset.type = 'expired';
                el.LayerPopup = this;
            }
            
            if(tag === 'label'){       
                el.setAttribute('for', id);
            }
        }

        return el;
    } // _createElement


    /**
     * 옵션에 따라 객체 속성 컨트롤
     * @this LayerPopup
     */
    _setAttribute(){
        const {dim} = this.options;
        const {style, dataset} = this.wrap;

        style.zIndex = 1000;
        dataset.type = 'layerPopup';

        if(dim) {
            this.dim.dataset.type = 'dim';
        }
    }

    /**
     * 레이어팝업 객체 삽입하는 함수
     * @throws 선언 순서가 변경되면 안됨
     */
    _layoutAppend(){
        const { appendPosition, title, dim, closeButton, button, expire, expireData} = this.options;

        if(title){
            this.header.append(this.title);
        }

        if(closeButton){
            this.header.append(this.closeButton);
        }

        this.container.append(this.content);
        
        if(expire && expireData){
            this.footer.append(this.expireWrap);
        }

        if(button || expire){
            this.footer.append(this.buttonsWrap);
        }

        if(this.header){
            this.wrapInner.append(this.header); 
        }

        this.wrapInner.append(this.container); 

        if(button || expire){
            this.wrapInner.append(this.footer); 
        }

        this.wrap.append(this.wrapInner);
        
        this._setContent();
        this._attachEvent();

        if(appendPosition !== ''){
            let target = document.querySelector(appendPosition); 
            if(target === '' || !target) {
                target = document.querySelector('body');
            }

            target.append(this.wrap);
        }

        if(dim && this.dim) document.body.append(this.dim);
    }

    /**
     * 레이어팝업 타이틀, 내부 콘텐츠 세팅해주는 함수
     */
    _setContent(){
        const {title, content} = this.options;
        let outputContent = content;
        let outputTitle = content;

        if(title) {
            if(typeof title === 'string'){
                outputTitle = wordBreak(title);
                this.title.innerHTML = outputTitle;

            }else{
                this.title.append(outputTitle);
            }
        }

        if(typeof content === 'string'){
            outputContent = wordBreak(content);
            this.content.innerHTML = outputContent;

        }else{
            this.content.append(outputContent);
        }

        /**
         *  \n를 <br>로 변환
         * @param {string} text 줄바꿈 치환이 필요한 텍스트
         * @param {string} org 기존 치환 문구
         * @param {string} dest 치환되어야할 문구
         * @return {string} (default) js 줄바꿈을 html 줄바꿈으로 치환한 텍스트
         */
        function wordBreak(text, org = '\n', dest = '<br>'){
            return text.split(org).join(dest);
        }
    }

    /**
     * 레이어 팝업 객체 이벤트 바인딩하는 함수
     * @this LayerPopup
     */
    _attachEvent(){
        const that = this;
        const {closeButton, customButton, button, customButtonData, expire, expireData} = this.options;

        if(closeButton){
            this.closeButton.addEventListener('click', () => {
                this.close();
            });
        }

        if(button){
            const buttonNodes = this.buttonsWrap.childNodes;        

            if(customButton){
                if(customButtonData === ''){
                    defaultButtonCaller.call(this);
    
                }else if(customButtonData.length > 1){
                    Array.from(buttonNodes).map(el => {
                        customButtonData.find((e) => {
                            if(e.event && typeof e.event === 'function'){
                                if(el.className === e.key || el.className === e.className){
                                    el.addEventListener('click', e.event);
                                    el.event = e.event;
                                }
    
                            }else{
                                console.log('event가 비어있습니다. 기본이벤트로 대체합니다.');
                                e.event = that._handleDefaultClick;
                            }
                        });
                    });

                }else{
                    let event = customButtonData.event
                    const button = buttonNodes[0];

                    if(Array.isArray(customButtonData)){
                        event = customButtonData[0].event;
                    }
    
                    if(!event || typeof event !== 'function' || event === ''){
                        console.log('event가 비어있습니다. 기본이벤트로 대체합니다.');
                        event = this._handleDefaultClick;
                    }

                    button.event = event;
                    button.addEventListener('click', event);
                }
                
            }else{
                defaultButtonCaller.call(this);
            }
        
            if(expire && expireData){
                const expireBox = this.expireWrap.childNodes;
    
                if(expireBox.length > 1){
                    Array.from(expireBox).map(({childNodes}) => {
                        Array.from(childNodes).find(e => {
                            if(e.tagName.toLowerCase() === 'input'){
                                e.addEventListener('click', handleCheckbox);
                            }
                        });
                    });
    
                    function handleCheckbox({ target }){
                        const expire = this.LayerPopup.expireWrap.childNodes;
    
                        Array.from(expire).map(({childNodes}) => {
                            Array.from(childNodes).find(e => {
                                if(e.tagName.toLowerCase() === 'input' && e.id !== target.id) {
                                    e.checked = false;
                                }
                            });
                        });
                    }
                }
            }
        }else{
            if(expire && expireData){
                if(expireData.length > 1) {
                    return false;
                }
                
                const expireBox = this.expireWrap.childNodes;
                
                Array.from(expireBox[0].childNodes).map((el) => {
                    el.addEventListener('click', ({target}) => {
                        if(target.tagName.toLowerCase() === 'input'){
                            that._handleExpire(target.value);
                            that.close();
                        }
                        
                    });
                });
                
            }
        }

        /**
         * 기본 버튼 이벤트 호출러
         * @this target
         */
        function defaultButtonCaller(){
            const that = this;

            if(this.buttonsWrap.childNodes.length > 1){
                const buttons = this.buttonsWrap.childNodes;

                Array.from(buttons).map(el => {
                    el.addEventListener('click', that._handleDefaultClick);
                    el.event = that._handleDefaultClick;
                });
            }
        }
    } // _attachEvent

    /**
     * 레이어팝입이 제공하는 기본 버튼에 대한 이벤트
     * @param {MouseEvent} e.target 클릭한 버튼
     */
    _handleDefaultClick({ target }){
        const {LayerPopup} = target;
        const {options, expireWrap} = LayerPopup;
        const {button, expire, expireData} = options;
        const btnClass = target.classList.value;
        let result = (btnClass.search('done') > 0) ? true : false;

        if(button){
            if(LayerPopup.callback && LayerPopup.callback !== ''){
                LayerPopup.callback(result);
            }
        }

        if(expire && expireData){
            const expire = expireWrap.childNodes;
                Array.from(expire).map(({childNodes}) => {
                    Array.from(childNodes).map(e => {
                        if(e.tagName.toLowerCase() === 'input'){
                            if(e.checked && result){
                                LayerPopup._handleExpire(e.value);
                            }
                        }
                    });

                });
        }

        LayerPopup.close();
    }

    /**
     * 닫기 후 만료일 설정
     * @this LayerPopup
     * @param {string|number} day 만료 날짜
     */
    _handleExpire(day){        
        const { className } = this.options;
        let randomNumber = this._getRandomNumber();
        
        this.uniqueName = className + randomNumber;
        this._setCookie(this.uniqueName, day);
    }

    /**
     * 랜덤 번호 추출
     * @return 랜덤 숫자 값
     */
    _getRandomNumber(){
        let num = new Date().getMinutes();

        let i = 0;
        for(; i < 4; i++){
            num += String(Math.floor(Math.random() * 9));  
        }

        return num;
    }

    /**
     * 레이어 팝업 dim 배경 스크롤 처리
     * @param {boolean} isState 레이어팝업 dim 배경 스크롤 유무
     */
    _setBodyScroll(isState){
        if(isState){
            document.body.style.removeProperty('overflow');

        }else{
            document.body.style.overflow = 'hidden';
        }
    }

    /** 
     * 이벤트 해제
     * @this LayerPopup
     */
    _dettachEvent(){
        const buttonNodes = this.buttonsWrap.childNodes;
            
        Array.from(buttonNodes).map(el => {
            el.removeEventListener('click', el.event);
        });
    }

    /**
     * 쿠키 세팅
     * @param {string} value 쿠키 저장할 value
     * @param {string | number} days 쿠키 저장 날짜
     * @example
     * this._setCookie('레이어팝업123', 7);
     */
    _setCookie(value, days){
        const date = new Date();

        date.setDate(date.getDate() + Number(days));
        document.cookie = this.uniqueName + "=" + escape(value) + "; path=/; expires=" + date.toUTCString() + ";"
    }

    /**
     * 저장한 쿠키 가져오기
     * @param {string} name 쿠키 이름 
     * @return 쿠키 값
     * @throws 쿠키 값이 없으면 null 리턴
     * @example
     * this._getCookie('레이어팝업123')
     */
    _getCookie(name){
        const value = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
        return value ? value[2] : null;
    }

    /**
     * 레이어팝업 오픈, 외부 접근자 함수
     * @this LayerPopup
     * @example
     * const defaultPopup = new LayerPopup();
     * target.addEventListener('click', () => {
     *      defaultPopup.open();
     * });
     */
    open(){
        if(this.uniqueName && this._getCookie(this.uniqueName)){
            console.log(this.uniqueName,'로 쿠키 적용 중입니다.');

        }else{
            const {dim, scroll} = this.options; 

            if(!scroll){
                this._setBodyScroll(false);
            }

            setZindex.call(this);
            
            if(dim && this.dim) {
                this.dim.classList.add('on');
            }
            
            this.wrap.classList.add('on');

            /**
             * zindex 설정
             * @throws 기존에 열려있는 팝업이 있으면 값 조정 [기존 zindex + 오픈된 레이어팝업 갯수]
             */
            function setZindex(){
                const otherPopup = document.querySelectorAll('[data-type="layerPopup"].on');

                if(otherPopup){
                    if(!this.wrap.classList.contains('on')){
                        this.wrap.style.zIndex =  Number(this.wrap.style.zIndex) + Number(otherPopup.length);
                    }
                }
            }
        }
    }

    /**
     * 팝업 닫기, 외부 접근자 함수
     * @this LayerPopup
     * @param {boolean} isExpireState 만료일 설정이 되었으면 true, 아니면 false
     */
    close(isExpireState){
        const {expireWrap} = this;
        const {dim, scroll, expire, expireData} = this.options;

        if(!scroll){
            this._setBodyScroll(true);
        }

        this.wrap.style.zIndex = 1000;
        this.wrap.classList.remove('on');

        if(dim && this.dim) {
            const layer = document.querySelectorAll('[data-type="layerPopup"]');
            let i = 0;

            // 팝업이 여러개일때 딤처리
            Array.from(layer).map(({classList}) => {
                if(!classList.contains('on')){
                    i ++;
                }
            });

            if(layer.length === i){
                this.dim.classList.remove('on');
            }
        }

        if(expire && expireData){
            _resetChecked(this);

            /**
             * 체크박스 리셋상태로 전환
             * @param {object} LayerPopup 레이어팝업 객체
             */
            function _resetChecked(LayerPopup){
                const child = expireWrap.childNodes;
                Array.from(child).map(({childNodes}) => {
                    Array.from(childNodes).map(e => {
                        if(e.tagName.toLowerCase() === 'input' && e.checked){
                            e.checked = false;

                            if(isExpireState){
                                LayerPopup._handleExpire(e.value);
                            }
                        }
                    });
                });

            } 
        }
    }    

    /**
     * 레이어팝업 관련 객체들 삭제, 외부 접근자 함수
     * @this LayerPopup
     */
    remove(){
        const otherPopup = document.querySelectorAll('[data-type="layerPopup"].on');

        if(otherPopup){
            this.dim.remove();
        }

        this._dettachEvent();
        this.wrap.remove();

        this.name,
        this.options,
        this.callback,
        this.dim,
        this.wrap,
        this.wrapInner,
        this.header,
        this.container,
        this.footer,
        this.content,
        this.title,
        this.closeButton,
        this.buttonsWrap,
        this.done,
        this.cancel,
        this.expireWrap,
        this.uniqueName = null;
    }  
}