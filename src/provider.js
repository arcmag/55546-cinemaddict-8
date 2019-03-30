import ModelFilm from './model-film';

const objectToArray = (object) => Object.keys(object).map((id) => object[id]);

export default class Provider {
  constructor({api, store, generateId}) {
    this._api = api;
    this._store = store;
    this._generateId = generateId;
    this._needSync = false;
  }

  updateFilm({id, data}) {
    if (this._isOnline()) {
      return this._api.updateFilm({id, data})
        .then((film) => {
          this._store.setItem({key: film.id, item: film.toRAW()});
          return film;
        });
    } else {
      const film = data;
      this._needSync = true;
      this._store.setItem({key: film.id, item: film});
      return Promise.resolve(ModelFilm.parseFilm(film));
    }
  }

  createFilm({dataFilm}) {
    if (this._isOnline()) {
      return this._api.createFilm({dataFilm})
        .then((film) => {
          this._store.setItem({key: film.id, item: film.toRAW()});
          return film;
        });
    } else {
      dataFilm.id = this._generateId();
      this._needSync = true;

      this._store.setItem({key: dataFilm.id, item: dataFilm});
      return Promise.resolve(ModelFilm.parseFilm(dataFilm));
    }
  }

  deleteFilm({id}) {
    if (this._isOnline()) {
      return this._api.deleteFilm({id})
        .then(() => {
          this._store.removeItem({key: id});
        });
    } else {
      this._needSync = true;
      this._store.removeItem({key: id});
      return Promise.resolve(true);
    }
  }

  getFilms() {
    if (this._isOnline()) {
      return this._api.getFilms()
        .then((films) => {
          this._store.clear();
          films.map((it) => this._store.setItem({key: it.id, item: it.toRAW()}));
          return films;
        });
    } else {
      const rawFilmsMap = this._store.getAll();
      const rawFilms = objectToArray(rawFilmsMap);
      const films = ModelFilm.parseFilms(rawFilms);

      return Promise.resolve(films);
    }
  }

  syncFilms() {
    return this._api.syncFilms({films: objectToArray(this._store.getAll())});
  }

  _isOnline() {
    return window.navigator.onLine;
  }
}
