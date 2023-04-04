import { Notify } from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

import { PixabayAPI } from './js/pixabayApi';
import { LoadMoreBtn } from './js/load-more';

const formSearchEl = document.querySelector('.search-form');
const galleryEl = document.querySelector('.gallery');

const loadMoreBtn = new LoadMoreBtn({
  selector: '.load-more',
  hidden: true,
});

const pixabayApi = new PixabayAPI();
const lightbox = new SimpleLightbox('.gallery__item', {
  captionDelay: 250,
  captionsData: 'alt',
  enableKeyboard: true,
});

formSearchEl.addEventListener('submit', onSearch);
loadMoreBtn.refs.button.addEventListener('click', onLoadMore);

function onSearch(e) {
  e.preventDefault();

  pixabayApi.query = e.target.searchQuery.value.trim();
  loadMoreBtn.show();
  pixabayApi.resetPage();
  clearGallery();
  fetchPosts();
}

function onLoadMore() {
  fetchPosts();
  loadMoreBtn.show();
  smoothScroll();
}

function fetchPosts() {
  loadMoreBtn.hide();

  pixabayApi.fetchPhotos().then(data => {
    const curentPage = pixabayApi.page - 1;
    pixabayApi.hits = data.totalHits;

    if (!data.totalHits) {
      loadMoreBtn.hide();

      return Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    }

    if (!data.hits.length) {
      loadMoreBtn.hide();
      Notify.info("We're sorry, but you've reached the end of search results.");
      return;
    }
    renderPost(data.hits);
    if (curentPage === 1) {
      Notify.success(`Hooray! We found ${pixabayApi.hits} images.`);
      loadMoreBtn.show();
    }
  });
}

function renderPost(data) {
  let markupPost = data
    .map(
      ({
        largeImageURL,
        webformatURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
        return `<a class="gallery__item" href="${largeImageURL}">
                  <div class="gallery-img">
                      <img src="${webformatURL}" alt="${tags}" loading="lazy" />
                      <div class="info">
                        <p class="info-item"><b>Likes</b> ${likes}</p>
                        <p class="info-item"><b>Views</b> ${views}</p>
                        <p class="info-item"><b>Comments</b> ${comments}</p>
                        <p class="info-item"><b>Downloads</b> ${downloads}</p>
                      </div>
                    </div>
                 </a>`;
      }
    )
    .join('');

  galleryEl.insertAdjacentHTML('beforeend', markupPost);
  lightbox.refresh();
}

function clearGallery() {
  galleryEl.innerHTML = '';
}

function smoothScroll() {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}
