import RangePicker from './components/range-picker/src/index.js';
import SortableTable from './components/sortable-table/src/index.js';
import ColumnChart from './components/column-chart/src/index.js';
import header from './bestsellers-header.js';

import fetchJson from './utils/fetch-json.js';

const BACKEND_URL = 'https://course-js.javascript.ru/';

export default class Page {
    element;
    subElements = {};
    components = {};
    url = new URL('api/dashboard/bestsellers', BACKEND_URL);

    constructor () {
        const now = new Date();
        const to = new Date();
        const from = new Date(now.setMonth(now.getMonth() - 1));

        const rangePicker = new RangePicker({
            from,
            to
        });

        const ordersChart = new ColumnChart({
            label: 'orders',
            url: 'api/dashboard/orders',
            range: {
              from,
              to
            },
            link: '#'
        });

        const salesChart = new ColumnChart({
            label: 'sales',
            url: 'api/dashboard/sales',
            range: {
              from,
              to
            }
        });

        const customersChart = new ColumnChart({
            label: 'customers',
            url: 'api/dashboard/customers',
            range: {
              from,
              to
            }
        });

        const sortableTable = new SortableTable(
            header, {
            url: `api/dashboard/bestsellers?_start=1&_end=20&from=${from.toISOString()}&to=${to.toISOString()}`,
            isSortLocally: true
            })

        this.components = {
            rangePicker,
            ordersChart,
            salesChart,
            customersChart,
            sortableTable
        }
    }
  
    get template() {
      return `
            <div class="dashboard">
                <div class="content__top-panel">
                    <h2 class="page-title">Dashboard</h2>
                    <!-- RangePicker component -->
                    <div data-element="rangePicker"></div>
                </div>
                <div data-element="chartsRoot" class="dashboard__charts">
                    <!-- column-chart components -->
                    <div data-element="ordersChart" class="dashboard__chart_orders"></div>
                    <div data-element="salesChart" class="dashboard__chart_sales"></div>
                    <div data-element="customersChart" class="dashboard__chart_customers"></div>
                </div>

                <h3 class="block-title">Best sellers</h3>

                <div data-element="sortableTable">
                    <!-- sortable-table component -->
                </div>
            </div>
      `;
        
    }
  
    async render () {
        const wrapper = document.createElement('div');
        wrapper.innerHTML = this.template;
        this.element = wrapper.firstElementChild;
        
        this.subElements = this.getSubElements();


        this.subElements.rangePicker.append(this.components.rangePicker.element);
        this.subElements.ordersChart.append(this.components.ordersChart.element);
        this.subElements.salesChart.append(this.components.salesChart.element);
        this.subElements.customersChart.append(this.components.customersChart.element);
        this.subElements.sortableTable.append(this.components.sortableTable.element);

        this.initEventListeners();
        return this.element;
    }

    getSubElements(){
        const elements = this.element.querySelectorAll('[data-element]');

        return [...elements].reduce((accum, subElement) => {
          accum[subElement.dataset.element] = subElement;
    
          return accum;
        }, {});
    }

    async updateComponents (from, to) {
        const data = await this.loadData(from, to);
    
        this.components.sortableTable.update(data);
    
        this.components.ordersChart.update(from, to);
        this.components.salesChart.update(from, to);
        this.components.customersChart.update(from, to);
      }
    
      loadData (from, to) {
        this.url.searchParams.set('_start', '1');
        this.url.searchParams.set('_end', '21');
        this.url.searchParams.set('_sort', 'title');
        this.url.searchParams.set('_order', 'asc');
        this.url.searchParams.set('from', from.toISOString());
        this.url.searchParams.set('to', to.toISOString());
    
        return fetchJson(this.url);
      }
  
    initEventListeners() {
        this.components.rangePicker.element.addEventListener('date-select', event => {
            const { from, to } = event.detail;
      
            this.updateComponents(from, to);
          });
    }
  
    remove() {
      this.element.remove();
    }
  
    destroy() {
      this.remove();
      this.subElements = null;
    }
}
