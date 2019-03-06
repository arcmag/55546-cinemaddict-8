import {renderFilter, filters, bindFiltersAction} from './filter';
import {createCardList, renderCardList} from './card';

const filterBlock = document.querySelector(`.main-navigation`);
filterBlock.innerHTML = filters.map((it) => {
  return renderFilter(it.name, it.link, it.count, it.isActive, it.isStats);
}).join(``);

bindFiltersAction(`.main-navigation .main-navigation__item`);

const cardsBlock = document.querySelector(`.films-list__container`);
renderCardList(createCardList(7), cardsBlock);

const topCardsBlock = document.querySelector(`.films-list--extra .films-list__container`);
renderCardList(createCardList(2), topCardsBlock, false);

const mostCardsBlock = document.querySelector(`.films-list--extra:nth-child(3) .films-list__container`);
renderCardList(createCardList(2), mostCardsBlock, false);
