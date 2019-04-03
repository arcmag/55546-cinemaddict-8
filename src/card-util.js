import {
  searchString,
  updateFilters,
  FilterTitle,
  countVisibleFilms,
  visibleButtonShowMore
} from './filter-util';
import {createChart} from './chart-util';
import CardFilm from './card-film';
import CardFilmDetails from './card-film-details';
import ModelFilm from './model-film';
import BackendAPI from './backend-api';
import Store from './store';
import Provider from './provider';

const HIDDEN_CLASS = `visually-hidden`;

const AUTHORIZATION_NUMBER = 7351233122318;
const AUTHORIZATION = `Basic dXNlckBwYXNzd29yZAo=${AUTHORIZATION_NUMBER}`;
const END_POINT = `https://es8-demo-srv.appspot.com/moowle`;
const FILMS_STORE_KEY = `films-store-key`;

const COMMENTS_AUTHOR_NAME = `user`;

const LOAD_FILMS_MESSAGE_ERROR = `Something went wrong while loading movies. Check your
  connection or try again later`;

const ProfileRating = {
  NOVICE: `novice`,
  FAN: `fan`,
  MOVIE_BUFF: `movie buff`
};

const CountFilmRating = {
  NOVICE: {min: 1, max: 10},
  FAN: {min: 11, max: 20}
};

const api = new BackendAPI({endPoint: END_POINT, authorization: AUTHORIZATION});
const store = new Store({key: FILMS_STORE_KEY, storage: localStorage});
const provider = new Provider({api, store, generateId: () => String(Date.now())});

const mainBlock = document.querySelector(`.films-list__container`);
const topBlock = document.querySelector(`.films-list__container--top`);
const mostBlock = document.querySelector(`.films-list__container--commented`);

const boardNoFilms = document.querySelector(`.board__no-films`);

const footerStatistics = document.querySelector(`.footer__statistics`);
const profileRatingElement = document.querySelector(`.profile__rating`);

let cardFilms = [];

let openedCardDetails = null;

const getCardFilms = () => cardFilms;

const updateProfileRating = () => {
  const wathedFilmsCount = getWathedFilms().length;
  let ratingString = ``;

  if (wathedFilmsCount >= CountFilmRating.NOVICE.min && wathedFilmsCount <= CountFilmRating.NOVICE.max) {
    ratingString = ProfileRating.NOVICE;
  } else if (wathedFilmsCount >= CountFilmRating.FAN.min && wathedFilmsCount <= CountFilmRating.FAN.max) {
    ratingString = ProfileRating.FAN;
  } else if (wathedFilmsCount > CountFilmRating.FAN.max) {
    ratingString = ProfileRating.MOVIE_BUFF;
  }

  profileRatingElement.innerHTML = ratingString;
};

const openCardDetails = (cardDetails) => {
  if (openedCardDetails === cardDetails) {
    return;
  }

  if (openedCardDetails) {
    openedCardDetails._onClose();
  }

  openedCardDetails = cardDetails;
  document.body.appendChild(openedCardDetails.render());
};

const createGenresList = (films) => {
  const genres = new Set([]);

  films.forEach((film) => {
    film.genre.forEach((genre) => {
      genres.add(genre);
    });
  });

  return genres;
};

const createComment = (data) => {
  return {
    isUser: true,
    author: COMMENTS_AUTHOR_NAME,
    date: Date.now(),
    comment: data.comment,
    emotion: data.commentEmoji
  };
};

const createCard = (data) => {
  const card = new CardFilm(data);
  const cardDetails = new CardFilmDetails(data);

  card.onClick = () => {
    cardDetails.update({
      isWatchlist: card.isWatchlist,
      isFavorite: card.isFavorite,
      isWatched: card.isWatched
    });

    openCardDetails(cardDetails);
  };

  card.onFavoriteButtonClick = () => {
    card.isFavorite = !card.isFavorite;

    provider.updateFilm({id: card.id, data: ModelFilm.staticToRAW(card)})
      .then(() => {
        card.unbind();
        card.uncache();
        card._partialUpdate();

        updateFilters();
      })
      .catch(() => {
        card.isFavorite = !card.isFavorite;
      });
  };

  card.onAddToWatchList = () => {
    card.isWatchlist = !card.isWatchlist;

    provider.updateFilm({id: card.id, data: ModelFilm.staticToRAW(card)})
      .then(() => {
        card.unbind();
        card.uncache();
        card._partialUpdate();

        updateFilters();
      })
      .catch(() => {
        card.isWatchlist = !card.isWatchlist;
      });
  };

  card.onMarkAsWatched = () => {
    card.isWatched = !card.isWatched;

    provider.updateFilm({id: card.id, data: ModelFilm.staticToRAW(card)})
      .then(() => {
        card.unbind();
        card.uncache();
        card._partialUpdate();

        updateProfileRating();
        updateFilters();
      })
      .catch(() => {
        card.isWatched = !card.isWatched;
      });
  };

  cardDetails.onDeleteLastComment = () => {
    const otherComments = card.comments.filter((it) => !it.isUser);
    const userComments = card.comments.filter((it) => it.isUser);

    if (userComments.length === 0) {
      return;
    }

    userComments.splice(userComments.length - 1, 1);

    card.comments = otherComments.concat(userComments);
    cardDetails.comments = card.comments;

    provider.updateFilm({id: card.id, data: ModelFilm.staticToRAW(card)})
      .then(() => {
        cardDetails.commentUpdate();
        renderCardsByCategory(cardFilms);
        updateFilters();
      });
  };

  cardDetails.onAddComment = (newData) => {
    card.comments.push(createComment({
      comment: newData.comment,
      commentEmoji: newData.commentEmoji
    }));

    card.update(newData);
    cardDetails.update(newData);
    cardDetails.disabledInputComment();

    provider.updateFilm({id: card.id, data: ModelFilm.staticToRAW(card)})
      .then(() => {
        cardDetails.includedInputComment();

        cardDetails.commentUpdate();
        cardDetails.inputCommentClear();

        renderCardsByCategory(cardFilms);
        updateFilters();
      })
      .catch(() => {
        cardDetails.includedInputComment();
        cardDetails.commentSubmitError();
      });
  };

  cardDetails.onAddRating = (newData) => {
    card.update(newData);
    cardDetails.update(newData);
    cardDetails.disabledRatingList();

    provider.updateFilm({id: card.id, data: ModelFilm.staticToRAW(card)})
      .then(() => {
        cardDetails.includedRatingList();
        cardDetails.ratingUpdate();
      })
      .catch(() => {
        cardDetails.includedRatingList();
        cardDetails.ratingSubmitError();
      });
  };

  cardDetails.onChangeFlag = (newData) => {
    card.update(newData);
    cardDetails.update(newData);

    provider.updateFilm({id: card.id, data: ModelFilm.staticToRAW(card)})
      .then(() => {
        card.unbind();
        card.uncache();
        card._partialUpdate();

        updateFilters();
      });
  };

  cardDetails.onClose = () => {
    cardDetails.element.remove();
    cardDetails.unrender();
    openedCardDetails = null;

    updateFilters();
  };

  return card;
};

const renderCard = (container, card) => {
  container.appendChild(card.render());
};

const createCardList = (dataCardsList) => dataCardsList.map((it) => createCard(it));

const renderCardList = (container, cardsList, maxCountCard) => {
  let len = maxCountCard || cardsList.length;

  if (len > cardsList.length) {
    len = cardsList.length;
  }

  cardsList.slice(0, len).forEach((it) => {
    renderCard(container, it);
  });
};

const getCardsByCategory = (cardsList, category) => {
  let cards = [];


  switch (category.toLowerCase()) {
    case FilterTitle.ALL.toLowerCase():
      cards = cardsList;
      break;
    case FilterTitle.WATCHLIST.toLowerCase():
      cards = cardsList.filter((it) => it.isWatchlist && (!it.isTopRating && !it.isTopComments));
      break;
    case FilterTitle.HISTORY.toLowerCase():
      cards = cardsList.filter((it) => it.isWatched && (!it.isTopRating && !it.isTopComments));
      break;
    case FilterTitle.FAVORITES.toLowerCase():
      cards = cardsList.filter((it) => it.isFavorite && (!it.isTopRating && !it.isTopComments));
      break;
  }

  return cards;
};

const setPersonalStatusTopCards = (cards, status) => {
  cardFilms.forEach((it) => {
    it.isTopRating = status;
    it.isTopComments = status;
  });
};

const setStatusVisibleCards = (cards, status) => {
  cards.forEach((it) => {
    it.isVisible = status;
  });
};

const getWathedFilms = () => cardFilms.filter((it) => it.isWatched && (!it.isTopRating && !it.isTopComments));

const getTotalDurationFilms = (films) => films.reduce((total, film) => total + film.runtime, 0);

const getFilmsTopRatins = (films) => films
  .slice()
  .sort((prevFilm, nextFilm) =>
    nextFilm.totalRating - prevFilm.totalRating
  )
  .splice(0, 2)
  .map((it) => {
    it.isTopRating = true;
    return it;
  });

const getFilmsTopComments = (films) => films
  .slice()
  .sort((prevFilm, nextFilm) =>
    nextFilm.comments.length - prevFilm.comments.length
  )
  .splice(0, 2)
  .map((it) => {
    it.isTopComments = true;
    return it;
  });

const renderCardsByCategory = (films) => {
  setPersonalStatusTopCards(films, false);

  topBlock.innerHTML = ``;
  const topRatingFilms = getFilmsTopRatins(cardFilms);
  renderCardList(topBlock, topRatingFilms);

  mostBlock.innerHTML = ``;
  const topCommentsFilms = getFilmsTopComments(cardFilms);
  renderCardList(mostBlock, topCommentsFilms);

  mainBlock.innerHTML = ``;
  renderCardList(
      mainBlock,
      films.filter((it) =>
        it.isVisible
        && (!it.isTopRating && !it.isTopComments)
        && it.title.toLowerCase().indexOf(searchString.toLowerCase()) !== -1
      ),
      countVisibleFilms
  );
};

provider.getFilms()
  .then((films) => {
    boardNoFilms.classList.add(HIDDEN_CLASS);
    cardFilms = createCardList(films);
    footerStatistics.innerHTML = cardFilms.length;

    updateProfileRating();
    renderCardsByCategory(cardFilms);
    createChart();
    updateFilters();
    visibleButtonShowMore();
  })
  .catch(() => {
    boardNoFilms.innerHTML = LOAD_FILMS_MESSAGE_ERROR;
  });

window.addEventListener(`offline`, () => {
  document.title = `${document.title}[OFFLINE]`;
});

window.addEventListener(`online`, () => {
  provider.syncFilms();
  document.title = document.title.split(`[OFFLINE]`)[0];
});

export {
  getCardFilms,
  setStatusVisibleCards,
  renderCardsByCategory,
  createGenresList,
  getWathedFilms,
  getTotalDurationFilms,
  getCardsByCategory
};
