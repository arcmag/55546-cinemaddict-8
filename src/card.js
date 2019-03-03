const cardDataTemplate = {
  title: `Incredibles 2`,
  rating: 9.8,
  year: 2018,
  duration: `1h&nbsp;13m`,
  genre: `Comedy`,
  img: `./images/posters/moonrise.jpg`,
  imgAlt: `poster film`,
  description: `A priests Romania and confront a malevolent force in the form of a demonic nun.`,
  commentsCount: 13
};

const renderCard = (card, noDescription) => {
  let stringDescription = ``;

  if (card.title === undefined) {
    card.title = ``;
  }

  if (card.rating === undefined) {
    card.rating = ``;
  }

  if (card.year === undefined) {
    card.year = ``;
  }

  if (card.duration === undefined) {
    card.duration = ``;
  }

  if (card.genre === undefined) {
    card.genre = ``;
  }

  if (card.img === undefined) {
    card.img = ``;
  }

  if (card.imgAlt === undefined) {
    card.imgAlt = ``;
  }

  if (card.commentsCount === undefined) {
    card.commentsCount = 0;
  }

  if (!noDescription) {
    stringDescription = `<p class="film-card__description">${card.description}</p>`;
  }

  return `
    <article class="film-card">
      <h3 class="film-card__title">${card.title}</h3>
      <p class="film-card__rating">${card.rating}</p>
      <p class="film-card__info">
        <span class="film-card__year">${card.year}</span>
        <span class="film-card__duration">${card.duration}</span>
        <span class="film-card__genre">${card.genre}</span>
      </p>
      <img src="${card.img}" alt="${card.imgAlt}" class="film-card__poster">
      ${stringDescription}
      <button class="film-card__comments">${card.commentsCount} comments</button>

      <form class="film-card__controls">
        <button class="film-card__controls-item button film-card__controls-item--add-to-watchlist">WL</button>
        <button class="film-card__controls-item button film-card__controls-item--mark-as-watched">WTCHD</button>
        <button class="film-card__controls-item button film-card__controls-item--favorite">FAV</button>
      </form>
    </article>
  `;
};

export {renderCard, cardDataTemplate};
