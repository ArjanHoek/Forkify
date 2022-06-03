import View from './View.js';

export default class PreviewView extends View {
  _generateMarkup() {
    const activeId = window.location.hash.slice(1);

    return this._data.reduce(
      (markup, { image, id, publisher, title }) =>
        markup +
        `
      <li class="preview">
        <a class="preview__link ${
          id === activeId ? 'preview__link--active' : ''
        }" href="#${id}">
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
