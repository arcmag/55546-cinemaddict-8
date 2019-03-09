import {getRandomInt, getRandomFloat} from './util';

const TITLES_LIST = [
  `Pirates of the Caribbean: The Curse of the Black Pearl`,
  `Pirates of the Caribbean: Dead Man's Chest`,
  `Pirates of the Caribbean: At World's End`,
  `The Lord of the Rings: The Fellowship of the Ring`,
  `The Lord of the Rings: The Two Towers`,
  `The Lord of the Rings: The Return of the King`,
  `The Hobbit: An Unexpected Journey`,
  `The Hobbit: The Desolation of Smaug`,
  `The Hobbit: The Battle of the Five Armies`
];

const POSTERS_LIST = [
  `accused.jpg`,
  `blackmail.jpg`,
  `blue-blazes.jpg`,
  `fuga-da-new-york.jpg`,
  `moonrise.jpg`,
  `three-friends.jpg`
];

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

const GENRES_LIST = [
  `Comedy`,
  `Fantasy`,
  `Action`,
  `Drama`,
  `Horror`,
  `Mystery`
];

const POSTER_PATH = `./images/posters/`;

const MAX_RAITING = 10;
const MIN_RAITING = 0;

const MAX_RANDOM_YEAR = 2018;
const MIN_RANDOM_YEAR = 2000;

const MAX_COUNT_DESCRIPTION = 3;
const MIN_COUNT_DESCRIPTION = 1;

const MAX_COMMENTS_COUNT = 100;
const MIN_COMMENTS_COUNT = 0;

const MAX_COUNT_GENRES = 4;
const MIN_COUNT_GENRES = 1;

const DEFAULT_IMG_ALT = `poster film`;
const DEFAULT_FILM_DURATION = `1h&nbsp;13m`;

const getRandomTitle = () => TITLES_LIST[getRandomInt(0, TITLES_LIST.length - 1)];
const getRandomRaiting = () => getRandomFloat(MIN_RAITING, MAX_RAITING).toFixed(1);
const getRandomYear = () => getRandomInt(MIN_RANDOM_YEAR, MAX_RANDOM_YEAR);
const getRandomPoster = () => POSTERS_LIST[getRandomInt(0, POSTERS_LIST.length - 1)];
const getRandomCommentsCount = () => getRandomInt(MIN_COMMENTS_COUNT, MAX_COMMENTS_COUNT);

const getRandomDescription = () => {
  let descriptionString = ``;
  const countDescription = getRandomInt(MIN_COUNT_DESCRIPTION, MAX_COUNT_DESCRIPTION);
  const copyDescriptionList = DESCRIPTIONS_TEXT_LIST.slice();

  for (let i = 0; i < countDescription; i++) {
    descriptionString += copyDescriptionList.splice(getRandomInt(0, countDescription.length), 1) + ` `;
  }

  return descriptionString;
};

const getRandomGenres = () => {
  const countGenres = getRandomInt(MIN_COUNT_GENRES, MAX_COUNT_GENRES);
  const copyGenres = GENRES_LIST.slice();
  const genres = [];

  for (let i = 0; i < countGenres; i++) {
    genres.push(copyGenres.splice(getRandomInt(0, GENRES_LIST.length - 1), 1));
  }

  return genres;
};

const createRandomCard = (data) => {
  return {
    title: getRandomTitle(),
    rating: getRandomRaiting(),
    year: getRandomYear(),
    duration: DEFAULT_FILM_DURATION,
    genre: getRandomGenres(),
    img: POSTER_PATH + getRandomPoster(),
    imgAlt: DEFAULT_IMG_ALT,
    description: getRandomDescription(),
    commentsCount: getRandomCommentsCount(),
    ...data
  };
};

export {createRandomCard};
