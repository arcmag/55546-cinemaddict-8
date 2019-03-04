import {renderFilter, filters, bindFiltersAction} from './filter.js';
import {renderCard, cardDataTemplate} from './card.js';

const cardsBlock = document.querySelector(`.films-list__container`);

const filterBlock = document.querySelector(`.main-navigation`);
filterBlock.innerHTML = filters.map((it) => {
  return renderFilter(it.name, it.link, it.count, it.isActive, it.isStats);
}).join(``);

bindFiltersAction(`.main-navigation .main-navigation__item`);

cardsBlock.innerHTML = Array(7).fill(renderCard(cardDataTemplate));

const topRatedCardsBlock = document.querySelector(`.films-list--extra .films-list__container`);
topRatedCardsBlock.innerHTML = Array(2).fill(renderCard(cardDataTemplate, true));

const mostCommentedCardsBlock = document.querySelector(`.films-list--extra:nth-child(3) .films-list__container`);
mostCommentedCardsBlock.innerHTML = Array(2).fill(renderCard(cardDataTemplate, true));
