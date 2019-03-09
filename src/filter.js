import {getRandomInt, createCardList, renderCardList, createDataCardsList} from './util';

const MAX_COUNT_FILMS = 20;
const MIN_COUNT_FILMS = 0;

const cardsBlock = document.querySelector(`.films-list__container`);

const getRandomCountFilms = () => getRandomInt(MIN_COUNT_FILMS, MAX_COUNT_FILMS);

const filters = [
  {name: `All movies`, link: `#all`, isActive: true},
  {name: `Watchlist`, link: `#watchlist`, count: getRandomCountFilms()},
  {name: `History`, link: `#history`, count: getRandomCountFilms()},
  {name: `Favorites`, link: `#favorites`, count: getRandomCountFilms()},
  {name: `Stats`, link: `#stats`, isStats: true},
];

const renderFilter = (name = ``, link = `#`, count, isActive, isStats) => {
  const countString = !count ? `` : `<span class="main-navigation__item-count">${count}</span>`;
  const activeString = !isActive ? `` : `main-navigation__item--active`;
  const statsString = !isStats ? `` : `main-navigation__item--additional`;

  return `
    <a href="${link}" class="main-navigation__item ${activeString} ${statsString}">
      ${name} ${countString}
    </a>
  `;
};

const clickFilterFilm = () => {
  cardsBlock.innerHTML = ``;

  renderCardList(
      cardsBlock,
      createCardList(
          createDataCardsList(
              getRandomCountFilms()
          )
      )
  );
};

const bindFiltersAction = (filtersSelector) => {
  [...document.querySelectorAll(filtersSelector)].forEach((it) => {
    it.addEventListener(`click`, clickFilterFilm);
  });
};

export {renderFilter, filters, bindFiltersAction};
