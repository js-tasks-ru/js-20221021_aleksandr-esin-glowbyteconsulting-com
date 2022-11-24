import fetchJson from './utils/fetch-json.js';

const BACKEND_URL = 'https://course-js.javascript.ru';

export default class SortableTable {
  data = [];
  loading = false;
  step = 20;
  start = 1;
  end = this.start + this.step;
  
  onSortClick = (event) => {
    const eventElement = event.target.closest('[data-id]');
    const getOrder = (eventElement) => {
      if (eventElement.dataset.order){
        if (eventElement.dataset.order === 'asc'){
          return 'desc';
        } else if (eventElement.dataset.order === 'desc'){
          return 'asc';
        }
        return eventElement.dataset.order === 'asc' ? 'desc' : 'asc';
      }
      return 'desc';
    }
   
    if (this.isSortLocally) {
      this.sortOnClient(eventElement.dataset.id, getOrder(eventElement));
    } else {
      this.sortOnServer(eventElement.dataset.id, getOrder(eventElement));
    }

  }

  onWindowScroll = async (event) =>{
    const { bottom } = this.element.getBoundingClientRect();
    const { id, order } = this.sorted;

    if (bottom < document.documentElement.clientHeight && !this.loading && !this.isSortLocally) {
      this.loading = true;
      await this.loadDeata(id, order, this.start, this.end);
      this.loading = false;      
    }
  }

  constructor(headersConfig, {
    sorted = {},
    url = '',
    isSortLocally = false,
  } = {}) {
    this.headerConfig = headersConfig.map((item) => {
      item.itemobj = null; //поле для сохранения ссылки на созданый элемент заголовка
      item.template = item.template ? item.template : (data = []) => {return `<div class="sortable-table__cell">${data}</div>`};
      return item;
    });
    
    this.isSortLocally = isSortLocally;
    this.sorted = sorted;
    this.url = new URL(url , BACKEND_URL);    
    this.render();
    
    //this.getServerData();
    //this.sort(sorted.id, sorted.order);
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

  async render() {
    const {id, order} = this.sorted;

    const wrapper = document.createElement("div");
    wrapper.innerHTML = this.template;
    this.element = wrapper.firstElementChild;
    this.headerBlock = this.element.firstElementChild;
    this.bodyBlock = this.headerBlock.nextElementSibling;
    
    this.сreateHeaderItems(); //создаем заголовок
    this.createSortArrowElemnt();
    this.subElements = this.getSubElements(this.element); //не используется в моей реализации  
    
    this.initEventListeners();
    await this.loadDeata(id, order, this.start, this.end);
    
  }

  sortOnClient (id, order) {
    let sortType = '';
    const headerItem = this.checkSortableId(id);
    if (headerItem){
      sortType = headerItem.sortType; 
      headerItem.itemobj.dataset.order = order; //Обновляем data-order в Header
      this.elementArrow.remove();
      headerItem.itemobj.append(this.elementArrow);

      this.data.sort((fstItem, secItem) => {        
        if (sortType === 'string'){ //Сортировка строк
          const myCompare = (a, b) => {return a.localeCompare(b, ['rus', 'enu'], {caseFirst: 'upper'}); }//Сортировка с учетом локали
          if(order === 'asc'){
            return myCompare(fstItem[id], secItem[id])
          }
          else if(order === 'desc'){
            return myCompare(secItem[id], fstItem[id]); 
          }

        } else if (sortType === 'number'){ //Сортировка чисел
          if(order === 'asc'){
            return fstItem[id] - secItem[id];
          }
          else if(order === 'desc'){
            return secItem[id] - fstItem[id];
          }
        } else {return 0}
      });
    }


    this.sort(id, order);
  }

  async sortOnServer (id, order) {
    const start = 1;
    const end = start + this.step;
    
    for (const item of this.data) {
      item.itemobj.remove();
    }
    await this.loadDeata(id, order, this.start, this.end);
   
  }

  //проверить доступность сортировки по столбцу
  checkSortableId(id){
    return this.headerConfig.find((item) => { //Проверяем, доступность сортировки по полю
      if (item.id === id && item.sortable === true){ //Возвращаем объект, если имя существует и признак ortable === true 
        return true;
      }
        return  false;
    });
  }
  //обновить заголовок
  //обновить данные



  
  sort(fieldValue, orderValue){
    let sortType = '';
    const headerItem = (() => {
      return this.headerConfig.find((item) => { //Проверяем, доступность сортировки по полю
        if (item.id === fieldValue && item.sortable === true){ //Возвращаем объект, если имя существует и признак ortable === true 
          return true;
        }
          return  false;
      });
    })();

    if (headerItem) {
      

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






  async loadDeata(id, order, start = this.start, end = this.end){
    this.element.classList.add('sortable-table_loading');
    
    this.url.searchParams.set('_sort', id);
    this.url.searchParams.set('_order', order);
    this.url.searchParams.set('_start', start);
    this.url.searchParams.set('_end', end);

    const data = await fetchJson(this.url);
    data.map((item) => {
      item.itemobj = null;
      this.data.push(item);
    });

    this.start = this.end;
    this.end = this.start + this.step;
    
    this.element.classList.remove('sortable-table_loading');

    this.сreateBodyItems(); //создаем список
  }

  сreateHeaderItems(){   
    this.headerConfig.map((item, index) => {
      const wrapper = document.createElement("div");
      wrapper.innerHTML =  `<div class="sortable-table__cell" data-id="${item.id}"
                            data-sortable="${item.sortable}" 
                            data-order="asc">
                            <span>${item.title}</span>
                            </div>`;
      this.headerConfig[index].itemobj = wrapper.firstElementChild; //Сохраняем ссылку на элемент заголовка 
      this.headerBlock.append(wrapper.firstElementChild);
    });
  }

  сreateBodyItems(){    
    this.data.map((item, index) => {
      if (item.itemobj === null){
        const wrapper = document.createElement("div");
        wrapper.innerHTML =  `<a href="/products${item.id}" class="sortable-table__row">
                            ${this.getItemString(item) /*заполняем строку */} 
                            </a>`;
        this.data[index].itemobj = wrapper.firstElementChild; //Сохраняем ссылку на строку 
        this.bodyBlock.append(wrapper.firstElementChild);
      }
    });
  }

  createSortArrowElemnt(){
    const wrapper = document.createElement("div");
    wrapper.innerHTML = `<span data-element="arrow" class="sortable-table__sort-arrow">
                        <span class="sort-arrow"></span>
                        </span>`;
    this.elementArrow = wrapper.firstElementChild;

  }

  getItemString(item){
    return this.headerConfig.map((headItem) => {
      return headItem.template(item[headItem.id]);
    }).join('');
  }

  getSubElements(element){
    const elements = element.querySelectorAll('[data-element]');

    return [...elements].reduce((accum, subElement) => {
      accum[subElement.dataset.element] = subElement;

      return accum;
    }, {});
  }
  
  initEventListeners() {
    this.subElements.header.addEventListener('pointerdown', this.onSortClick);    
    window.addEventListener('scroll', this.onWindowScroll);
  // NOTE: в данном методе добавляем обработчики событий, если они есть
  }

  remove() {
    this.element.remove();
    this.subElements.header.removeEventListener('pointerdown', this.onSortClick);
    window.removeEventListener('scroll', this.onWindowScroll);
  }

  destroy() {
    this.remove();
    // NOTE: удаляем обработчики событий, если они есть
  }
}

