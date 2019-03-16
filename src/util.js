import {createRandomCard} from './data-card';
import CardFilm from './card-film';
import CardFilmDetails from './film-details';

const createElement = (template) => {
  const newElement = document.createElement(`div`);
  newElement.innerHTML = template.trim();
  return newElement.firstChild;
};

const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const getRandomFloat = (min, max) => Math.random() * (max - min + 1) + min;

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

  cardDetails.onClose = (newData) => {
    card.update(newData);
    card.unbind();
    card.uncache();
    card._partialUpdate();

    cardDetails.update(newData);
    cardDetails.element.remove();
    cardDetails.unrender();
  };

  return {
    card,
    cardDetails
  };
};

const renderCard = (container, dataCard) => {
  container.appendChild(dataCard.card.render());
};

const createCardList = (dataCardsList) => dataCardsList.map((it) => createCard(it));

const renderCardList = (container, cardsList) => {
  cardsList.forEach((it) => {
    renderCard(container, it);
  });
};

export {
  createElement,
  getRandomInt,
  getRandomFloat,
  createDataCardsList,
  createCard,
  renderCard,
  createCardList,
  renderCardList
};
