import Component from './component';
import moment from 'moment';

const HOUR_TIME = 60;

export default class CardFilm extends Component {
  constructor(data) {
    super();
    this._title = data.title;
    this._rating = data.rating;
    this._score = data.score;
    this._date = data.date;
    this._year = moment(this._date).format(`YYYY`);
    this._durationMinutes = (data.duration.hours * HOUR_TIME) + data.duration.minutes;
    this._duration = moment().set({
      'hour': data.duration.hours,
      'minute': data.duration.minutes
    }).format(`HH:mm`);
    this._genre = data.genre;
    this._img = data.img;
    this._imgAlt = data.imgAlt;
    this._description = data.description;
    this._comments = data.comments;

    this._isWatched = false;
    this._isFavotite = false;

    this._onCommentsButtonClick = this._onCommentsButtonClick.bind(this);
    this._onWatchlistButtonClick = this._onWatchlistButtonClick.bind(this);
    this._onWatchedButtonClick = this._onWatchedButtonClick.bind(this);
  }

  set onAddToWatchList(fn) {
    this._onAddToWatchList = fn;
  }

  set onMarkAsWatched(fn) {
    this._onMarkAsWatched = fn;
  }

  set onClick(fn) {
    this._onClick = fn;
  }

  _onWatchlistButtonClick(evt) {
    evt.preventDefault();

    if (typeof this._onAddToWatchList === `function`) {
      this._onAddToWatchList();
    }
  }

  _onWatchedButtonClick(evt) {
    evt.preventDefault();

    if (typeof this._onMarkAsWatched === `function`) {
      this._onMarkAsWatched();
    }
  }

  _onCommentsButtonClick(evt) {
    evt.preventDefault();

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
        <button class="film-card__comments">${this._comments.length} comments</button>

        <form class="film-card__controls">
          <button class="film-card__controls-item button film-card__controls-item--add-to-watchlist ${this._isFavotite && `film-card__controls-item--active`}">WL</button>
          <button class="film-card__controls-item button film-card__controls-item--mark-as-watched ${this._isWatched && `film-card__controls-item--active`}">WTCHD</button>
          <button class="film-card__controls-item button film-card__controls-item--favorite">FAV</button>
        </form>
      </article>
    `;
  }

  cache() {
    this._btnComments = this._element.querySelector(`.film-card__comments`);
    this._btnWatchlist = this._element.querySelector(`.film-card__controls-item--add-to-watchlist`);
    this._btnWatched = this._element.querySelector(`.film-card__controls-item--mark-as-watched`);
  }

  uncache() {
    this._btnComments = null;
    this._btnWatchlist = null;
    this._btnWatched = null;
  }

  bind() {
    this._btnComments.addEventListener(`click`, this._onCommentsButtonClick);
    this._btnWatchlist.addEventListener(`click`, this._onWatchlistButtonClick);
    this._btnWatched.addEventListener(`click`, this._onWatchedButtonClick);
  }

  unbind() {
    this._btnComments.removeEventListener(`click`, this._onCommentsButtonClick);
    this._btnWatchlist.removeEventListener(`click`, this._onWatchlistButtonClick);
    this._btnWatched.removeEventListener(`click`, this._onWatchedButtonClick);
  }

  update(data) {
    this._comment = data.comment;
    this._commentEmoji = data.commentEmoji;
    this._isFavorite = data.isFavorite;
    this._isWatched = data.isWatched;
    this._isWatchlist = data.isWatchlist;

    this._score = data.score;
  }

  _partialUpdate() {
    const parentElement = this._element.parentNode;
    const oldElement = this._element;
    parentElement.replaceChild(this.render(), oldElement);
  }
}
