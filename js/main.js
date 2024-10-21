/* Translations */

const translations = {
  en: {
    logoText: 'Image Gallery',
    logoSlogan: 'by Konstantin Petrov',
    searchPlaceholder: 'Search by keyword...',
    searchText: 'Search',
    templateColor: 'Template color',
    imageSize: 'Image size',
    warningText: 'Oops! No images found. We may have reached our hourly API limit or could not find any images matching your search. Please try a different query or check back in an hour. Meanwhile, enjoy some images from our own collection.',
    requestMoreText: 'Show more images',
    copyrightText: 'Copyright © 2024',
  },
  ru: {
    logoText: 'Фото Галлерея',
    logoSlogan: 'от Константина Петрова',
    searchPlaceholder: 'Ключевое слово...',
    searchText: 'Поиск',
    templateColor: 'Цвет темы',
    imageSize: 'Размер фото',
    warningText: 'Ой! Картинки не найдены. Возможно, мы достигли часового лимита API или не удалось найти изображения, соответствующие вашему запросу. Попробуйте другой запрос или вернитесь через час. Тем временем наслаждайтесь изображениями из нашей коллекции.',
    requestMoreText: 'Показать больше изображений',
    copyrightText: 'Авторское право © 2024',
  }
};

/* Emergency array of photos */

const emergencyImages = [
  {
    id: 'x0000000001',
    name: 'Autumn',
    alt_description: 'A serene autumn landscape with vibrant fall colors.',
    url: 'assets/images/autumn.jpg'
  },
  {
    id: 'x0000000002',
    name: 'Dark forest',
    alt_description: 'A mysterious, dark forest bathed in shadows and mist.',
    url: 'assets/images/darkforest.jpg'
  },
  {
    id: 'x0000000003',
    name: 'Historic city',
    alt_description: 'An ancient city with historic architecture and narrow streets.',
    url: 'assets/images/historiccity.jpg'
  },
  {
    id: 'x0000000004',
    name: 'Wolf',
    alt_description: 'A majestic wolf standing proudly in a natural setting.',
    url: 'assets/images/wolf.jpg'
  },
  {
    id: 'x0000000005',
    name: 'Spring',
    alt_description: 'A vibrant spring scene with blossoming flowers and bright greenery.',
    url: 'assets/images/spring.jpg'
  },
  {
    id: 'x0000000006',
    name: 'Dungeon',
    alt_description: 'A dark, eerie dungeon with stone walls and dim lighting.',
    url: 'assets/images/dungeon.jpg'
  },
  {
    id: 'x0000000007',
    name: 'Underworld',
    alt_description: 'A mystical underworld landscape with glowing lights and surreal colors.',
    url: 'assets/images/underworld.jpg'
  },
  {
    id: 'x0000000008',
    name: 'Winter',
    alt_description: 'A cold winter scene with snow-covered trees and a tranquil atmosphere.',
    url: 'assets/images/winter.jpg'
  },
  {
    id: 'x0000000009',
    name: 'Woman',
    alt_description: 'A portrait of a woman in a calm and natural environment.',
    url: 'assets/images/woman.jpg'
  },
  {
    id: 'x0000000010',
    name: 'Mountains',
    alt_description: 'Breathtaking mountains with peaks covered in snow and a clear sky.',
    url: 'assets/images/mountains.jpg'
  },
  {
    id: 'x0000000011',
    name: 'Birds',
    alt_description: 'A flock of birds soaring through the sky in unison.',
    url: 'assets/images/birds.jpg'
  },
  {
    id: 'x0000000012',
    name: 'Summer',
    alt_description: 'A sunny summer day with clear skies and lush green landscapes.',
    url: 'assets/images/summer.jpg'
  }
];

/* Shuffle array of with the Fisher–Yates */

function shuffle(array) {
  let currentIndex = array.length; 
  while (currentIndex != 0) {  
    let randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--; 
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }
  return array;
}

/* Request photos via unsplash API */

let url = 'https://api.unsplash.com/search/photos?query=nature&per_page=30&orientation=landscape&client_id=FxZY4UTxT-kJuANjPorZ5zeArfqlEpNCLEk4ejZHB-w';
const galleryList = document.querySelector('.gallery__list');
let photoArray = [];

async function getPhotos(url) {
  try {
    const res = await fetch(url);
    const data = await res.json();
    if (data.results.length > 0) {
      photoArray = shuffle(data.results); 
      galleryList.innerHTML = '';
      populateList(photoArray);
      showRequestMore();
    } else {
      galleryList.innerHTML = '';
      showWarning();
      populateEmergencyList(emergencyImages);
    }
  } catch (error) {
    console.error('Error:', error);
    galleryList.innerHTML = '';
    showWarning();
    populateEmergencyList(emergencyImages);
  }
}

getPhotos(url);

/* Populate list with API images */ 

let currentPage = 1;

function populateList(photos) {
  for (let i = (currentPage - 1) * 12; i < (currentPage * 12) && i < photos.length; i += 1) {
    const item = document.createElement('li');
    item.classList.add('gallery__item');
    const imageContainer = document.createElement('div');
    imageContainer.classList.add('gallery__image-container');
    const image = document.createElement('img');
    image.classList.add('gallery__image');
    image.alt = photos[i].alt_description;
    image.src = photos[i].urls.regular;
    image.dataset.imageId = photos[i].id;
    const button = document.createElement('button');
    button.classList.add('download__button');
    button.dataset.imageId = photos[i].id;
    imageContainer.appendChild(image);
    imageContainer.appendChild(button);
    item.appendChild(imageContainer);
    galleryList.appendChild(item);

    button.addEventListener('click', async () => {
      try {
        url = `${photos[i].links.download_location}&client_id=FxZY4UTxT-kJuANjPorZ5zeArfqlEpNCLEk4ejZHB-w`;
        const res = await fetch(url);
        const data = await res.json();
        if (data.url) {
          const imageRes = await fetch(data.url);
          const imageBlob = await imageRes.blob();
          const url = URL.createObjectURL(imageBlob);        
          const link = document.createElement('a');
          link.href = url;
          link.download = '';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
        } 
      } catch (error) {
        console.error('Error:', error);
      }
    });

    setTimeout(() => {
      image.classList.add('gallery-image_visible');
    }, 100);
  }

  if (Math.floor(photoArray.length / currentPage) < 12) {
    hideRequestMore();
  }
}

/* Request more button */

const requestMore = document.querySelector('.more-request')

function showRequestMore () {
  setTimeout(() => {
    requestMore.classList.add('more-request__visible');
  }, 100);
}

function hideRequestMore () {
  requestMore.classList.remove('more-request__visible');
}

requestMore.addEventListener('click', () => {
  currentPage = currentPage += 1;
  populateList(photoArray);
});

/* Populate list with emergency images */

const websiteBody = document.querySelector('.body');

function populateEmergencyList(photos) {
  hideRequestMore();

  photoArray = shuffle(photos);
  for (let i = 0; i < 12 && i < photoArray.length; i += 1) {
    const item = document.createElement('li');
    item.classList.add('gallery__item');
    const imageContainer = document.createElement('div');
    imageContainer.classList.add('gallery__image-container');
    const image = document.createElement('img');
    image.classList.add('gallery__image');
    image.alt = photoArray[i].alt_description;
    image.src = photoArray[i].url;
    image.dataset.imageId = photoArray[i].id;
    const button = document.createElement('button');
    button.classList.add('download__button');
    button.dataset.imageId = photoArray[i].id;
    imageContainer.appendChild(image);
    imageContainer.appendChild(button);
    item.appendChild(imageContainer);
    galleryList.appendChild(item);

    button.addEventListener('click', () => {
      const imageId = button.dataset.imageId;
      const image = photoArray.find(image => image.id === imageId);
      const link = document.createElement('a');
      link.href = image.url;
      link.download = `${image.name}.jpg`;
      websiteBody.appendChild(link);
      link.click();
      websiteBody.removeChild(link);
    });

    setTimeout(() => {
      image.classList.add('gallery-image_visible');
    }, 100);
  }
}

/* Handle search request */

const searchForm = document.querySelector('.search__form');
const searchButton = document.querySelector('.search-submit')

searchForm.addEventListener('submit', async (event) => {
  event.preventDefault(); 
  const query = event.target.search.value;
  url = `https://api.unsplash.com/search/photos?query=${query}&per_page=30&orientation=landscape&client_id=FxZY4UTxT-kJuANjPorZ5zeArfqlEpNCLEk4ejZHB-w`;
  closeWarning();
  hideRequestMore();
  searchButton.classList.add('search-submit__loading');
  currentPage = 1;
  await getPhotos(url);
  searchButton.classList.remove('search-submit__loading');
});

/* Clear search request */

const clearSearch = document.querySelector('.clear-search');
const searchField = document.querySelector('.search');

searchField.addEventListener('input', (event) => {
  if (event.target.value !== '') {
    clearSearch.classList.add('clear-search__visible');
  } else {
    clearSearch.classList.remove('clear-search__visible');
  }
});

clearSearch.addEventListener('click', () => {
  searchField.value = '';
  clearSearch.classList.remove('clear-search__visible');
});

/* Show/close warning */

const galleryWarning = document.querySelector('.gallery__warning');
const closePopup = document.querySelector('.close-popup');

function showWarning() {
  galleryWarning.classList.add('gallery__warning_active');
}

function closeWarning() {
  galleryWarning.classList.remove('gallery__warning_active');
}

closePopup.addEventListener('click', () => {
  closeWarning();
});

/* Change image size */

const smallImages = document.querySelector('.small-images');
const defaultImages = document.querySelector('.default-images');
const bigImages = document.querySelector('.big-images');

smallImages.addEventListener('click', () => {
  galleryList.classList.remove('gallery__list_default');
  galleryList.classList.remove('gallery__list_big');
  galleryList.classList.add('gallery__list_small');
});

defaultImages.addEventListener('click', () => {
  galleryList.classList.remove('gallery__list_small');
  galleryList.classList.remove('gallery__list_big');
  galleryList.classList.add('gallery__list_default');
});

bigImages.addEventListener('click', () => {
  galleryList.classList.remove('gallery__list_small');
  galleryList.classList.remove('gallery__list_default');
  galleryList.classList.add('gallery__list_big');
});

/* Change template */

const lightTemplate = document.querySelector('.light-color');
const defaultTemplate = document.querySelector('.default-color');
const darkTemplate = document.querySelector('.dark-color');
const websiteHeader = document.querySelector('.header')
const logoName = document.querySelector('.logo-name');
const filterTitle = document.querySelectorAll('.filter__title');
const websiteFooter = document.querySelector('.footer');
const copyrightLink = document.querySelector('.copyright-link');
const languageDropdown = document.querySelector('.language__dropdown');

function applyTheme(theme) {
  websiteBody.classList.remove('light-template', 'default-template', 'dark-template');
  websiteHeader.classList.remove('header__light', 'header__default', 'header__dark');
  logoName.classList.remove('logo-name__light', 'logo-name__default', 'logo-name__dark');
  searchField.classList.remove('search__light', 'search__default', 'search__dark');
  clearSearch.classList.remove('clear-search__light', 'clear-search__default', 'clear-search__dark');
  searchButton.classList.remove('search-submit__light', 'search-submit__default', 'search-submit__dark');
  filterTitle.forEach((title) => {
    title.classList.remove('title__light', 'title__default', 'title__dark');
  });
  galleryWarning.classList.remove('gallery__warning_light', 'gallery__warning_default', 'gallery__warning_dark');
  closePopup.classList.remove('close-popup__light', 'close-popup__default', 'close-popup__dark');
  websiteFooter.classList.remove('footer__dark', 'footer__default', 'footer__light');
  copyrightLink.classList.remove('copyright-link__light', 'copyright-link__default', 'copyright-link__dark');
  languageDropdown.classList.remove('language__dropdown_light', 'language__dropdown_default', 'language__dropdown_dark');
  websiteBody.classList.add(`${theme}-template`);
  websiteHeader.classList.add(`header__${theme}`);
  logoName.classList.add(`logo-name__${theme}`);
  searchField.classList.add(`search__${theme}`);
  clearSearch.classList.add(`clear-search__${theme}`);
  searchButton.classList.add(`search-submit__${theme}`);
  filterTitle.forEach((title) => {
    title.classList.add(`title__${theme}`);
  });
  galleryWarning.classList.add(`gallery__warning_${theme}`);
  closePopup.classList.add(`close-popup__${theme}`);
  websiteFooter.classList.add(`footer__${theme}`);
  copyrightLink.classList.add(`copyright-link__${theme}`);
  languageDropdown.classList.add(`language__dropdown_${theme}`);
}

lightTemplate.addEventListener('click', () => applyTheme('light'));
defaultTemplate.addEventListener('click', () => applyTheme('default'));
darkTemplate.addEventListener('click', () => applyTheme('dark'));

/* Change language */

const languageSelector = document.getElementById('selectLanguage');
const logoText = document.getElementById('logoText');
const logoSlogan = document.getElementById('logoSlogan');
const searchInput = document.getElementById('searchInput');
const searchText = document.getElementById('searchText');
const templateColor = document.getElementById('templateColor');
const imageSize = document.getElementById('imageSize');
const requestMoreText = document.getElementById('requestMoreText');
const warningText = document.getElementById('warningText');
const copyrightText = document.getElementById('copyrightLink');

function updateTexts(language) {
  logoText.textContent = translations[language].logoText;
  logoSlogan.textContent = translations[language].logoSlogan;
  searchInput.placeholder = translations[language].searchPlaceholder;
  searchText.textContent = translations[language].searchText;
  templateColor.textContent = translations[language].templateColor;
  imageSize.textContent = translations[language].imageSize;
  requestMoreText.textContent = translations[language].requestMoreText;
  warningText.textContent = translations[language].warningText;
  copyrightText.textContent = translations[language].copyrightText;
}

window.addEventListener('DOMContentLoaded', () => {
  const selectedLanguage = languageSelector.value;
  updateTexts(selectedLanguage);
});

languageSelector.addEventListener('change', (event) => {
  const selectedLanguage = event.target.value;
  updateTexts(selectedLanguage);
});