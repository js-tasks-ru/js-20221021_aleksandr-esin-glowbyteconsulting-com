import SortableList from '../../2-sortable-list/solution';
import escapeHtml from './utils/escape-html.js';
import fetchJson from './utils/fetch-json.js';

const IMGUR_CLIENT_ID = '28aaa2e823b03b1';
const BACKEND_URL = 'https://course-js.javascript.ru';

export default class ProductForm {
  productDefaultData = {
    title: '',
    description: '',
    quantity: 1,
    subcategory: '',
    status: 1,
    images: [],
    price: 100,
    discount: 0
  };

  constructor (productId) {
    this.productId = productId;
  }

  onSubmit = event =>{
    event.preventDefault();

    this.save();
  }

  uploadImage = () =>{
    const fileInput = document.createElement('input');

    fileInput.type = 'file';
    fileInput.accept = 'image/*';

    fileInput.addEventListener('change', async () => {
      const [file] = fileInput.files;

      if (file){
        const formData = new FormData();
        formData.append('image', file);

        this.subElements.uploadImage.classList.add('is-loading');
        this.subElements.uploadImage.disabled = true;

        const result = await fetchJson('https://api.imgur.com/3/image', {
          method: 'POST',
          headers: {
            Authorization: `Client-ID ${IMGUR_CLIENT_ID}`,
          },
          body: formData,
          referrer: ''
        });

        this.subElements.imageListContainer.firstElementChild.append(this.getImageItem(result.data.link, file.name));
        
        
        this.subElements.uploadImage.classList.remove('is-loading');
        this.subElements.uploadImage.disabled = false;
      }

      fileInput.remove();
    });

    
    fileInput.hidden = true;
    document.body.append(fileInput);
    

    fileInput.click();
    
  }

  get template() {
    return `
    <div class="product-form">
    <form data-element="productForm" class="form-grid">
      <div class="form-group form-group__half_left">
        <fieldset>
          <label class="form-label">Название товара</label>
          <input required="" type="text" name="title" id="title" class="form-control" placeholder="Название товара">
        </fieldset>
      </div>
      <div class="form-group form-group__wide">
        <label class="form-label">Описание</label>
        <textarea required="" class="form-control" name="description" id="description" data-element="productDescription" placeholder="Описание товара"></textarea>
      </div>
      <div class="form-group form-group__wide" data-element="sortable-list-container">
        <label class="form-label">Фото</label>
        <div data-element="imageListContainer">
        <ul class="sortable-list">
          
        </ul>
      </div>
        <button type="button" data-element="uploadImage" name="uploadImage" class="button-primary-outline">
          <span>Загрузить</span>
        </button>
      </div>
      <div class="form-group form-group__half_left">
        <label class="form-label">Категория</label>
        <select class="form-control" id="subcategory" name="subcategory">
          ${this.getCategoryList()}
        </select>
      </div>
      <div class="form-group form-group__half_left form-group__two-col">
        <fieldset>
          <label class="form-label">Цена ($)</label>
          <input required="" type="number" name="price" id="price" class="form-control" placeholder="100">
        </fieldset>
        <fieldset>
          <label class="form-label">Скидка ($)</label>
          <input required="" type="number" name="discount" id="discount" class="form-control" placeholder="0">
        </fieldset>
      </div>
      <div class="form-group form-group__part-half">
        <label class="form-label">Количество</label>
        <input required="" type="number" class="form-control" name="quantity" id="quantity" placeholder="1">
      </div>
      <div class="form-group form-group__part-half">
        <label class="form-label">Статус</label>
        <select class="form-control" name="status" id="status">
          <option value="1">Активен</option>
          <option value="0">Неактивен</option>
        </select>
      </div>
      <div class="form-buttons">
        <button type="submit" name="save" class="button-primary-outline">
          ${this.productId ? 'Сохранить товар' : 'Добавить товар'}
        </button>
      </div>
    </form>
  </div>
    `;
      
  }

  get emptytemplate(){
    return `<div class="product-form">
            <h1 class="page-title">Страница не найдена</h1>
            <p>Извините, данный товар не существует</p>
            </div>`;
  }

  async render () {
    const pCategoryList = this.getCategoriesData();
    if (this.productId){
      const pProductData = this.getProductData();
      [this.categoryList, this.productData] = await Promise.all([pCategoryList, pProductData]);
      this.productData = this.productData[0];
      this.emptyPage = this.productData ? false : true;
    } else {
      this.emptyPage = false;
      this.categoryList = await pCategoryList;
    }
    
    const wrapper = document.createElement("div");
    wrapper.innerHTML = (!this.emptyPage) ? this.template : this.emptytemplate;
    this.element = wrapper.firstElementChild;
    this.subElements = this.getSubElements(this.element);
    this.initEventListeners();
    if (!this.emptyPage && this.productId){
      this.updateTemolate()
    }
    this.productData ? this.getImageList() : '';
    return this.element;
  }

  async save() {
    const product = this.getFormData();

    try {
      const result = await fetchJson(`${BACKEND_URL}/api/rest/products`, {
        method: this.productId ? 'PATCH' : 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(product)
      });

      this.dispatchEvent(result.id);
    } catch (error) {
      console.error('something went wrong', error);
    }
  }

  getFormData(){
    const value = {
      id: this.productId,
      title: this.subElements.title.value,
      description: this.subElements.productDescription.value,
      quantity: +this.subElements.quantity.value,
      subcategory: this.subElements.subcategory.value,
      status: +this.subElements.status.value,
      images: [],
      price: +this.subElements.price.value,
      discount: +this.subElements.discount.value
    };
    
    return value;
  }

  dispatchEvent (id) {
    const event = this.productId
      ? new CustomEvent('product-updated', { detail: id }) 
      : new CustomEvent('product-saved');

    this.element.dispatchEvent(event);
  }

  async getProductData(){
    return await fetchJson(`${BACKEND_URL}/api/rest/products?id=${this.productId}`);
  }

  async getCategoriesData(){
    return fetchJson(`${BACKEND_URL}/api/rest/categories?_sort=weight&_refs=subcategory`);
  }

  getCategoryList(){
    return this.categoryList.map((item) => {
      return item.subcategories.map((subitem) => {
        return `<option value="${subitem.id}">${item.title} &gt; ${subitem.title}</option>`;
      }).join('');;
    }).join('');
  }

  getImageList(){
    const { imageListContainer } = this.subElements;
    const { images } = this.productData;

    const items = images.map(({ url, source }) => this.getImageItem(url, source));

    const sortableList = new SortableList({
      items
    });

    imageListContainer.append(sortableList.element);
  }



getImageItem(url, name){
    const wrapper = document.createElement('div');
    wrapper.innerHTML = `
      <li class="products-edit__imagelist-item sortable-list__item">
        <span>
          <img src="icon-grab.svg" data-grab-handle alt="grab">
          <img class="sortable-table__cell-img" alt="${escapeHtml(name)}" src="${escapeHtml(url)}">
          <span>${escapeHtml(name)}</span>
        </span>
        <button type="button">
          <img src="icon-trash.svg" alt="delete" data-delete-handle>
        </button>
      </li>`;
    return wrapper.firstElementChild;
  }

  getSubElements(element){
    const elements = element.querySelectorAll('[data-element],input,select');
    return [...elements].reduce((accum, subElement)=>{
      const name = subElement.dataset.element ? subElement.dataset.element : subElement.name
      accum[subElement.dataset.element ? subElement.dataset.element : subElement.name] = subElement;

      return accum;
    }, {});
  }

  updateTemolate(){
    this.subElements.title.value = this.productData.title;
    this.subElements.productDescription.value = this.productData.description;
    this.subElements.subcategory.value = this.productData.subcategory;
    this.subElements.price.value = this.productData.price;
    this.subElements.discount.value = this.productData.discount;
    this.subElements.quantity.value = this.productData.quantity;
    this.subElements.status.value = this.productData.status;
  }

  initEventListeners() {
    this.subElements.productForm.addEventListener('submit', this.onSubmit);
    this.subElements.uploadImage.addEventListener('click', this.uploadImage);

    this.subElements.imageListContainer.addEventListener('click', event => {
      if ('deleteHandle' in event.target.dataset) {
        event.target.closest('li').remove();
      }
    });
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
    this.subElements = null;
    // NOTE: удаляем обработчики событий, если они есть
  }
}
