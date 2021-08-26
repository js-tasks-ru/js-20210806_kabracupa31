export default class NotificationMessage {
  constructor(simpleText = '', {duration = 1000, type = 'success'} = {}) {
    this.simpleText = simpleText;
    this.duration = duration;
    this.type = type;
    this.render();
  }
  static displayedNotification = null;

  get template() {
    return `
            <div class="notification ${this.type}" style="--value:${Math.round(this.duration / 1000)}s">
              <div class="timer"></div>
              <div class="inner-wrapper">
                <div class="notification-header">${this.type}</div>
                <div class="notification-body">
                  ${this.simpleText}
                </div>
              </div>
            </div>
          `;
  }
  render() {
    const element = document.createElement('div');
    element.innerHTML = this.template;
    this.element = element.firstElementChild;
  }
  show(tag = document.body) {
    if (NotificationMessage.displayedNotification) {
      NotificationMessage.displayedNotification.remove();//destroy();
    }
    this.timeOut = setTimeout(() => this.remove(), this.duration);
    tag.append(this.element);
    NotificationMessage.displayedNotification = this;
  }
  remove () {
    clearTimeout(this.timeOut);
    this.element.remove();
    NotificationMessage.displayedNotification = null;
  }
  destroy() {
    clearTimeout(this.timeOut);
    this.remove();
    NotificationMessage.displayedNotification = null;
  }
}
