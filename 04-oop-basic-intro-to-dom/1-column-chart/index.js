export default class ColumnChart {
    constructor(params) {
        this.render(params);
        this.initEventListeners();
        this.chartHeight = 50;
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
        if (link != undefined){
            return '<a class="column-chart__link" href="' + link + '">View all</a>';
        }
        return "";
    }

    getFormatedValue(value, formatHeading = data => `${data}`){
        return formatHeading(value);
    }

    getChart(data){
        if (data === undefined){ return "";}
        
        const maxValue = Math.max(...data);
        const scale = 50 / maxValue;
        let chartHTML ='';
        for (const item of data){
            chartHTML = chartHTML + '<div style="--value: ' + String(Math.floor(item * scale)) + '" data-tooltip="' + (item / maxValue * 100).toFixed(0) + '%"></div>';
        }
        return chartHTML;
    }

    render({...params} = {}) {
        const element = document.createElement("div");
        element.innerHTML = this.getTemplate();
        this.element = element.firstElementChild;

        if (params.label === undefined){
            this.element.className =  this.element.className + " column-chart_loading";
            params.label = "";
        } 
        
        this.title = this.element.firstElementChild;
        this.title.innerHTML = params.label + this.getLinkTemplate(params.link);
        this.container = this.title.nextElementSibling;
        this.header = this.container.firstElementChild;
        this.header.innerHTML = (params.value === undefined ? 0 : this.getFormatedValue(params.value, params.formatHeading));
        this.chart = this.header.nextElementSibling;
        this.chart.innerHTML = this.getChart(params.data);

    }

    update([...params] = []){
        this.chart.innerHTML = this.getChart(params);
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
