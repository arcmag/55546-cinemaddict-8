import {getRandomInt} from './util';
import {
  getRandomAutorName,
  getRandomDescription
} from './data-card';
import {updateFilters} from './filter-util';
import {createChart} from './chart-util';
import CardFilm from './card-film';
import CardFilmDetails from './film-details';
import ModelFilm from './model-film';
import BackendAPI from './backend-api';

const HOUR_TIME = 60;
const HIDDEN_CLASS = `visually-hidden`;

const AUTHORIZATION_NUMBER = 735123312231214;
const AUTHORIZATION = `Basic dXNlckBwYXNzd29yZAo=${AUTHORIZATION_NUMBER}`;
const END_POINT = `https://es8-demo-srv.appspot.com/moowle`;

const EMOTION_LIST = [`grinning`, `sleeping`, `neutral-face`];

const api = new BackendAPI({endPoint: END_POINT, authorization: AUTHORIZATION});

const mainBlock = document.querySelector(`.films-list__container`);
const topBlock = document.querySelector(`.films-list__container--top`);
const mostBlock = document.querySelector(`.films-list__container--commented`);

mainBlock.innerHTML = ``;
topBlock.innerHTML = ``;
mostBlock.innerHTML = ``;

const boardNoFilms = document.querySelector(`.board__no-films`);

let cardFilms = [];

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
    author: getRandomAutorName(),
    comment: getRandomDescription(),
    date: Date.now(),
    commentEmoji: EMOTION_LIST[getRandomInt(0, EMOTION_LIST.length)],
    ...data
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
    document.body.appendChild(cardDetails.render());
  };

  card.onFavoriteButtonClick = () => {
    card.isFavorite = !card.isFavorite;

    api.updateFilm({id: card.id, data: ModelFilm.staticToRAW(card)})
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

    api.updateFilm({id: card.id, data: ModelFilm.staticToRAW(card)})
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

    api.updateFilm({id: card.id, data: ModelFilm.staticToRAW(card)})
      .then(() => {
        card.unbind();
        card.uncache();
        card._partialUpdate();

        updateFilters();
      })
      .catch(() => {
        card.isWatched = !card.isWatched;
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

    api.updateFilm({id: card.id, data: ModelFilm.staticToRAW(card)})
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

    api.updateFilm({id: card.id, data: ModelFilm.staticToRAW(card)})
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

    api.updateFilm({id: card.id, data: ModelFilm.staticToRAW(card)})
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

    updateFilters();
  };

  return card;
};

const renderCard = (container, card) => {
  container.appendChild(card.render());
};

const createCardList = (dataCardsList) => dataCardsList.map((it) => createCard(it));

const renderCardList = (container, cardsList) => {
  cardsList.forEach((it) => {
    renderCard(container, it);
  });
};

const getCardsByCategory = (cardsList, category) => {
  let cards = [];

  switch (category.toLowerCase()) {
    case `all movies`:
      cards = cardsList;
      break;
    case `watchlist`:
      cards = cardsList.filter((it) => it.isWatchlist);
      break;
    case `history`:
      cards = cardsList.filter((it) => it.isWatched);
      break;
    case `favorites`:
      cards = cardsList.filter((it) => it.isFavorite);
      break;
  }

  return cards;
};

const getWathedFilms = () => cardFilms.filter((it) => it.isWatched);

const getTotalDurationFilms = (films) => {
  const totalMinutes = films.reduce((total, film) => total + film.runtime, 0);

  return {
    hours: parseInt(totalMinutes / HOUR_TIME, 10),
    minutes: totalMinutes % HOUR_TIME
  };
};

const renderCardsByCategory = (films) => {
  const topFilms = films.sort((prevFilm, nextFilm) => {
    return nextFilm.totalRating - prevFilm.totalRating;
  }).splice(0, 2);

  const mostFilms = films.sort((prevFilm, nextFilm) => {
    return nextFilm.comments.length - prevFilm.comments.length;
  }).splice(0, 2);

  topBlock.innerHTML = ``;
  renderCardList(topBlock, topFilms);

  mostBlock.innerHTML = ``;
  renderCardList(mostBlock, mostFilms);

  mainBlock.innerHTML = ``;
  renderCardList(mainBlock, films);

  films.push(...topFilms, ...mostFilms);
};

api.getFilms()
  .then((films) => {
    boardNoFilms.classList.add(HIDDEN_CLASS);
    cardFilms = createCardList(films);
    renderCardsByCategory(cardFilms);
    createChart();
    updateFilters();
  })
  .catch(() => {
    boardNoFilms.innerHTML = `Something went wrong while loading movies. Check your connection or try again later`;
  });

export {
  createGenresList,
  getWathedFilms,
  cardFilms,
  getTotalDurationFilms,
  createCard,
  renderCard,
  createCardList,
  renderCardList,
  getCardsByCategory
};
