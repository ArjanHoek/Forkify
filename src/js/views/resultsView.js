import View from './View.js';
import icons from 'url:../../img/icons.svg';

class ResultsView extends View {
  _parentEl = document.querySelector('.results');
  _errorMessage = 'No recipes found for your query! Please try again ;)';
  _message = 'Success...';

  _generateMarkup() {
    return this._data.reduce(
      (markup, { image, id, publisher, title }) =>
        markup +
        `
      <li class="preview">
        <a class="preview__link" href="#${id}">
          <figure class="preview__fig">
            <img src="${image}" alt="Test" />
          </figure>
          <div class="preview__data">
            <h4 class="preview__title">${title}</h4>
            <p class="preview__publisher">${publisher}</p>

          </div>
        </a>
      </li>
    `,
      ''
    );
  }
}

export default new ResultsView();
