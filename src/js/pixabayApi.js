import axios from 'axios';

const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '35028189-72bf407cb3f4939cdc051809f';

export class PixabayAPI {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
    this.PER_PAGE = 40;
  }

  async fetchPhotos() {
    const options = new URLSearchParams({
      key: API_KEY,
      q: `${this.searchQuery}`,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
      page: `${this.page}`,
      per_page: `${this.PER_PAGE}`,
    });

    try {
      const response = await axios.get(`${BASE_URL}?${options}`);
      this.incrementPage();
      return response.data;
    } catch (error) {
      console.error(error.toJSON());
    }
  }

  get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
  }

  get hits() {
    return this.totalHits;
  }

  set hits(newTotalHits) {
    this.totalHits = newTotalHits;
  }

  incrementPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }
}
