export default class ColumnChart {
  constructor({data = [], label = '', value = '', link = '', formatHeading = data => data} = {}) {
    this.label = label;
    this.value = value;
    this.link = link;
    this.formatHeading = formatHeading;
    this.chartHeight = 50;

    this.setDataDependsProps(data);

    this.render();
  }
  setDataDependsProps(data) {
    this.data = data;
    this.maxHeight = Math.max(...this.data);
    this.scale = this.chartHeight / this.maxHeight;
    this.dataIsloading = data.length ? '' : 'column-chart_loading';
  }
  createTitle() {
    const link = this.link ? `<a class="column-chart__link" href="${this.link}">View all</a>` : ``;
    return `
        <div class="column-chart__title">Total ${this.label}
            ${link}
        </div>
    `;
  }
  createContainer() {
    return `
        <div class="column-chart__container">
            <div data-element="header" class="column-chart__header">${this.formatHeading(this.value)}</div>
            <div data-element="body" class="column-chart__chart">
              ${this.createChart()}
            </div>
        </div>
    `;
  }
  createChart() {
    return this.data.
      map(item =>
        `
            <div style="--value: ${Math.floor(item * this.scale)}" data-tooltip="${Math.round(item / this.maxHeight * 100)}%">
            </div>
        `
      ).join('');
  }
  render() {
    const element = document.createElement('div'); // (*)

    element.innerHTML =
      `
        <div class="column-chart ${this.dataIsloading}" style="--chart-height: ${this.chartHeight}">
          ${this.createTitle()}
          ${this.createContainer()}
        </div>
      `;

    this.element = element.firstElementChild;
  }
  update(data) {
    this.setDataDependsProps(data);

    const chart = this.element.querySelector('.column-chart__chart');
    chart.innerHTML = this.createChart();
  }

  remove () {
    this.element.remove();
  }

  destroy() {
    this.remove();
  }
}
