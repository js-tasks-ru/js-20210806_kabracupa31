import fetchJson from './utils/fetch-json.js';
import {createGetter} from "../../03-objects-arrays-intro-to-testing/1-create-getter";

const BACKEND_URL = 'https://course-js.javascript.ru';

export default class SortableTable {
  onCaptionClick = (event) =>{
    const orderValues =
      {
        asc: 'desc',
        desc: 'asc',
        '': 'desc',
        'undefined': 'desc',
      };
    this.sorted.column = event.target.closest('.sortable-table__cell[data-id]');
    this.sorted.id = this.sorted.column.dataset.id;
    this.sorted.order = orderValues[this.sorted.column.dataset.order];

    this.sort();
  }
  onScroll = async () =>{
    if (this.element.getBoundingClientRect().bottom < document.documentElement.clientHeight + 200
      && !this.isSortLocally
      && this.shouldLoadData
      && !this.isLoading) {
      const start = this.loadedRecCount+1;
      const end = this.loadedRecCount + this.defaultLoadCount;
      this.isLoading = true;
      try {
        const data = await this.loadData(start, end);
        this.updateData(start, end, data);
        this.updateBody(start, data);
      } catch (err) {
        console.error(err);
      } finally {
        this.isLoading = false;
      }
    }
  }
  constructor(
    headerConfig = [],
    {
      url = '',
      isSortLocally = false,
      data = [],
      sorted = {
        id: headerConfig.find(item => item.sortable).id,
        order: 'asc'
      }
    } = {}) {
    this.headerConfig = headerConfig;
    this.url = new URL(`${BACKEND_URL}\/${url}`);
    this.data = Array.isArray(data) ? data : data.data;

    this.sorted = sorted;
    this.isSortLocally = isSortLocally;

    this.defaultLoadCount = 30;
    this.loadedRecCount = 0;

    this.isLoading = false;
    this.shouldLoadData = true;

    this.render();
  }
  sort() {
    this.sorted.column = this.subElements.header.querySelector(`.sortable-table__cell[data-id="${this.sorted.id}"]`);

    if (this.isSortLocally) {
      this.sortOnClient(this.sorted.id, this.sorted.order);
    } else {
      this.sortOnServer(this.sorted.id, this.sorted.order);
    }
  }
  sortOnClient (field, order) {
    if (!this.data.length) {
      this.subElements.body.innerHTML =
        this.createMessageEmptyData();
      return;
    }
    if (this.needToSort()) {
      this.updateColumns();
      this.subElements.body.innerHTML =
        this.createBodyRows(this.sortData(this.sorted.column.dataset.sortType));
    }
  }
  needToSort() {
    if (this.sorted.order && this.sorted.sortColumn && this.sorted.sortColumn.dataset.sortable) {return true;}
    return false;
  }
  async sortOnServer (field, order) {
    const start = 0;
    const end = this.defaultLoadCount;

    const data = await this.loadData(start, end).
      catch(err => {console.error(err);});
    this.updateData(start, end, data);
    this.updateBody(start, data);
  }
  updateData(start, end, data) {
    if (!data.length || data.length < this.defaultLoadCount) {
      this.shouldLoadData = false;
    }
    if (start) {
      this.data.push(...data);
      this.loadedRecCount += data.length;
    } else {
      this.data = data;
      this.loadedRecCount = data.length;
    }
  }
  loadData(start, end) {
    this.url.searchParams.set('_sort', this.sorted.id);
    this.url.searchParams.set('_order', this.sorted.order);
    this.url.searchParams.set('_start', start);
    this.url.searchParams.set('_end', end);
    return fetchJson(this.url);
  }

  get template() {
    return `
              <div data-element="productsContainer" class="products-list__container">
                  <div class="sortable-table">
                    <div data-element="header" class="sortable-table__header sortable-table__row">
                        ${this.createHeaderCells()}
                    </div>
                    <div data-element="body" class="sortable-table__body">
                        ${this.createBodyRows()}
                    </div>
                  </div>
              </div>
           `;
  }
  createHeaderCells() {
    return this.headerConfig.
    map(item => {
      const arrow = !item.sortable
        ? ``
        :
        `
                    <span data-element="arrow" class="sortable-table__sort-arrow">
                        <span class="sort-arrow"></span>
                    </span>
                  `; return `
                            <div class="sortable-table__cell" data-id=${item.id} data-sortable=${item.sortable} data-sortType=${item.sortType}>
                                <span>${item.title}</span>
                                    ${arrow}
                                </div>
                          `;
    }).
    join('');
  }
  createMessageEmptyData() {
    return `
        <div style="text-align: center ">
            Нет данных
        </div>
      `;
  }
  createBodyRows(data = []) {
    return data.map(item => {
      return `
        <a href="/products/${item.id}" class="sortable-table__row">
            ${this.createBodyCells(item)}
        </a>
      `;
    }).join('');
  }
  createBodyCells(item) {

    return this.headerConfig.
    map(headerItem => {
      const getterId = createGetter(headerItem.id);

      return headerItem.template
        ? `${headerItem.template(getterId(item))}`
        : `<div class="sortable-table__cell">${getterId(item)}</div>`;
    }).
    join('');
  }
  updateBody(start = 0, data = this.data) {
    if (start === 0) {
      this.updateColumns();
      this.subElements.body.innerHTML =
        this.createBodyRows(this.data);
    } else {
      this.subElements.body.insertAdjacentHTML('beforeend', this.createBodyRows(data));
    }
  }
  async render() {
    const element = document.createElement('div');
    element.innerHTML = this.template;
    this.element = element.firstElementChild;
    this.subElements = this.getsubElements();
    await this.sortOnServer();
    this.addEventListeners();
  }

  remove() {
    this.element.remove();
  }
  destroy() {
    this.remove();
    this.removeEventListeners();
  }
  removeEventListeners() {
    document.removeEventListener('scroll', this.onScroll);
  }
  updateColumns() {
    this.subElements.header.querySelectorAll(`.sortable-table__cell[data-id]`).
    forEach(column => {
      return column === this.sorted.column ? column.dataset.order = this.sorted.order : column.dataset.order = '';
    }
    );
  }
  sortData(sortType) {
    return [...this.data].sort((a, b) => {
      let sign;
      if (this.sorted.order === 'asc') {sign = 1;} else if (this.sorted.order === 'desc') {sign = -1;}

      switch (sortType) {
      case 'number' : return sign * (a[this.sorted.id] - b[this.sorted.id]);
      case 'custom' : return sign * customSorting(a[this.sorted.id], b[this.sorted.id]);
      case 'string' :
      default : return sign * a[this.sorted.id].localeCompare(b[this.sorted.id], 'ru-en');
      }
    });
  }
  getsubElements() {
    const elements = this.element.querySelectorAll(`[data-element]`);
    return [...elements].reduce((result, subElement) => {
      result[subElement.dataset.element] = subElement;
      return result;
    }, {});
  }
  addEventListeners() {
    this.subElements.header.addEventListener('pointerdown', this.onCaptionClick);
    document.addEventListener('scroll', this.onScroll);
  }
}

