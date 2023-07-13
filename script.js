const apiKey = "57ebc4ca";

async function searchMovies() {
  const searchInput = document.getElementById("searchInput");
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
    bookmarkIcon.onclick = () => addToFavourites(movie.imdbID);
    detailsBox.appendChild(bookmarkIcon);
  }

  if(showDeleteIcon) {
    const removeIcon = document.createElement('i');
    removeIcon.classList.add('fas','fa-trash');
    removeIcon.style.cursor = 'pointer';
    removeIcon.onclick = () => removeFromFavorites(movie.imdbID);
    detailsBox.appendChild(removeIcon);
  }

  movieDetails.appendChild(detailsBox);
  movieElement.appendChild(movieDetails);

  return movieElement;
}

function addToFavourites() {
  alert("Movie added to WatchList");
}

function removeFromFavorites() {
    alert("Movie removed from WatchList");
}