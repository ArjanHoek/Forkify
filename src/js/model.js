import { API_KEY, API_URL, RES_PER_PAGE } from './config.js';
import { AJAX } from './helpers.js';

export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    page: 1,
    resultsPerPage: RES_PER_PAGE,
  },
  bookmarks: [],
};

const createRecipeObject = function (data) {
  const { recipe } = data.data;

  const bookmarked = state.bookmarks.some(rec => rec.id === recipe.id);

  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    bookmarked,
    ...(recipe.key && { key: recipe.key }),
  };
};

export const loadRecipe = async function (id) {
  try {
    const data = await AJAX(`${API_URL}${id}?key=${API_KEY}`);

    state.recipe = createRecipeObject(data);
  } catch (err) {
    throw err;
  }
};

export const loadSearchResults = async query => {
  try {
    state.search.query = query;

    const data = await AJAX(`${API_URL}?search=${query}&key=${API_KEY}`);

    state.search.results = data.data.recipes.map(rec => {
      return {
        id: rec.id,
        title: rec.title,
        publisher: rec.publisher,
        image: rec.image_url,
        ...(rec.key && { key: rec.key }),
      };
    });

    state.search.page = 1;
  } catch (err) {
    throw err;
  }
};

export const getSearchResultsPage = function (page = state.search.page) {
  state.search.page = page;

  const numResults = state.search.resultsPerPage;

  const start = (page - 1) * numResults;
  const end = start + numResults;

  return state.search.results.slice(start, end);
};

export const updateServings = function (servings) {
  state.recipe.ingredients.forEach(ing => {
    ing.quantity = (ing.quantity / state.recipe.servings) * servings;
  });

  state.recipe.servings = servings;
};

const persistBookmarks = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

export const importBookmarks = function () {
  const bookmarks = localStorage.getItem('bookmarks');

  if (!bookmarks) return;

  state.bookmarks = JSON.parse(bookmarks);
};

export const toggleBookmark = function (recipe) {
  const added = state.bookmarks.some(bookmark => bookmark.id === recipe.id);

  if (added) {
    state.bookmarks = state.bookmarks.filter(
      bookmark => bookmark.id !== recipe.id
    );

    if (recipe.id === state.recipe.id) {
      state.recipe.bookmarked = false;
    }
  } else {
    state.bookmarks.push(recipe);

    if (recipe.id === state.recipe.id) {
      state.recipe.bookmarked = true;
    }
  }

  persistBookmarks();
};

const convertIngredient = function (val) {
  console.log(val);
  // const ingArray = val.replaceAll(' ', '').split(',');
  const ingArray = val.split(',').map(v => v.trim());

  if (ingArray.length !== 3)
    throw new Error(
      'Wrong ingredient format! Please use the correct format :)'
    );

  const [quantity, unit, description] = ingArray;
  return { quantity: quantity ? +quantity : null, unit, description };
};

const getIngredients = function (recipe) {
  return Object.entries(recipe).reduce((acc, [key, value]) => {
    if (!key.startsWith('ingredient') || !value) return acc;

    const convertedIngredient = convertIngredient(value);

    if (!convertedIngredient) return acc;

    return acc.concat(convertIngredient(value));
  }, []);
};

export const uploadRecipe = async function (recipe) {
  try {
    const ingredients = getIngredients(recipe);

    const newRecipe = {
      title: recipe.title,
      publisher: recipe.publisher,
      source_url: recipe.sourceUrl,
      image_url: recipe.image,
      servings: +recipe.servings,
      cooking_time: +recipe.cookingTime,
      ingredients: ingredients,
    };

    const res = await AJAX(`${API_URL}?key=${API_KEY}`, newRecipe);

    state.recipe = createRecipeObject(res);
    toggleBookmark(state.recipe);
  } catch (err) {
    throw err;
  }
};
