const apiKey = "57ebc4ca";

const searchInput = document.getElementById("searchInput");

searchInput.addEventListener('input',searchMovies);

async function searchMovies(event) {
  const searchTerm = searchInput.value.trim();

  if (searchTerm !== "") {
    const searchResultContainer = document.getElementById(
      "searchResultsContainer"
    );
    searchResultContainer.innerHTML = "";

    const url = `https://www.omdbapi.com/?s=${searchTerm}&apikey=${apiKey}`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      if (data.Response === "True" && data.Search) {
        for (const movie of data.Search) {
          const movieElement = createMovieElement(movie, true, false);
          searchResultContainer.appendChild(movieElement);
        }
      } else {
        searchResultContainer.innerHTML = "<p>No results found.</p>";
      }
    } catch (error) {
      console.log(error);
      searchResultContainer.innerHTML =
        "<p>Error occurred. Please try again later.</p>";
    }
  }
}

function createMovieElement(
  movie,
  showBookmarkIcon = true,
  showDeleteIcon = true
) {
  const movieElement = document.createElement("div");
  movieElement.classList.add("movie-item");

  const moviePoster = document.createElement("div");
  moviePoster.classList.add("fav-poster");

  const posterImage = document.createElement("img");
  posterImage.src =
    movie.Poster !== "N/A"
      ? movie.Poster
      : "https://upload.wikimedia.org/wikipedia/commons/f/f9/No-image-available.jpg";
  posterImage.alt = movie.Title;

  moviePoster.appendChild(posterImage);
  movieElement.appendChild(moviePoster);

  const movieDetails = document.createElement("div");
  movieDetails.classList.add("fav-details");

  const detailsBox = document.createElement("div");
  detailsBox.classList.add("fav-details-box");

  const detailsContent = document.createElement("div");

  const movieTitle = document.createElement("p");
  const movieTitleLink = document.createElement("a");
  movieTitleLink.href = `movie.html?id=${movie.imdbID}`;
  movieTitleLink.textContent = movie.Title;
  movieTitle.appendChild(movieTitleLink);
  detailsContent.appendChild(movieTitle);

  const movieYear = document.createElement("p");
  movieYear.textContent = movie.Year;
  detailsContent.appendChild(movieYear);

  detailsBox.appendChild(detailsContent);

  if (showBookmarkIcon) {
    const bookmarkIcon = document.createElement("i");
    bookmarkIcon.classList.add("fas", "fa-bookmark");
    bookmarkIcon.style.cursor = "pointer";
    bookmarkIcon.onclick = () => addToFavorites(movie.imdbID);
    detailsBox.appendChild(bookmarkIcon);
  }

  if (showDeleteIcon) {
    const removeIcon = document.createElement("i");
    removeIcon.classList.add("fas", "fa-trash");
    removeIcon.style.cursor = "pointer";
    removeIcon.onclick = () => removeFromFavorites(movie.imdbID);
    detailsBox.appendChild(removeIcon);
  }

  movieDetails.appendChild(detailsBox);
  movieElement.appendChild(movieDetails);

  return movieElement;
}

function addToFavorites(movieID) {
  const favorites = JSON.parse(localStorage.getItem("favorites")) || [];

  if (!favorites.includes(movieID)) {
    favorites.push(movieID);
    localStorage.setItem("favorites", JSON.stringify(favorites));
    alert("Movie added to Watchlist");
    loadFavorites();
  } else {
    removeFromFavorites(movieID);
  }
}

function removeFromFavorites(movieID) {
  const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
  const index = favorites.indexOf(movieID);

  if (index > -1) {
    favorites.splice(index, 1);
    localStorage.setItem("favorites", JSON.stringify(favorites));
    alert("Movie removed from Watchlist");
    loadFavorites();
  }
}

async function loadFavorites() {
  const favoritesContainer = document.getElementById("favoriteMovies");
  favoritesContainer.innerHTML = "";

  const favorites = JSON.parse(localStorage.getItem("favorites")) || [];

  if (favorites.length > 0) {
    for (const movieID of favorites) {
      const movie = await fetchMovieById(movieID);

      if (movie) {
        const movieElement = createMovieElement(movie, false);
        favoritesContainer.appendChild(movieElement);
      }
    }
  } else {
    favoritesContainer.innerHTML = "<p>No Favorite Movies Found</p>";
  }
}

async function fetchMovieById(movieID) {
  const url = `https://www.omdbapi.com/?i=${movieID}&apikey=${apiKey}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.Response === "True") {
      return data;
    }
  } catch (error) {
    console.log(error);
  }
  return null;
}

async function getMovieDetails() {
  const urlParams = new URLSearchParams(window.location.search);
  const movieID = urlParams.get("id");

  if (movieID) {
    const movie = await fetchMovieById(movieID);

    if (movie) {
      const movieDetailsContainer = document.getElementById("movieDetails");
      movieDetailsContainer.innerHTML = "";

      const movieTitle = document.createElement("h2");
      movieTitle.textContent = movie.Title;
      movieDetailsContainer.appendChild(movieTitle);

      const moviePoster = document.createElement("img");
      moviePoster.src =
        movie.Poster !== "N/A" ? movie.Poster : "img/blank-poster.webp";
      moviePoster.alt = movie.Title;
      movieDetailsContainer.appendChild(moviePoster);

      const movieInfo = document.createElement("div");
      movieInfo.classList.add("movie-info");

      const movieRating = document.createElement("p");
      movieRating.textContent = `IMDb Rating: ${movie.imdbRating}`;
      movieInfo.appendChild(movieRating);

      const movieGenre = document.createElement("p");
      movieGenre.textContent = `Genre: ${movie.Genre}`;
      movieInfo.appendChild(movieGenre);

      const moviePlot = document.createElement("p");
      moviePlot.textContent = `Plot: ${movie.Plot}`;
      movieInfo.appendChild(moviePlot);

      movieDetailsContainer.appendChild(movieInfo);
    } else {
      const movieDetailsContainer = document.getElementById("movieDetails");
      movieDetailsContainer.innerHTML = "<p>Movie details not found.</p>";
    }
  } else {
    const movieDetailsContainer = document.getElementById("movieDetails");
    movieDetailsContainer.innerHTML = "<p>Invalid movie ID.</p>";
  }
}

document
  .getElementById("searchInput")
  .addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      searchMovies();
    }
  });

window.onload = function () {
  const currentLocation = window.location.pathname;
  if (currentLocation.includes("movie.html")) {
    getMovieDetails();
  } else if (currentLocation.includes("favorite.html")) {
    loadFavorites();
  }
};
