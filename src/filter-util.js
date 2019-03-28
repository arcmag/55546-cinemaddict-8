import Filter from './filter';
import {chartUpdate, getDataPriorityGenres, updateDataStatistic} from './chart-util';
import {
  createGenresList,
  renderCardList,
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

const filmsBlock = document.querySelector(`.films`);
const statisticBlock = document.querySelector(`.statistic`);

const filterContainer = document.querySelector(`.main-navigation`);
const mainBlock = document.querySelector(`.films-list__container`);

const createFilter = (data) => {
  const filter = new Filter(data);

  filter.onFilter = () => {
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
      filmsBlock.classList.remove(HIDDEN_CLASS);
      mainBlock.innerHTML = ``;
      renderCardList(mainBlock, getCardsByCategory(cardFilms, filter._title));
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

export {updateFilters};
