import Filter from './filter';
import {chartUpdate, getDataPriorityGenres, updateDataStatistic} from './chart-util';
import {
  setStatusVisibleCards,
  renderCardsByCategory,
  createGenresList,
  getCardsByCategory,
  getCardFilms,
  getWathedFilms,
  getTotalDurationFilms
} from './card-util';
import moment from 'moment';

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
const statisticAllTimeFilter = statisticTimeFilters.querySelector(`#statistic-all-time`);

const filterChartUpdate = (films) => {
  const genres = createGenresList(films);
  const topGenre = films.length === 0 ? `-` : Object.entries(getDataPriorityGenres(films, genres))
    .sort((a, b) => b[1] - a[1])[0][0];

  updateDataStatistic({
    totalFilms: films.length,
    time: getTotalDurationFilms(films),
    topGenre
  });

  chartUpdate({
    data: Object.values(getDataPriorityGenres(films, genres)),
    labels: genres
  });
};

const createFilter = (data) => {
  const filter = new Filter(data);

  filter.onFilter = () => {
    const allFilms = getCardFilms();

    searchString = ``;
    searchField.value = ``;
    countVisibleFilms = BASE_VISIBLE_COUNT_FILMS;

    statisticBlock.classList.add(HIDDEN_CLASS);
    filmsBlock.classList.add(HIDDEN_CLASS);

    if (filter._title === FilterTitle.STATS) {
      statisticBlock.classList.remove(HIDDEN_CLASS);
      statisticAllTimeFilter.checked = true;
      filterChartUpdate(getFilmsByTime());
    } else {
      const cardsByCategory = getCardsByCategory(allFilms, filter._title);

      filmsBlock.classList.remove(HIDDEN_CLASS);
      mainBlock.innerHTML = ``;

      setStatusVisibleCards(allFilms, false);
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
      it.update(getCardsByCategory(getCardFilms(), it._title).length);
      it._partialUpdate();
    }
  });
};

const visibleButtonShowMore = () => {
  if (getCardFilms().filter((it) => it.isVisible).length <= countVisibleFilms) {
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
  const allFilms = getCardFilms();

  if (allFilms.filter((it) => it.isVisible).length >= countVisibleFilms) {
    countVisibleFilms += INC_COUNT_FILMS_STEEP;
    renderCardsByCategory(allFilms);
    visibleButtonShowMore();
  }
});

searchField.addEventListener(`input`, (evt) => {
  searchString = evt.currentTarget.value;
  renderCardsByCategory(getCardFilms());
});

const FilterTime = {
  TODAY: `today`,
  WEEK: `week`,
  MONTH: `month`,
  YEAR: `year`
};

const PeriodDatetime = {
  TODAY: {day: 0, month: 0},
  WEEK: {day: 7, month: 0},
  MONTH: {month: 0},
  YEAR: {month: 12}
};

const getFilmsByTime = (datetime) => {
  let films = getWathedFilms();
  const now = Date.now();

  switch (datetime) {
    case FilterTime.TODAY:
      films = films.filter((it) => {
        const data = moment.duration(now - it.watchingDate)._data;
        return data.days <= PeriodDatetime.TODAY.day && data.months <= PeriodDatetime.TODAY.month;
      });
      break;
    case FilterTime.WEEK:
      films = films.filter((it) => {
        const data = moment.duration(now - it.watchingDate)._data;
        return data.days < PeriodDatetime.WEEK.day && data.months <= PeriodDatetime.WEEK.month;
      });
      break;
    case FilterTime.MONTH:
      films = films.filter((it) => {
        const data = moment.duration(now - it.watchingDate)._data;
        return data.months <= PeriodDatetime.MONTH.month;
      });
      break;
    case FilterTime.YEAR:
      films = films.filter((it) => {
        const data = moment.duration(now - it.watchingDate)._data;
        return data.months < PeriodDatetime.YEAR.month;
      });
      break;
  }

  return films;
};


statisticTimeFilters.addEventListener(`change`, (evt) => {
  filterChartUpdate(getFilmsByTime(evt.target.value));
});

export {
  updateFilters,
  FilterTitle,
  countVisibleFilms,
  visibleButtonShowMore,
  searchString
};
