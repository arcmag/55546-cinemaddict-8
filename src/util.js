import {createRandomCard} from './data-card';
import {CardFilm} from './card-film';
import {CardFilmDetails} from './film-details';
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
  return {
    card: new CardFilm(data),
    cardDetails: new CardFilmDetails(data)
  };
};

const renderCard = (container, dataCard) => {
  dataCard.card.onClick = () => {
    document.body.appendChild(dataCard.cardDetails.render());
  };

  dataCard.cardDetails.onClose = () => {
    dataCard.cardDetails.element.parentNode.removeChild(dataCard.cardDetails.element);
    dataCard.cardDetails.unrender();
  };

  container.appendChild(dataCard.card.render());
};

const createCardList = (dataCardsList) => {
  return dataCardsList.map((it) => createCard(it));
};

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
