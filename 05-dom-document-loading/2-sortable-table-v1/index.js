import {createGetter} from "../../03-objects-arrays-intro-to-testing/1-create-getter";

export default class SortableTable {
  constructor(headerConfig = [], data = {}) {
    this.headerConfig = headerConfig;
    this.data = Array.isArray(data) ? data : data.data;//Object.values(data)[0];

    this.render();
  }
  get template() {
    return `
              <div data-element="productsContainer" class="products-list__container">
                  <div class="sortable-table">
                    <div data-element="header" class="sortable-table__header sortable-table__row">
                        ${this.createHeaderCells()}
                    </div>
                    <div data-element="body" class="sortable-table__body">
                        ${this.createBodyRows(this.data)}
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
                  `;
                  return `
                            <div class="sortable-table__cell" data-id=${item.id} data-sortable=${item.sortable} data-sortType=${item.sortType}>
                                <span>${item.title}</span>
                                    ${arrow}
                                </div>
                          `;
                }).
                join('');
  }
  createBodyRows(data) {
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
  render() {
    const element = document.createElement('div');
    element.innerHTML = this.template;
    this.element = element.firstElementChild;
    this.subElements = this.getsubElements();
  }
  remove() {
    this.element.remove();
  }
  destroy() {
    this.remove();
  }
  sort(field, order){
    const sortColumn = this.element.querySelector(`.sortable-table__cell[data-id="${field}"]`);

    if (sortColumn.dataset.sortable === 'false') return;

    this.updateColumns(sortColumn, order);

    this.subElements.body.innerHTML =
        this.createBodyRows(this.sortData(field, order, sortColumn.getAttribute('data-sortType')));
  }
  updateColumns(sortColumn, order){
    this.element.querySelectorAll(`.sortable-table__cell[data-id]`).
      forEach( column => {
        return column === sortColumn ? column.dataset.order = order : column.dataset.order = '';
      }
    );
  }
  sortData(field, order, sortType){
    return [...this.data].sort((a, b) => {
      let sign;
      if (order === 'asc') sign = 1;else if (order === 'desc') sign = -1;

      switch (sortType){
      case 'number' : return sign * (a[field] - b[field]);
      case 'string' :
      default : return sign * a[field].localeCompare(b[field], 'ru-en');
      }
    });
  }
  getsubElements(){
    const elements = this.element.querySelectorAll(`[data-element]`);
    return [...elements].reduce((result, subElement) => {
      result[subElement.dataset.element] = subElement;
      return result;
    }, {});
  }
}

