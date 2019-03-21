import {renderFilterList, updateFilters, filtersList} from './filter-util';
import {renderCardList, cardsMainBlock, cardsTopBlock, cardsMostBlock} from './card-util';

import {} from './chart-util';

const filterContainer = document.querySelector(`.main-navigation`);
filterContainer.innerHTML = ``;

renderFilterList(filtersList);
updateFilters();

const mainBlock = document.querySelector(`.films-list__container`);
mainBlock.innerHTML = ``;
renderCardList(mainBlock, cardsMainBlock);

const topBlock = document.querySelector(`.films-list--extra .films-list__container`);
topBlock.innerHTML = ``;
renderCardList(topBlock, cardsTopBlock);

const mostBlock = document.querySelector(`.films-list--extra:nth-child(3) .films-list__container`);
mostBlock.innerHTML = ``;
renderCardList(mostBlock, cardsMostBlock);
