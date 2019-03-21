import {createRandomCard} from './data-card';
import {updateFilters} from './filter-util';
import CardFilm from './card-film';
import CardFilmDetails from './film-details';

const COUNT_CARD_MAIN_BLOCK = 7;
const COUNT_CARD_TOP_BLOCK = 2;
const COUNT_CARD_MOST_BLOCK = 2;

const HOUR_TIME = 60;

const createDataCardsList = (numberCards) => {
  const dataCardsList = [];

  for (let i = 0; i < numberCards; i++) {
    dataCardsList.push(createRandomCard());
  }

  return dataCardsList;
};

const createCard = (data) => {
  const card = new CardFilm(data);
  const cardDetails = new CardFilmDetails(data);

  card.onClick = () => {
    document.body.appendChild(cardDetails.render());
  };

  card.onAddToWatchList = () => {
    card._isFavotite = !card._isFavotite;
    updateFilters();

    card.unbind();
    card.uncache();
    card._partialUpdate();
  };

  card.onMarkAsWatched = () => {
    card._isWatched = !card._isWatched;
    updateFilters();

    card.unbind();
    card.uncache();
    card._partialUpdate();
  };

  cardDetails.onClose = (newData) => {
    card.update(newData);
    card.unbind();
    card.uncache();
    card._partialUpdate();

    cardDetails.update(newData);
    cardDetails.element.remove();
    cardDetails.unrender();
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
      cards = cardsList.filter((it) => it._isWatched);
      break;
    case `history`:
      break;
    case `favorites`:
      cards = cardsList.filter((it) => it._isFavotite);
      break;
  }

  return cards;
};

const getWathedFilms = () => cardsMainBlock.filter((it) => it._isWatched);

const getTotalDurationFilms = (films) => {
  const totalMinutes = films.reduce((total, film) => total + film._durationMinutes, 0);

  return {
    hours: parseInt(totalMinutes / HOUR_TIME, 10),
    minutes: totalMinutes % HOUR_TIME
  };
};

const cardsMainBlock = createCardList(createDataCardsList(COUNT_CARD_MAIN_BLOCK));
const cardsTopBlock = createCardList(createDataCardsList(COUNT_CARD_TOP_BLOCK));
const cardsMostBlock = createCardList(createDataCardsList(COUNT_CARD_MOST_BLOCK));

export {
  getWathedFilms,
  getTotalDurationFilms,
  cardsMainBlock,
  cardsTopBlock,
  cardsMostBlock,
  createDataCardsList,
  createCard,
  renderCard,
  createCardList,
  renderCardList,
  getCardsByCategory
};
