class Tooltip {
  static _instance;
  onPointerOut = event => {
    if (!event.target.dataset.tooltip) return;

    event.target.removeEventListener('pointermove', this.onPointerMove);
    this.element.remove();
  }
  onPointerMove = event => {
    const offset = 10;
    this.element.style.left = offset + event.pageX + 'px';
    this.element.style.top = offset + event.pageY + 'px';
  }
  onPointerOver = event => {
    if (!event.target.dataset.tooltip) return;

    this.text = event.target.dataset.tooltip;
    this.render(event.target);
    event.target.addEventListener('pointermove', this.onPointerMove);
  }

  constructor() {
    if (Tooltip._instance) {
      return Tooltip._instance
    }
    Tooltip._instance = this;
  }

  initialize(){
    this.addEventListeners();
  }
  get template(){
    return  `
              <div class='tooltip'>
                ${this.text}
              </div>
            `;
  }
  render(tag = document.body){
    const element = document.createElement('div');
    element.innerHTML = this.template;
    this.element = element.firstElementChild;

    if (!tag) tag = document.body; // only for tests tooltip.render('');
    tag.append(this.element);
  }
  addEventListeners(){
    document.addEventListener('pointerout', this.onPointerOut);
    document.addEventListener('pointerover', this.onPointerOver);
  }
  removeEventListeners(){
    document.removeEventListener('pointerout', this.onPointerOut);
    document.removeEventListener('pointerover', this.onPointerOver);
  }
  remove(){
    this.element.remove();
  }
  destroy(){
    this.removeEventListeners();
    this.remove();
  }
}

export default Tooltip;
