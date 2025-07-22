const container = document.querySelector(".container");
const searchInpput = document.querySelector(".search-input");
const url = "https://api.tvmaze.com/shows";
let renderCardsCounter = 0;

const cardsSection = document.createElement("section");
cardsSection.className = "cards";
document.querySelector("main").append(cardsSection);

const cardsLink = document.createElement("p");
cardsLink.className = "cards__link";
cardsLink.textContent = "more...";
cardsSection.append(cardsLink);

// functions

async function getShows(url) {
  try {
    const res = await fetch(url);
    const data = await res.json();

    cardsLink.addEventListener("click", () => {
      renderCards(data);
    });

    renderCards(data);

    searchInpput.addEventListener("input", async (e) => {
      try {
        const inputValue = e.currentTarget.inputValue;
        if (inputValue) {
          console.log("f");
          renderCards(data);
          return;
        }

        const SearchRes = await fetch(
          `https://api.tvmaze.com/search/shows?q=${inputValue}`
        );
        const searchData = await SearchRes.json();
        console.log(searchData);
        renderSearchCard(searchData);
      } catch (err) {
        document.querySelector("main").innerHTML =
          "<p style='color: red; text-align: center;'>Faild to load. Please try again later.</p>";
      }
    });
  } catch (err) {
    document.querySelector("main").innerHTML =
      "<p style='color: red; text-align: center;'>Faild to load. Please try again later.</p>";
  }
}

function createCard(data) {
  const card = document.createElement("div");
  card.className = "card";
  card.addEventListener("click", () => {});
  cardsLink.insertAdjacentElement("beforebegin", card);

  const cardImg = document.createElement("img");
  cardImg.className = "card__img";
  cardImg.src = data.image.medium;
  cardImg.alt = data.name;
  card.append(cardImg);

  const cardBody = document.createElement("div");
  cardBody.className = "card__body";
  card.append(cardBody);

  const cardTitle = document.createElement("h3");
  cardTitle.className = "card__title";
  cardTitle.textContent = data.name;
  cardBody.append(cardTitle);

  const cardGenres = document.createElement("p");
  cardGenres.className = "card__genres";
  cardGenres.textContent = data.genres.join(" | ");
  cardBody.append(cardGenres);

  const cardRating = document.createElement("p");
  cardRating.className = "card__rating";
  cardRating.textContent = data.rating.average;
  cardBody.append(cardRating);
}

function renderCards(data) {
  renderCardsCounter++;
  let dataSliceMax = renderCardsCounter * 40;
  let dataSlice = null;
  if (renderCardsCounter === "stop") {
    return;
  } else {
    dataSlice = data.slice(dataSliceMax - 40, dataSliceMax);
    if (dataSliceMax > data[data.length - 1].id) {
      renderCardsCounter = "stop";
    }
  }
  if (!dataSlice) {
    return;
  }
  dataSlice.forEach((item) => {
    createCard(item);
  });
}

function renderSearchCard(data) {
  cardsSection.innerHTML = "";
  data.forEach((item) => {
    createCard(item.show);
  });
}

getShows(url);
