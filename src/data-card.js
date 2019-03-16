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

const POSTER_PATH = `./images/posters/`;

const MAX_RAITING = 10;
const MIN_RAITING = 0;

const MAX_COUNT_DESCRIPTION = 3;
const MIN_COUNT_DESCRIPTION = 1;

const MAX_COMMENTS_COUNT = 30;
const MIN_COMMENTS_COUNT = 0;

const MAX_COUNT_GENRES = 4;
const MIN_COUNT_GENRES = 1;

const DEFAULT_IMG_ALT = `poster film`;

const MIN_DATE_YEAR = 2000;
const MIN_DATE_MONTH = 1;
const MIN_DATE_DAY = 1;

const HOUR_TIME = 60;
const MAX_HOUR_FILM_DURATION = 3;

const getRandomTitle = () => TITLES_LIST[getRandomInt(0, TITLES_LIST.length - 1)];
const getRandomRaiting = () => getRandomFloat(MIN_RAITING, MAX_RAITING).toFixed(1);
const getRandomPoster = () => POSTERS_LIST[getRandomInt(0, POSTERS_LIST.length - 1)];
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

const getRandomGenres = () => {
  const countGenres = getRandomInt(MIN_COUNT_GENRES, MAX_COUNT_GENRES);
  const copyGenres = GENRES_LIST.slice();
  const genres = [];

  for (let i = 0; i < countGenres; i++) {
    genres.push(copyGenres.splice(getRandomInt(0, GENRES_LIST.length - 1), 1));
  }

  return genres;
};

const getRandomDate = (min, max) => +(new Date(getRandomInt(min, max)));

const getRandomDuration = () => {
  const time = getRandomInt(HOUR_TIME, HOUR_TIME * MAX_HOUR_FILM_DURATION);

  return {
    hours: parseInt(time / HOUR_TIME, 10),
    minutes: time % HOUR_TIME
  };
};

const getRandomCommentsList = (filmPublicDate) => {
  const commentsList = [];
  const countComments = getRandomInt(MIN_COMMENTS_COUNT, MAX_COMMENTS_COUNT);

  for (let i = 0; i < countComments; i++) {
    commentsList.push({
      date: getRandomDate(filmPublicDate, Date.now()),
      author: getRandomAutorName(),
      text: getRandomDescription()
    });
  }

  return commentsList;
};

const createRandomCard = (data) => {
  const date = getRandomDate(+(new Date(MIN_DATE_YEAR, MIN_DATE_MONTH, MIN_DATE_DAY)), Date.now());

  return {
    date,
    title: getRandomTitle(),
    rating: getRandomRaiting(),
    score: getRandomRaiting(),
    duration: getRandomDuration(),
    genre: getRandomGenres(),
    img: POSTER_PATH + getRandomPoster(),
    imgAlt: DEFAULT_IMG_ALT,
    description: getRandomDescription(),
    comments: getRandomCommentsList(date),
    ...data
  };
};

export {createRandomCard};
