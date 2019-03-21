import Component from './component';
import moment from 'moment';

const HOUR_TIME = 60;

export default class CardFilmDetails extends Component {
  constructor(data) {
    super();
    this._title = data.title;
    this._rating = data.rating;
    this._score = data.score;
    this._duration = (data.duration.hours * HOUR_TIME) + data.duration.minutes;
    this._genre = data.genre;
    this._date = data.date;
    this._img = data.img;
    this._imgAlt = data.imgAlt;
    this._description = data.description;
    this._comments = data.comments;

    this._isWatched = false;
    this._isFavotite = false;

    this._onCloseButtonClick = this._onCloseButtonClick.bind(this);
  }

  _processForm(formData) {
    const entry = {
      isWatchlist: false,
      isWatched: false,
      isFavorite: false,
      commentEmoji: ``,
      comment: ``,
      score: 0
    };

    const filmDetailsMapper = CardFilmDetails.createMapper(entry);

    for (const pair of formData.entries()) {
      const [property, value] = pair;

      if (filmDetailsMapper[property]) {
        filmDetailsMapper[property](value);
      }
    }

    return entry;
  }

  set onClose(fn) {
    this._onClose = fn;
  }

  _onCloseButtonClick() {
    const formData = new FormData(this._element.querySelector(`.film-details__inner`));
    const newData = this._processForm(formData);

    if (typeof this._onClose === `function`) {
      this._onClose(newData);
    }
  }

  get template() {
    const ratingCount = 10;
    let ratingsString = ``;

    const commentsString = this._comments.map((it) => {
      return `
        <li class="film-details__comment">
          <span class="film-details__comment-emoji">😴</span>
          <div>
            <p class="film-details__comment-text">${it.text}</p>
            <p class="film-details__comment-info">
              <span class="film-details__comment-author">${it.author}</span>
              <span class="film-details__comment-day">${moment(it.date).fromNow(true)}</span>
            </p>
          </div>
        </li>`;
    }).join(``);

    for (let i = 1; i <= ratingCount; i++) {
      ratingsString += `
        <input
          type="radio"
          name="score"
          class="film-details__user-rating-input visually-hidden"
          value="${i}"
          id="rating-${i}">
        <label class="film-details__user-rating-label" for="rating-${i}">${i}</label>`;
    }

    return `
      <section class="film-details">
        <form class="film-details__inner" action="" method="get">
          <div class="film-details__close">
            <button class="film-details__close-btn" type="button">close</button>
          </div>
          <div class="film-details__info-wrap">
            <div class="film-details__poster">
              <img class="film-details__poster-img" src="${this._img}" alt="${this._imgAlt}">

              <p class="film-details__age">18+</p>
            </div>

            <div class="film-details__info">
              <div class="film-details__info-head">
                <div class="film-details__title-wrap">
                  <h3 class="film-details__title">${this._title}</h3>
                  <p class="film-details__title-original">Original: Невероятная семейка</p>
                </div>

                <div class="film-details__rating">
                  <p class="film-details__total-rating">${this._rating}</p>
                  <p class="film-details__user-rating">Your rate ${this._score}</p>
                </div>
              </div>

              <table class="film-details__table">
                <tr class="film-details__row">
                  <td class="film-details__term">Director</td>
                  <td class="film-details__cell">Brad Bird</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Writers</td>
                  <td class="film-details__cell">Brad Bird</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Actors</td>
                  <td class="film-details__cell">Samuel L. Jackson, Catherine Keener, Sophia Bush</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Release Date</td>
                  <td class="film-details__cell">${moment(this._date).format(`D MMMM YYYY`)}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Runtime</td>
                  <td class="film-details__cell">${this._duration} min</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Country</td>
                  <td class="film-details__cell">USA</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Genres</td>
                  <td class="film-details__cell">
                    ${this._genre.map((it) => `<span class="film-details__genre">${it}</span>`).join(``)}
                </tr>
              </table>

              <p class="film-details__film-description">${this._description}</p>
            </div>
          </div>

          <section class="film-details__controls">
            <input type="checkbox" class="film-details__control-input visually-hidden" id="watchlist" name="watchlist" ${this._isWatchlist && `checked`}>
            <label for="watchlist" class="film-details__control-label film-details__control-label--watchlist">Add to watchlist</label>

            <input type="checkbox" class="film-details__control-input visually-hidden" id="watched" name="watched" ${this._isWatched && `checked`}>
            <label for="watched" class="film-details__control-label film-details__control-label--watched">Already watched</label>

            <input type="checkbox" class="film-details__control-input visually-hidden" id="favorite" name="favorite" ${this._isFavorite && `checked`}>
            <label for="favorite" class="film-details__control-label film-details__control-label--favorite">Add to favorites</label>
          </section>

          <section class="film-details__comments-wrap">
            <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${this._comments.length}</span></h3>

            <ul class="film-details__comments-list">
              ${commentsString}
            </ul>

            <div class="film-details__new-comment">
              <div>
                <label for="add-emoji" class="film-details__add-emoji-label">😐</label>
                <input type="checkbox" class="film-details__add-emoji visually-hidden" id="add-emoji">

                <div class="film-details__emoji-list">
                  <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-sleeping" value="sleeping">
                  <label class="film-details__emoji-label" for="emoji-sleeping">😴</label>

                  <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-neutral-face" value="neutral-face" checked>
                  <label class="film-details__emoji-label" for="emoji-neutral-face">😐</label>

                  <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-grinning" value="grinning">
                  <label class="film-details__emoji-label" for="emoji-grinning">😀</label>
                </div>
              </div>
              <label class="film-details__comment-label">
                <textarea class="film-details__comment-input" placeholder="← Select reaction, add comment here" name="comment"></textarea>
              </label>
            </div>
          </section>

          <section class="film-details__user-rating-wrap">
            <div class="film-details__user-rating-controls">
              <span class="film-details__watched-status film-details__watched-status--active">Already watched</span>
              <button class="film-details__watched-reset" type="button">undo</button>
            </div>

            <div class="film-details__user-score">
              <div class="film-details__user-rating-poster">
                <img src="${this._img}" alt="${this._imgAlt}" class="film-details__user-rating-img">
              </div>

              <section class="film-details__user-rating-inner">
                <h3 class="film-details__user-rating-title">${this._title}</h3>

                <p class="film-details__user-rating-feelings">How you feel it?</p>

                <div class="film-details__user-rating-score">${ratingsString}</div>
              </section>
            </div>
          </section>
        </form>
      </section>`;
  }

  cache() {
    this._btnClose = this._element.querySelector(`.film-details__close-btn`);
  }

  uncache() {
    this._btnClose = null;
  }

  bind() {
    this._btnClose.addEventListener(`click`, this._onCloseButtonClick);
  }

  unbind() {
    this._btnClose.removeEventListener(`click`, this._onCloseButtonClick);
  }

  update(data) {
    this._comment = data.comment;
    this._commentEmoji = data.commentEmoji;
    this._isFavorite = data.isFavorite;
    this._isWatched = data.isWatched;
    this._isWatchlist = data.isWatchlist;
    this._score = data.score;
  }

  static createMapper(target) {
    return {
      'watchlist': (value) => (target.isWatchlist = value === `on`),
      'watched': (value) => (target.isWatched = value === `on`),
      'favorite': (value) => (target.isFavorite = value === `on`),
      'comment-emoji': (value) => (target.commentEmoji = value),
      'comment': (value) => (target.comment = value),
      'score': (value) => (target.score = value)
    };
  }
}
