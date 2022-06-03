import PreviewView from './PreviewView.js';

class ResultsView extends PreviewView {
  _parentEl = document.querySelector('.results');
  _errorMessage = 'No recipes found for your query! Please try again ;)';
  _message = 'Success...';
}

export default new ResultsView();
