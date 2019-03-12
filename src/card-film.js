import {Component} from './component';

class CardFilm extends Component {
  constructor(data) {
    super();
    this._title = data.title;
    this._rating = data.rating;
    this._year = data.year;
    this._duration = data.duration;
    this._genre = data.genre;
    this._img = data.img;
    this._imgAlt = data.imgAlt;
    this._description = data.description;
    this._commentsCount = data.commentsCount;

    this._onCommentsButtonClick = this._onCommentsButtonClick.bind(this);
  }

  set onClick(fn) {
    this._onClick = fn;
  }

  _onCommentsButtonClick() {
    if (typeof this._onClick === `function`) {
      this._onClick();
    }
  }

  get template() {
    return `
      <article class="film-card">
        <h3 class="film-card__title">${this._title}</h3>
        <p class="film-card__rating">${this._rating}</p>
        <p class="film-card__info">
          <span class="film-card__year">${this._year}</span>
          <span class="film-card__duration">${this._duration}</span>
          <span class="film-card__genre">${this._genre}</span>
        </p>
        <img src="${this._img}" alt="${this._imgAlt}" class="film-card__poster">
        <p class="film-card__description">${this._description}</p>
        <button class="film-card__comments">${this._commentsCount} comments</button>

        <form class="film-card__controls">
          <button class="film-card__controls-item button film-card__controls-item--add-to-watchlist">WL</button>
          <button class="film-card__controls-item button film-card__controls-item--mark-as-watched">WTCHD</button>
          <button class="film-card__controls-item button film-card__controls-item--favorite">FAV</button>
        </form>
      </article>
    `;
  }

  cache() {
    this._btnComments = this._element.querySelector(`.film-card__comments`);
  }

  uncache() {
    this._btnComments = null;
  }

  bind() {
    this._btnComments.addEventListener(`click`, this._onCommentsButtonClick);
  }

  unbind() {
    this._btnComments.removeEventListener(`click`, this._onCommentsButtonClick);
  }
}

export {CardFilm};
