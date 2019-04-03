import Component from './component';
import moment from 'moment';

const KEY_CODE_ENTER = 13;
const KEY_CODE_ESC = 27;

const Emotion = {
  'grinning': `😀`,
  'sleeping': `😴`,
  'neutral-face': `😐`
};

const WatchedStatus = {
  WATCHLIST: `will watch`,
  WATCHED: `already watched`
};

export default class CardFilmDetails extends Component {
  constructor(data) {
    super();
    this.id = data.id;
    this.comments = data.comments;
    this.actors = data.actors;
    this.personalRating = data.personalRating;
    this.watchingDate = data.watchingDate;
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

    this._onRatingButtonClick = this._onRatingButtonClick.bind(this);
    this._onCloseButtonClick = this._onCloseButtonClick.bind(this);
    this._onCardDetailsKeyDown = this._onCardDetailsKeyDown.bind(this);
    this._onCommentInputKeyDown = this._onCommentInputKeyDown.bind(this);
    this._onFlagButtonClick = this._onFlagButtonClick.bind(this);
    this._onUndoButtonClick = this._onUndoButtonClick.bind(this);
  }

  set onClose(fn) {
    this._onClose = fn;
  }

  set onAddComment(fn) {
    this._onAddComment = fn;
  }

  set onAddRating(fn) {
    this._onAddRating = fn;
  }

  set onChangeFlag(fn) {
    this._onChangeFlag = fn;
  }

  set onDeleteLastComment(fn) {
    this._onDeleteLastComment = fn;
  }

  get template() {
    let watchedStatusString = ``;

    if (this.isWatched) {
      watchedStatusString = WatchedStatus.WATCHED;
    } else if (this.isWatchlist) {
      watchedStatusString = WatchedStatus.WATCHLIST;
    }

    return `
      <section class="film-details">
        <form class="film-details__inner" action="" method="get">
          <div class="film-details__close">
            <button class="film-details__close-btn" type="button">close</button>
          </div>
          <div class="film-details__info-wrap">
            <div class="film-details__poster">
              <img class="film-details__poster-img" src="${this.poster}" alt="">

              <p class="film-details__age">${this.ageRating}+</p>
            </div>

            <div class="film-details__info">
              <div class="film-details__info-head">
                <div class="film-details__title-wrap">
                  <h3 class="film-details__title">${this.title}</h3>
                  <p class="film-details__title-original">${this.altTitle}</p>
                </div>

                <div class="film-details__rating">
                  <p class="film-details__total-rating">${this.totalRating}</p>
                  <p class="film-details__user-rating">Your rate ${this.personalRating}</p>
                </div>
              </div>

              <table class="film-details__table">
                <tr class="film-details__row">
                  <td class="film-details__term">Director</td>
                  <td class="film-details__cell">${this.director}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Writers</td>
                  <td class="film-details__cell">${Array.from(this.writers).map((it) => it).join(`, `)}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Actors</td>
                  <td class="film-details__cell">${this.actors.map((it) => it).join(`, `)}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Release Date</td>
                  <td class="film-details__cell">${moment(this.date).format(`D MMMM YYYY`)}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Runtime</td>
                  <td class="film-details__cell">${this.runtime} min</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Country</td>
                  <td class="film-details__cell">${this.country}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Genres</td>
                  <td class="film-details__cell">
                    ${Array.from(this.genre).map((it) => `<span class="film-details__genre">${it}</span>`).join(`, `)}
                </tr>
              </table>

              <p class="film-details__film-description">${this.description}</p>
            </div>
          </div>

          <section class="film-details__controls">
            <input type="checkbox" class="film-details__control-input visually-hidden" id="watchlist" name="watchlist" ${this.isWatchlist ? `checked` : ``}>
            <label for="watchlist" class="film-details__control-label film-details__control-label--watchlist">Add to watchlist</label>

            <input type="checkbox" class="film-details__control-input visually-hidden" id="watched" name="watched" ${this.isWatched ? `checked` : ``}>
            <label for="watched" class="film-details__control-label film-details__control-label--watched">Already watched</label>

            <input type="checkbox" class="film-details__control-input visually-hidden" id="favorite" name="favorite" ${this.isFavorite ? `checked` : ``}>
            <label for="favorite" class="film-details__control-label film-details__control-label--favorite">Add to favorites</label>
          </section>

          <section class="film-details__comments-wrap">
            <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${this.comments.length}</span></h3>

            <ul class="film-details__comments-list">
  ${this.comments.map((it) =>
    `<li class="film-details__comment">
      <span class="film-details__comment-emoji">${Emotion[it.emotion]}</span>
      <div>
        <p class="film-details__comment-text">${it.comment}</p>
        <p class="film-details__comment-info">
          <span class="film-details__comment-author">${it.author}</span>
          <span class="film-details__comment-day">${moment(it.date).fromNow(true)} ago</span>
        </p>
      </div>
    </li>`
  ).join(``)}
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
              <span class="film-details__watched-status ${watchedStatusString !== `` ? `film-details__watched-status--active` : ``}">
                ${watchedStatusString}
              </span>
              <button class="film-details__watched-reset" type="button">undo</button>
            </div>

            <div class="film-details__user-score">
              <div class="film-details__user-rating-poster">
                <img src="${this.poster}" alt="" class="film-details__user-rating-img">
              </div>

              <section class="film-details__user-rating-inner">
                <h3 class="film-details__user-rating-title">${this.title}</h3>

                <p class="film-details__user-rating-feelings">How you feel it?</p>

                <div class="film-details__user-rating-score">${
  Array(10).fill(null).map((it, idx) =>
    `<input
      type="radio"
      name="score"
      class="film-details__user-rating-input visually-hidden"
      value="${idx + 1}"
      id="rating-${idx + 1}">
    <label class="film-details__user-rating-label" for="rating-${idx + 1}">${idx + 1}</label>`
  ).join(``)}
                </div>
              </section>
            </div>
          </section>
        </form>
      </section>`;
  }

  commentUpdate() {
    this._commentsList.innerHTML = this.comments.map((it) =>
      `<li class="film-details__comment">
        <span class="film-details__comment-emoji">${Emotion[it.emotion]}</span>
        <div>
          <p class="film-details__comment-text">${it.comment}</p>
          <p class="film-details__comment-info">
            <span class="film-details__comment-author">${it.author}</span>
            <span class="film-details__comment-day">${moment(it.date).fromNow(true)}</span>
          </p>
        </div>
      </li>`
    ).join(``);
  }

  inputCommentClear() {
    this._inputComment.value = ``;
  }

  disabledInputComment() {
    this._inputComment.classList.remove(`shake`);
    this._inputComment.disabled = true;
  }

  includedInputComment() {
    this._inputComment.disabled = false;
  }

  commentSubmitError() {
    this._inputComment.classList.add(`shake`);
  }

  disabledRatingList() {
    this._ratingList.classList.remove(`shake`);
    this._ratingList.classList.remove(`film-details__user-rating-score--error`);
    Array.from(this._ratingButtons).forEach((it) => {
      it.disabled = true;
    });
  }

  includedRatingList() {
    Array.from(this._ratingButtons).forEach((it) => {
      it.disabled = false;
    });
  }

  ratingUpdate() {
    this._userRating.innerHTML = `Your rate ${this.personalRating}`;
  }

  ratingSubmitError() {
    this._ratingList.classList.add(`shake`);
    this._ratingList.classList.add(`film-details__user-rating-score--error`);
  }

  _onUndoButtonClick() {
    if (typeof this._onDeleteLastComment === `function`) {
      this._onDeleteLastComment();
    }
  }

  _onFlagButtonClick() {
    const formData = new FormData(this._filmForm);
    const newData = CardFilmDetails._processForm(formData);

    if (typeof this._onChangeFlag === `function`) {
      this._onChangeFlag(newData);
    }
  }

  _onRatingButtonClick() {
    const formData = new FormData(this._filmForm);
    const newData = CardFilmDetails._processForm(formData);

    if (typeof this._onAddRating === `function`) {
      this._onAddRating(newData);
    }
  }

  _onCloseButtonClick() {
    if (typeof this._onClose === `function`) {
      this._onClose();
    }
  }

  _onCardDetailsKeyDown(evt) {
    if (typeof this._onClose === `function` && evt.keyCode === KEY_CODE_ESC) {
      this._onClose();
    }
  }

  _onCommentInputKeyDown(evt) {
    const formData = new FormData(this._filmForm);
    const newData = CardFilmDetails._processForm(formData);

    if (typeof this._onAddComment === `function`) {
      if ((evt.ctrlKey && evt.keyCode === KEY_CODE_ENTER) && !this._inputComment.disabled) {
        this._onAddComment(newData);
      }
    }
  }

  cache() {
    this._filmForm = this._element.querySelector(`.film-details__inner`);
    this._btnClose = this._element.querySelector(`.film-details__close-btn`);
    this._inputComment = this._element.querySelector(`.film-details__comment-input`);
    this._commentsList = this._element.querySelector(`.film-details__comments-list`);
    this._ratingList = this._element.querySelector(`.film-details__user-rating-score`);
    this._ratingButtons = this._element.querySelectorAll(`.film-details__user-rating-input`);
    this._userRating = this._element.querySelector(`.film-details__user-rating`);
    this._flagsWrapper = this._element.querySelector(`.film-details__controls`);
    this._btnUndo = this._element.querySelector(`.film-details__watched-reset`);
  }

  uncache() {
    this._filmForm = null;
    this._btnClose = null;
    this._inputComment = null;
    this._commentsList = null;
    this._ratingList = null;
    this._ratingButtons = null;
    this._userRating = null;
    this._flagsWrapper = null;
    this._btnUndo = null;
  }

  bind() {
    document.addEventListener(`keydown`, this._onCardDetailsKeyDown);
    this._ratingList.addEventListener(`change`, this._onRatingButtonClick);
    this._btnClose.addEventListener(`click`, this._onCloseButtonClick);
    this._inputComment.addEventListener(`keydown`, this._onCommentInputKeyDown);
    this._flagsWrapper.addEventListener(`change`, this._onFlagButtonClick);
    this._btnUndo.addEventListener(`click`, this._onUndoButtonClick);
  }

  unbind() {
    document.removeEventListener(`keydown`, this._onCardDetailsKeyDown);
    this._ratingList.removeEventListener(`change`, this._onRatingButtonClick);
    this._btnClose.removeEventListener(`click`, this._onCloseButtonClick);
    this._inputComment.removeEventListener(`keydown`, this._onCommentInputKeyDown);
    this._flagsWrapper.removeEventListener(`change`, this._onFlagButtonClick);
    this._btnUndo.removeEventListener(`click`, this._onUndoButtonClick);
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

  static _processForm(formData) {
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
