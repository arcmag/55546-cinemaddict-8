import Component from './component';
import moment from 'moment';

const HOUR_TIME = 60;

export default class CardFilm extends Component {
  constructor(data) {
    super();
    this.id = data.id;
    this.comments = data.comments;
    this.actors = data.actors;
    this.personalRating = data.personalRating;
    this.ageRating = data.ageRating;
    this.altTitle = data.altTitle;
    this.description = data.description;
    this.director = data.director;
    this.genre = data.genre;
    this.poster = data.poster;
    this.date = data.date;
    this.country = data.country;
    this.runtime = data.runtime;
    this.totalRating = data.totalRating;
    this.title = data.title;
    this.writers = data.writers;

    this.isWatchlist = data.isWatchlist;
    this.isWatched = data.isWatched;
    this.isFavorite = data.isFavorite;

    this.isVisible = true;
    this.isTopRating = false;
    this.isTopComments = false;

    this._onCommentsButtonClick = this._onCommentsButtonClick.bind(this);
    this._onFavoriteButtonClick = this._onFavoriteButtonClick.bind(this);
    this._onWatchlistButtonClick = this._onWatchlistButtonClick.bind(this);
    this._onWatchedButtonClick = this._onWatchedButtonClick.bind(this);
  }

  set onFavoriteButtonClick(fn) {
    this._onAddToFavorite = fn;
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

  _onFavoriteButtonClick(evt) {
    evt.preventDefault();

    if (typeof this._onAddToFavorite === `function`) {
      this._onAddToFavorite();
    }
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
        <h3 class="film-card__title">${this.title}</h3>
        <p class="film-card__rating">${this.totalRating}</p>
        <p class="film-card__info">
          <span class="film-card__year">${moment(this.date).format(`YYYY`)}</span>
          <span class="film-card__duration">
  ${moment().set({
    'hour': parseInt(this.runtime / HOUR_TIME, 10),
    'minute': this.runtime % HOUR_TIME,
  }).format(`HH:mm`)}
          </span>
          <span class="film-card__genre">
            ${Array.from(this.genre).map((it) => it).join(`, `)}
          </span>
        </p>
        <img src="${this.poster}" alt="" class="film-card__poster">
        <p class="film-card__description">${this.description.length <= 140 ? this.description : this.description.substring(0, 140) + `...`}</p>
        <button class="film-card__comments">${this.comments.length} comments</button>


        <form class="film-card__controls ${this.isTopRating || this.isTopComments ? `visually-hidden` : ``}">
          <button class="film-card__controls-item button film-card__controls-item--add-to-watchlist ${this.isWatchlist && `film-card__controls-item--active`}">WL</button>
          <button class="film-card__controls-item button film-card__controls-item--mark-as-watched ${this.isWatched && `film-card__controls-item--active`}">WTCHD</button>
          <button class="film-card__controls-item button film-card__controls-item--favorite ${this.isFavorite && `film-card__controls-item--active`}">FAV</button>
        </form>
      </article>
    `;
  }

  cache() {
    this._btnComments = this._element.querySelector(`.film-card__comments`);
    this._btnFavorite = this._element.querySelector(`.film-card__controls-item--favorite`);
    this._btnWatchlist = this._element.querySelector(`.film-card__controls-item--add-to-watchlist`);
    this._btnWatched = this._element.querySelector(`.film-card__controls-item--mark-as-watched`);
  }

  uncache() {
    this._btnComments = null;
    this._btnFavorite = null;
    this._btnWatchlist = null;
    this._btnWatched = null;
  }

  bind() {
    this._btnComments.addEventListener(`click`, this._onCommentsButtonClick);
    this._btnFavorite.addEventListener(`click`, this._onFavoriteButtonClick);
    this._btnWatchlist.addEventListener(`click`, this._onWatchlistButtonClick);
    this._btnWatched.addEventListener(`click`, this._onWatchedButtonClick);
  }

  unbind() {
    this._btnComments.removeEventListener(`click`, this._onCommentsButtonClick);
    this._btnWatchlist.removeEventListener(`click`, this._onWatchlistButtonClick);
    this._btnWatched.removeEventListener(`click`, this._onWatchedButtonClick);
  }

  update(data) {
    if (data.isFavorite !== undefined) {
      this.isFavorite = data.isFavorite;
    }

    if (data.isWatched !== undefined) {
      this.isWatched = data.isWatched;
    }

    if (data.isWatchlist !== undefined) {
      this.isWatchlist = data.isWatchlist;
    }

    if (data.personalRating !== undefined) {
      this.personalRating = data.personalRating;
    }

    if (data.score !== undefined) {
      this.personalRating = data.score;
    }
  }

  _partialUpdate() {
    const parentElement = this._element.parentNode;
    const oldElement = this._element;
    parentElement.replaceChild(this.render(), oldElement);
  }
}
