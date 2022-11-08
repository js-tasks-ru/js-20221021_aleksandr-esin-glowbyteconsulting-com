export default class SortableTable {
  constructor(headerConfig = [], data = []) {
    this.headerConfig = headerConfig.map((item) => {
      item.itemobj = null; //поле для сохранения ссылки на созданый элемент заголовка
      item.template = item.template ? item.template : (data = []) => {return `<div class="sortable-table__cell">${data}</div>`};
      return item;
    });

    this.data = data.map((item, index) => {
      item.itemobj = null; //поле для сохранения ссылки на созданый элемент списка (строку)
      return item;
    });
    
    this.render();
  }

  get template() {
    return `
    <div class="sortable-table">
      <div data-element="header" class="sortable-table__header sortable-table__row">
       
      </div>
      <div data-element="body" class="sortable-table__body">
      
      </div>
    </div>
    `;
      
  }

  render() {
    const wrapper = document.createElement("div");
    wrapper.innerHTML = this.template;
    this.element = wrapper.firstElementChild;
    this.headerBlock = this.element.firstElementChild;
    this.bodyBlock = this.headerBlock.nextElementSibling;
    this.subElements = this.getSubElements(this.element); //не используется в моей реализации
    this.сreateHeaderItems(); //создаем заголовок
    this.сreateBodyItems(); //создаем список
  }

  сreateHeaderItems(){   
    this.headerConfig.map((item, index) => {
      const wrapper = document.createElement("div");
      wrapper.innerHTML =  `<div class="sortable-table__cell" data-id="${item.id}"
                            data-sortable="${item.sortable}" 
                            data-order="">
                            <span>${item.title}</span>
                            </div>`;
      this.headerConfig[index].itemobj = wrapper.firstElementChild; //Сохраняем ссылку на элемент заголовка 
      this.headerBlock.append(wrapper.firstElementChild);
    });
  }

  сreateBodyItems(){
    
    this.data.map((item, index) => {
      const wrapper = document.createElement("div");
      wrapper.innerHTML =  `<a href="/products${item.id}" class="sortable-table__row">
                            ${this.getItemString(item) /*заполняем строку */} 
                            </a>`;
      this.data[index].itemobj = wrapper.firstElementChild; //Сохраняем ссылку на строку 
      this.bodyBlock.append(wrapper.firstElementChild);
    });
  }

  getItemString(item){
    return this.headerConfig.map((headItem) => {
      return headItem.template(item[headItem.id]);
    }).join('');
  }

  sort(fieldValue, orderValue){
    let sortType = '';
    
    if (this.headerConfig.find((item) => { //Проверяем, доступность сортировки по полю
      if (item.id === fieldValue){
        sortType = item.sortType; //Сохраняем тип сортировки
        item.itemobj.dataset.order = orderValue; //Обновляем data-order в Header
        return true;
      }
        return  false;
    })) {
        this.data.sort((fstItem, secItem) => {        
        if (sortType === 'string'){ //Сортировка строк
          const myCompare = (a, b) => {return a.localeCompare(b, ['rus', 'enu'], {caseFirst: 'upper'}); }//Сортировка с учетом локали
          if(orderValue === 'asc'){
            return myCompare(fstItem[fieldValue], secItem[fieldValue])
          }
          else if(orderValue === 'desc'){
            return myCompare(secItem[fieldValue], fstItem[fieldValue]); 
          }

        } else if (sortType === 'number'){ //Сортировка чисел
          if(orderValue === 'asc'){
            return fstItem[fieldValue] - secItem[fieldValue];
          }
          else if(orderValue === 'desc'){
            return secItem[fieldValue] - fstItem[fieldValue];
          }
        } else {return 0}
      });
    };
    
    for (const item of this.data) {
      item.itemobj.remove();
    }
    for (const item of this.data) {
      this.bodyBlock.append(item.itemobj);
    }
    
    
  }

  getSubElements(element){
    const result = {};
    const elements = element.querySelectorAll('[data-element]');

    for (const subElement of elements){
      const name = subElement.dataset.element;
      result[name] = subElement;
    }
    return result;
  }
  
  initEventListeners() {
  // NOTE: в данном методе добавляем обработчики событий, если они есть
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
    // NOTE: удаляем обработчики событий, если они есть
  }

}

