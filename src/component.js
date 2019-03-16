import {createElement} from './util';

export default class Component {
  constructor() {
    if (new.target === Component) {
      throw new Error(`Can't instantiate BaseComponent, only concrete one.`);
    }

    this._element = null;
  }

  get element() {
    return this._element;
  }

  get template() {
    throw new Error(`You have to define template.`);
  }

  cache() {}
  uncache() {}

  render() {
    this._element = createElement(this.template);
    this.cache();
    this.bind();
    return this._element;
  }

  unrender() {
    this.unbind();
    this.uncache();
    this._element = null;
  }

  bind() {}

  unbind() {}

  update() {}
}
