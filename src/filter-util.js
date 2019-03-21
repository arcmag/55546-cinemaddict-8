import Filter from './filter';
import {statisticChart, getDataPriorityGenres} from './chart-util';
import {
  renderCardList,
  getCardsByCategory,
  cardsMainBlock,
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
const statisticTextList = document.querySelector(`.statistic__text-list`);

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
      const totalTime = getTotalDurationFilms(films);
      const dataGenres = getDataPriorityGenres(films);
      let topGenre = `-`;
      let countGenre = 0;

      Object.keys(dataGenres).forEach((genre) => {
        if (dataGenres[genre] > countGenre) {
          countGenre = dataGenres[genre];
          topGenre = genre;
        }
      });

      statisticTextList.innerHTML = `
        <li class="statistic__text-item">
          <h4 class="statistic__item-title">You watched</h4>
          <p class="statistic__item-text">
            ${films.length} <span class="statistic__item-description">movies</span>
          </p>
        </li>
        <li class="statistic__text-item">
          <h4 class="statistic__item-title">Total duration</h4>
          <p class="statistic__item-text">
            ${totalTime.hours} <span class="statistic__item-description">h</span>
            ${totalTime.minutes} <span class="statistic__item-description">m</span>
          </p>
        </li>
        <li class="statistic__text-item">
          <h4 class="statistic__item-title">Top genre</h4>
          <p class="statistic__item-text">${topGenre}</p>
        </li>
        `;

      statisticChart.data.datasets[0].data = Object.values(getDataPriorityGenres(films));
      statisticChart.update();
    } else {
      filmsBlock.classList.remove(HIDDEN_CLASS);
      mainBlock.innerHTML = ``;
      renderCardList(mainBlock, getCardsByCategory(cardsMainBlock, filter._title));
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
      it.update(getCardsByCategory(cardsMainBlock, it._title).length);
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

export {
  updateFilters,
  createFilter,
  createFiltersList,
  renderFilter,
  renderFilterList,
  filtersList
};
