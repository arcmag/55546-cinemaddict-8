import {renderCard, cardDataTemplate} from './card.js';

const MAX_COUNT_FILMS = 30;

const cardsBlock = document.querySelector(`.films-list__container`);

const getRandomCountFilms = () => {
  return Math.round(Math.random() * MAX_COUNT_FILMS);
};

const filters = [
  {name: `All movies`, link: `#all`, isActive: true},
  {name: `Watchlist`, link: `#watchlist`, count: getRandomCountFilms()},
  {name: `History`, link: `#history`, count: getRandomCountFilms()},
  {name: `Favorites`, link: `#favorites`, count: getRandomCountFilms()},
  {name: `Stats`, link: `#stats`, isStats: true},
];

const renderFilter = (name = ``, link = `#`, count, isActive, isStats) => {
  const countString = count === undefined ? `` : `<span class="main-navigation__item-count">${count}</span>`;
  const activeString = isActive === undefined ? `` : `main-navigation__item--active`;
  const statsString = isStats === undefined ? `` : `main-navigation__item--additional`;

  return `
    <a href="${link}" class="main-navigation__item ${activeString} ${statsString}">
      ${name} ${countString}
    </a>
  `;
};

const clickFilterFilm = () => {
  cardsBlock.innerHTML = Array(getRandomCountFilms()).fill(renderCard(cardDataTemplate));
};

const bindFiltersAction = (filtersSelector) => {
  [...document.querySelectorAll(filtersSelector)].forEach((it) => {
    it.addEventListener(`click`, clickFilterFilm);
  });
};

export {renderFilter, filters, bindFiltersAction};
