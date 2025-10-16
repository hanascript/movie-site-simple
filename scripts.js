const moviesList = document.querySelector('.movies-list');
const searchInput = document.querySelector('.cta-search input');
const searchIcon = document.querySelector('.cta-search-icon');
const searchResultsText = document.querySelector('.movies-search-results');
const navbarIcon = document.querySelector('.navbar-search');
const navbarInput = document.querySelector('.navbar-input');
const loadingSpinner = document.querySelector('.movie-list-loading');

const defaultMovieSearch = ['pokemon', 'avengers', 'pirates', 'minions'];

function grabRandomMovie() {
  const randomIndex = Math.floor(Math.random() * defaultMovieSearch.length);
  return defaultMovieSearch[randomIndex];
}

async function fetchMovies(searchTerm = null) {
  let searchQuery = searchTerm || grabRandomMovie();

  const response = await fetch(`https://www.omdbapi.com/?apikey=18a085e&s=${searchQuery}`);

  const data = await response.json();

  if (data.Response === 'False') {
    return [];
  }

  console.log(data);

  return data.Search.slice(0, 6);
}

async function renderMovies(searchTerm = null) {
  if (searchTerm) {
    moviesList.innerHTML = '<i class="fa-solid fa-spinner movie-list-loading"></i>';
    loadingSpinner.style.display = 'block';
  }

  const movies = await fetchMovies(searchTerm);

  loadingSpinner.style.display = 'none';

  if (searchTerm) {
    searchResultsText.textContent = `"${searchTerm}"`;
    searchResultsText.style.display = 'block';
  } else {
    searchResultsText.textContent = '""';
    searchResultsText.style.display = 'none';
  }

  if (movies.length === 0) {
    moviesList.innerHTML = `<p class='no-results'>No movies found. Try a different search.</p>`;
    return;
  }

  const moviesListHTML = movies
    .map(movie => {
      return `
   <div class='movie-item'>
      <figure class='movie-image-wrapper'>
        <img src=${movie.Poster} alt='movie-poster' />
        <h3 class='movie-info-title'>${movie.Title}</h3>
        <div class='movie-info-list'>
          <div class='movie-info'>
            <i class='fa-solid fa-clock'></i>
            <p>136m</p>
          </div>
          <div class='movie-info'>
            <i class='fa-solid fa-star'></i>
            <p>4.5</p>
          </div>
          <div class='movie-info'>
            <i class='fa-solid fa-earth-americas'></i>
            <p>English</p>
          </div>
        </div>
      </figure>
      <h4 class='movie-title'>${movie.Title}</h4>
    </div>
    `;
    })
    .join('');

  moviesList.innerHTML = moviesListHTML;
}

function performSearch() {
  const searchTerm = searchInput.value.trim();
  if (searchTerm) {
    renderMovies(searchTerm);
  }
}

searchIcon.addEventListener('click', performSearch);

searchInput.addEventListener('keypress', e => {
  if (e.key === 'Enter') {
    const searchTerm = searchInput.value.trim();
    if (searchTerm) {
      renderMovies(searchTerm);
    }
  }
});

navbarIcon.addEventListener('click', () => navbarInput.focus());

navbarInput.addEventListener('keypress', e => {
  if (e.key === 'Enter') {
    const searchTerm = navbarInput.value.trim();
    if (searchTerm) {
      renderMovies(searchTerm);
    }
  }
});

renderMovies();
