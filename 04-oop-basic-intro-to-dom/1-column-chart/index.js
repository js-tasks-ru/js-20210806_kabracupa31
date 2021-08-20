export default class ColumnChart {
  constructor({data = [], label = '', value = '', link = '', formatHeading = null} = {}) {
    this.label = label;
    this.value = value;
    this.link = link;
    this.formatHeading = formatHeading;

    this.setDataDependsProps(data);

    this.render();
    this.initEventListeners();
  }
  setDataDependsProps(data) {
    this.data = data;
    this.chartHeight = 50;
    this.maxHeight = Math.max(...this.data);
    this.scale = this.chartHeight / this.maxHeight;
    this.dataIsloading = data.length ? '' : 'column-chart_loading';
  }
  appendTitle() {
    const link = this.link ? `<a class="column-chart__link" href="${this.link}">View all</a>` : ``;
    return `
        <div class="column-chart__title">Total ${this.label}
            ${link}
        </div>
    `;
  }
  appendContainer() {
    const formatedValue = this.formatHeading ? this.formatHeading(this.value) : this.value;

    return `
        <div class="column-chart__container">
            <div data-element="header" class="column-chart__header">${formatedValue}</div>
            <div data-element="body" class="column-chart__chart">` +
              this.appendChart() +
            `</div>
        </div>
    `;
  }
  appendChart() {
    return this.data.reduce((chartColumns, item) =>
    { return chartColumns +
        ` <div style="--value: ${Math.floor(item * this.scale)}" data-tooltip="${Math.round(item / this.maxHeight * 100)}%">
          </div>
        `;
    }, ``);
  }
  render() {
    const element = document.createElement('div'); // (*)

    element.innerHTML =
      `
        <div class="column-chart ${this.dataIsloading}" style="--chart-height: ${this.chartHeight}">` +
          this.appendTitle() +
          this.appendContainer() +
        `</div>
      `;

    // NOTE: в этой строке мы избавляемся от обертки-пустышки в виде `div`
    // который мы создали на строке (*)
    this.element = element.firstElementChild;
  }
  update(data) {
    this.setDataDependsProps(data);

    const chart = this.element.querySelector('.column-chart__chart');
    chart.innerHTML = this.appendChart();
    //chart.insertAdjacentHTML('beforebegin', this.appendContainerBody());
    //chart.remove();
  }
  initEventListeners () {
    // NOTE: в данном методе добавляем обработчики событий, если они есть
  }

  remove () {
    this.element.remove();
  }

  destroy() {
    this.remove();
    // NOTE: удаляем обработчики событий, если они есть
  }
}
