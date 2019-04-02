import Filter from './filter';
import {chartUpdate, getDataPriorityGenres, updateDataStatistic} from './chart-util';
import {
  setStatusVisibleCards,
  renderCardsByCategory,
  createGenresList,
  getCardsByCategory,
  cardFilms,
  getWathedFilms,
  getTotalDurationFilms
} from './card-util';

const FilterTitle = {
  ALL: `All movies`,
  WATCHLIST: `Watchlist`,
  HISTORY: `History`,
  FAVORITES: `Favorites`,
  STATS: `Stats`,
};

const HIDDEN_CLASS = `visually-hidden`;

const BASE_VISIBLE_COUNT_FILMS = 5;
const INC_COUNT_FILMS_STEEP = 5;

let searchString = ``;

let countVisibleFilms = BASE_VISIBLE_COUNT_FILMS;

const filmsBlock = document.querySelector(`.films`);
const statisticBlock = document.querySelector(`.statistic`);

const filterContainer = document.querySelector(`.main-navigation`);
const mainBlock = document.querySelector(`.films-list__container`);

const btnShowMore = document.querySelector(`.films-list__show-more`);
const searchField = document.querySelector(`.search__field`);

const statisticTimeFilters = document.querySelector(`.statistic__filters`);

const createFilter = (data) => {
  const filter = new Filter(data);

  filter.onFilter = () => {
    searchString = ``;
    searchField.value = ``;
    countVisibleFilms = BASE_VISIBLE_COUNT_FILMS;

    statisticBlock.classList.add(HIDDEN_CLASS);
    filmsBlock.classList.add(HIDDEN_CLASS);

    if (filter._title === FilterTitle.STATS) {
      statisticBlock.classList.remove(HIDDEN_CLASS);
      const films = getWathedFilms();
      const genres = createGenresList(films);

      updateDataStatistic({
        totalFilms: films.length,
        totalTime: getTotalDurationFilms(films),
        topGenre: Object.entries(getDataPriorityGenres(films, genres)).sort((a, b) =>
          b[1] - a[1])[0][0]
      });

      chartUpdate({
        data: Object.values(getDataPriorityGenres(films, genres)),
        labels: genres
      });
    } else {
      const cardsByCategory = getCardsByCategory(cardFilms, filter._title);

      filmsBlock.classList.remove(HIDDEN_CLASS);
      mainBlock.innerHTML = ``;

      setStatusVisibleCards(cardFilms, false);
      setStatusVisibleCards(cardsByCategory, true);

      renderCardsByCategory(cardsByCategory);
      visibleButtonShowMore();
    }

    filtersList.forEach((it) => {
      it._isActive = it === filter;
      it._partialUpdate();
    });
  };

  return filter;
};

const createFiltersList = (dataList) => dataList.map((it) => createFilter(it));

const renderFilter = (filter) => filterContainer.appendChild(filter.render());

const renderFilterList = (filterList) => filterList.forEach((it) => renderFilter(it));

const updateFilters = () => {
  filtersList.forEach((it) => {
    if (it._title !== FilterTitle.STATS && it._title !== FilterTitle.ALL) {
      it.update(getCardsByCategory(cardFilms, it._title).length);
      it._partialUpdate();
    }
  });
};

const visibleButtonShowMore = () => {
  if (cardFilms.filter((it) => it.isVisible).length <= countVisibleFilms) {
    btnShowMore.classList.add(HIDDEN_CLASS);
  } else {
    btnShowMore.classList.remove(HIDDEN_CLASS);
  }
};

const filtersDataList = [
  {title: FilterTitle.ALL, link: `#all`, isActive: true},
  {title: FilterTitle.WATCHLIST, link: `#watchlist`, count: 0},
  {title: FilterTitle.HISTORY, link: `#history`, count: 0},
  {title: FilterTitle.FAVORITES, link: `#favorites`, count: 0},
  {title: FilterTitle.STATS, link: `#stats`, isStats: true},
];

const filtersList = createFiltersList(filtersDataList);
filterContainer.innerHTML = ``;
renderFilterList(filtersList);

btnShowMore.addEventListener(`click`, () => {
  if (cardFilms.filter((it) => it.isVisible).length >= countVisibleFilms) {
    countVisibleFilms += INC_COUNT_FILMS_STEEP;
    renderCardsByCategory(cardFilms);
    visibleButtonShowMore();
  }
});

searchField.addEventListener(`input`, (evt) => {
  searchString = evt.currentTarget.value;
  renderCardsByCategory(cardFilms);
});

statisticTimeFilters.addEventListener(`change`, (evt) => {
  statisticTimeFilters.dataset.var = evt;
});

export {updateFilters, FilterTitle, countVisibleFilms, visibleButtonShowMore, searchString};
