export default class NotificationMessage {
    static activeElement = null;

    constructor(
            strMessage = '', 
            {duration = 0, 
            type = 'success'} = {}
    ) {
        this.strMessage = strMessage;   
        this.duration = duration;   
        this.type = type;   
        this.timerId = 0; 
        this.render();   
    }  

    get template() {
        return `
            <div class="notification ${this.type}" style="--value:${this.duration / 1000 + 0.01}s"> 
                <div class="timer"></div>
                <div class="inner-wrapper">
                    <div class="notification-header">${this.type}</div>
                    <div class="notification-body">
                        ${this.strMessage}
                    </div>
                </div>
            </div>
        `;// ${this.duration / 1000 + 0.01} - требуется для избежания артефактов при удалении уведобления (удаление происходит чуть позде, чем закончится анимация)
        
    }

    render() {
        const wrapper = document.createElement("div");
        wrapper.innerHTML = this.template;
        this.element = wrapper.firstElementChild;
    }

    show(renderEment = document.body){          
        NotificationMessage.activeElement ? NotificationMessage.activeElement.remove() : ''; //Удаляем существующее уведомление
        
        renderEment.append(this.element);
        NotificationMessage.activeElement = this;
        
        this.timerId = setTimeout(() => {
            this.remove();  
        }, this.duration);
    }
    
    initEventListeners() {
    // NOTE: в данном методе добавляем обработчики событий, если они есть
    }

    remove() {
        this.element.remove();
        clearTimeout(this.timerId);
    }

    destroy() {
        this.remove();
        // NOTE: удаляем обработчики событий, если они есть
    }
}
