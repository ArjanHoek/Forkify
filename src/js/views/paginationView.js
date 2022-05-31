import View from './View.js';
import icons from 'url:../../img/icons.svg';

// search: {
//   query: '',
//   results: [],
//   page: 1,
//   resultsPerPage: RES_PER_PAGE,
// },

class PaginationView extends View {
  _parentEl = document.querySelector('.pagination');

  _generateMarkup() {
    let markup = '';

    const length = this._data.results.length;
    const resultsPerPage = this._data.resultsPerPage;
    const curPage = this._data.page;

    const lastPage = Math.ceil(length / resultsPerPage);

    const hideBoth = length <= resultsPerPage;
    const showPrev = !hideBoth && curPage > 1;
    const showNext = !hideBoth && curPage < lastPage;

    if (showPrev) {
      markup += `
        <button data-page=${
          curPage - 1
        } class="btn--inline pagination__btn--prev">
          <svg class="search__icon">
            <use href="${icons}#icon-arrow-left"></use>
          </svg>
          <span>Page ${curPage - 1}</span>
        </button>
      `;
    }

    if (showNext) {
      markup += `
        <button data-page=${
          curPage + 1
        } class="btn--inline pagination__btn--next">
          <span>Page ${curPage + 1}</span>
          <svg class="search__icon">
            <use href="${icons}#icon-arrow-right"></use>
          </svg>
        </button>
    `;
    }

    return markup;
  }

  addHandlerClick(handler) {
    this._parentEl.addEventListener('click', function ({ target }) {
      const btn = target.closest('.btn--inline');
      if (!btn) return;
      handler(+btn.dataset.page);
    });
  }
}

export default new PaginationView();
