import _debounce from 'lodash.debounce';
import countryCardTpl from '../partials/country-card.hbs';
import countriesListTpl from '../partials/countries-list.hbs';
import API from '../js/fetchCountries';
import notification from '../js/messages';

const input = document.querySelector('.country-input');
const cardContainer = document.querySelector('.js-country');

input.addEventListener('input', _debounce(onSearch, 500));

function onSearch() {
  clearInput();

  const searchQuery = input.value.trim();
  if (!searchQuery) {
    return;
  }
  API.fetchCountryByName(searchQuery)
    .then(data => {
      if (data.length > 10) {
        notification.tooMany();
      } else if (data.length > 1) {
        renderCountriesList(data);
        notification.moreLetters();
      } else if (data.length === 1) {
        renderCountryCard(data);
        notification.onSuccess();
      } else {
        clearInput();
        notification.notFound();
      }
    })
    .catch(notification.myError);
}

function renderCountryCard(country) {
  const markup = countryCardTpl(country);
  cardContainer.innerHTML = markup;
}

function renderCountriesList(countries) {
  const markup = countriesListTpl(countries);
  cardContainer.innerHTML = markup;
}

function clearInput() {
  cardContainer.innerHTML = '';
}
