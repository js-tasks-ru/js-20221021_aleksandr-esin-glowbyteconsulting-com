import fetchJson from './utils/fetch-json.js';

const BACKEND_URL = 'https://course-js.javascript.ru';

export default class ColumnChart {
    constructor({
        label = '',
        link = '',
        formatHeading = data => data,
        url = '',
        range = {
            from: new Date(),
            to: new Date(),
        }
    } = {}) {
        this.chartHeight = 50;
        this.serverURL = 'https://course-js.javascript.ru';
        this.componentURL = url;
        this.range = range;
        this.label = label;
        this.link = link;
        this.formatHeading = formatHeading;

        this.element = null;
        this.data = {};
        this.subElements = {};
        this.dataItems = [];
        this.render();        
        this.update( this.range.from, this.range.to);
        this.initEventListeners();
    }  

    getTemplate() {
      return `
        <div class="column-chart">
            <div class="column-chart__title">
                Total orders
            </div>
            <div class="column-chart__container">
                <div data-element="header" class="column-chart__header">
                
                </div>
                <div data-element="body" class="column-chart__chart">

                </div>
            </div>
        </div>
      `;
    }

    getLinkTemplate(link){
        return link === undefined ? "" : '<a class="column-chart__link" href="' + link + '">View all</a>';
    }

    getFormatedValue(value, formatHeading = data => `${data}`){
        return formatHeading(value);
    }

    render() {
        const element = document.createElement("div");
        element.innerHTML = this.getTemplate();
        this.element = element.firstElementChild;
        this.subElements = this.getSubElements(this.element);

        if (this.label === undefined){
            this.element.className =  this.element.className + " column-chart_loading";
            this.label = "";
        } 
        
        this.title = this.element.firstElementChild;
        this.title.innerHTML = "Total " + this.label + this.getLinkTemplate(this.link);
        this.container = this.title.nextElementSibling;
        this.header = this.container.firstElementChild;
        this.header.innerHTML = (this.value === undefined ? 0 : this.getFormatedValue(this.value, this.formatHeading));
        this.chart = this.header.nextElementSibling;
    }

    updateRange(from, to) {
        this.range.from = from;
        this.range.to = to;
      }

    updateHeader(data = {}){
        if (Object.keys(data).length  === 0){ 
            this.header.innerHTML = 0;
            return;
        } 
        this.header.innerHTML = this.getFormatedValue(Object.values(data).reduce((sum, item) => sum + item), this.formatHeading);
        
    }

    updateChart(data){
        //удаляем существующие колонки
        this.dataItems.map(item => {
            item.itemObj.remove();
        });
        this.dataItems = [];
        this.subElements.body.innerHTML = ''
        
        //выходим при отсутствии данных
        if (Object.keys(data).length  === 0){ return "";} 

        //рассчитываем колонки
        const maxValue = Math.max(...Object.keys(data).map(item => data[item]));
        const scale = this.chartHeight / maxValue;
        
        //заполняем массив колокнок с данными и ссылками на <div>
        Object.keys(data).map((item) => {
            let itemElement = document.createElement("div");
            itemElement.innerHTML = '<div style="--value: ' + String(Math.floor(data[item] * scale)) + '" data-tooltip="' + (data[item] / maxValue * 100).toFixed(0) + '%"></div>';
            this.dataItems.push({
                date: item, 
                value: data[item],
                itemObj: itemElement.firstElementChild
            });
        });

        //выводим элементы
        this.dataItems.map(item => {   
            this.subElements.body.append(item.itemObj);
        });
    }

    getSubElements(element) {
        const elements = element.querySelectorAll('[data-element]');
    
        return [...elements].reduce((accum, subElement) => {
          accum[subElement.dataset.element] = subElement;
    
          return accum;
        }, {});
      }

    async getServerRequest(dateFrom, dateTo){
        //создаем запрос на сервер
        let url = new URL(this.componentURL, this.serverURL);
        url.searchParams.set('from', dateFrom.toISOString());
        url.searchParams.set('to', dateTo.toISOString());
        return fetchJson(url);
    }

    async update(dateFrom , dateTo){
        this.element.classList.add("column-chart_loading");

        try{
            let data = await this.getServerRequest(dateFrom, dateTo);
    
            if (Object.values(data).length){
                this.data = data;
                this.updateChart(data);
                this.updateHeader(data);
                this.updateRange(dateFrom, dateTo);
            }
        }catch(error){
            console.error('Update Error:', error);
        }
        this.element.classList.remove("column-chart_loading");

        return this.data;
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