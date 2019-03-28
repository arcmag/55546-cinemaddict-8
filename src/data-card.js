import {getRandomInt} from './util';

const DESCRIPTIONS_TEXT_LIST = [
  `Lorem ipsum dolor sit amet, consectetur adipiscing elit.`,
  `Cras aliquet varius magna, non porta ligula feugiat eget.`,
  `Aliquam id orci ut lectus varius viverra.`,
  `Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.`,
  `Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.`,
  `Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.`,
  `Sed sed nisi sed augue convallis suscipit in sed felis.`,
  `Aliquam erat volutpat.`,
  `Nunc fermentum tortor ac porta dapibus.`,
  `In rutrum ac purus sit amet tempus.`
];

const AUTOR_NAMES_LIST = [
  `Vladimir`,
  `Nikolay`,
  `Alexey`,
  `Alexandr`,
  `Anton`,
  `Sergey`,
  `Ivan`,
  `Oleg`,
];

const MAX_COUNT_DESCRIPTION = 3;
const MIN_COUNT_DESCRIPTION = 1;

const getRandomAutorName = () => AUTOR_NAMES_LIST[getRandomInt(0, AUTOR_NAMES_LIST.length - 1)];

const getRandomDescription = () => {
  let descriptionString = ``;
  const countDescription = getRandomInt(MIN_COUNT_DESCRIPTION, MAX_COUNT_DESCRIPTION);
  const copyDescriptionList = DESCRIPTIONS_TEXT_LIST.slice();

  for (let i = 0; i < countDescription; i++) {
    descriptionString += copyDescriptionList.splice(getRandomInt(0, countDescription.length), 1) + ` `;
  }

  return descriptionString;
};

export {
  getRandomAutorName,
  getRandomDescription
};
