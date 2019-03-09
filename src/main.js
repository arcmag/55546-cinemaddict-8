import {createDataCardsList, createCardList, renderCardList} from './util';
import {renderFilter, filters, bindFiltersAction} from './filter';

const filterBlock = document.querySelector(`.main-navigation`);
filterBlock.innerHTML = filters.map((it) => {
  return renderFilter(it.name, it.link, it.count, it.isActive, it.isStats);
}).join(``);

bindFiltersAction(`.main-navigation .main-navigation__item`);

const mainCardsBlock = document.querySelector(`.films-list__container`);
mainCardsBlock.innerHTML = ``;
renderCardList(mainCardsBlock, createCardList(createDataCardsList(7)));

const topCardsBlock = document.querySelector(`.films-list--extra .films-list__container`);
topCardsBlock.innerHTML = ``;
renderCardList(topCardsBlock, createCardList(createDataCardsList(2)));

const mostCardsBlock = document.querySelector(`.films-list--extra:nth-child(3) .films-list__container`);
mostCardsBlock.innerHTML = ``;
renderCardList(mostCardsBlock, createCardList(createDataCardsList(2)));
