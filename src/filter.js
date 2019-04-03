import Component from './component';

export default class Filter extends Component {
  constructor(data) {
    super();
    this._title = data.title;
    this._link = data.link || `#`;

    this._count = typeof data.count === `number` ? data.count : -1;

    this._isActive = data.isActive;
    this._isStats = data.isStats;

    this._onFilterClick = this._onFilterClick.bind(this);

    this._onFilter = null;
  }

  set onFilter(fn) {
    this._onFilter = fn;
  }

  get template() {
    return `
      <a href="${this._link}"
          class="main-navigation__item
            ${this._isActive && `main-navigation__item--active`}
            ${this._isStats && `main-navigation__item--additional`}">
        ${this._title} ${this._count >= 0 ? `<span class="main-navigation__item-count">${this._count}</span>` : ``}
      </a>`;
  }

  _onFilterClick(evt) {
    evt.preventDefault();

    if (typeof this._onFilter === `function`) {
      this._onFilter();
    }
  }

  _partialUpdate() {
    const parentElement = this._element.parentNode;
    const oldElement = this._element;
    this.unrender();
    parentElement.replaceChild(this.render(), oldElement);
  }

  bind() {
    this.element.addEventListener(`click`, this._onFilterClick);
  }

  unbind() {
    this.element.removeEventListener(`click`, this._onFilterClick);
  }

  update(count) {
    this._count = count;
  }
}
