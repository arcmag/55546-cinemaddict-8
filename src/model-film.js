export default class ModelFilm {
  constructor(data) {
    this.id = data.id;
    this.comments = data.comments || [];

    this.isWatched = data.user_details.already_watched;
    this.isFavorite = data.user_details.favorite;
    this.isWatchlist = data.user_details.watchlist;
    this.personalRating = data.user_details.personal_rating || 0;
    this.watchingDate = data.user_details.watching_date || 0;

    this.actors = data.film_info.actors || [];
    this.ageRating = data.film_info.age_rating || 0;
    this.altTitle = data.film_info.alternative_title || ``;
    this.description = data.film_info.description || ``;
    this.director = data.film_info.director || ``;

    this.genre = new Set(data.film_info.genre || []);
    this.poster = data.film_info.poster;

    this.date = new Date(data.film_info.release.date);
    this.country = data.film_info.release.release_country || ``;
    this.runtime = data.film_info.runtime || 0;
    this.totalRating = data.film_info.total_rating || 0;
    this.title = data.film_info.title || 0;

    this.writers = new Set(data.film_info.writers || []);
  }

  toRAW() {
    return {
      'id': this.id,
      'comments': this.comments,
      'film_info': {
        'actors': this.actors,
        'age_rating': this.ageRating,
        'alternative_title': this.altTitle,
        'description': this.description,
        'director': this.director,
        'genre': Array.from(this.genre),
        'poster': this.poster,
        'release': {
          'date': this.date,
          'release_country': this.country
        },
        'runtime': this.runtime,
        'title': this.title,
        'total_rating': this.totalRating,
        'writers': Array.from(this.writers)
      },
      'user_details': {
        'already_watched': this.isWatched,
        'favorite': this.isFavorite,
        'personal_rating': this.personalRating,
        'watchlist': this.isWatchlist,
        'watching_date': this.watchingDate
      }
    };
  }

  static staticToRAW(data) {
    return {
      'id': data.id,
      'comments': data.comments,
      'film_info': {
        'actors': data.actors,
        'age_rating': data.ageRating,
        'alternative_title': data.altTitle,
        'description': data.description,
        'director': data.director,
        'genre': Array.from(data.genre),
        'poster': data.poster,
        'release': {
          'date': data.date,
          'release_country': data.country
        },
        'runtime': data.runtime,
        'title': data.title,
        'total_rating': data.totalRating,
        'writers': Array.from(data.writers)
      },
      'user_details': {
        'already_watched': data.isWatched,
        'favorite': data.isFavorite,
        'personal_rating': data.personalRating,
        'watchlist': data.isWatchlist,
        'watching_date': data.watchingDate
      }
    };
  }

  static parseFilm(data) {
    return new ModelFilm(data);
  }

  static parseFilms(data) {
    return data.map(ModelFilm.parseFilm);
  }
}
