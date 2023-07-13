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
        console.log(data);
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
