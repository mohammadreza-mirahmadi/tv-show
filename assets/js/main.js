const container = document.querySelector(".container");
const mainSection = document.querySelector("main");
const searchInput = document.querySelector(".search-input");
const searchIcon = document.querySelector(".search-icon");
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
// فانکشن برای گرفتن اطلاعات و رندر کردن محتوای هوم
async function getShows(url) {
  try {
    const res = await fetch(url);
    const data = await res.json();

    cardsLink.addEventListener("click", () => {
      renderCards(data);
    });
    renderHomeContent(data);

    // هندل کردن سرچ باکس
    searchInput.addEventListener("input", async (e) => {
      try {
        const inputValue = e.currentTarget.value.trim();
        if (!inputValue) {
          // اگر سرج باکس خالی باشه، همان حالت دیفالت رخ میدهد.
          cardsSection.innerHTML = "";
          cardsLink.style.display = "block";
          cardsSection.append(cardsLink);
          renderCardsCounter = 0;
          renderCards(data);
          return;
        }

        const SearchRes = await fetch(
          `https://api.tvmaze.com/search/shows?q=${inputValue}`
        );
        const searchData = await SearchRes.json();
        if (searchData.length !== 0) {
          // اگر فیلم سرچ شده پیدا بشه، با این فانکشن نمایش داده میشه
          renderSearchCard(searchData);
        } else {
          // اگر فیلم سرچ شده پیدا نشه
          cardsSection.innerHTML =
            "<p style='width: 100% !important; color: red; text-align: center;'>Your movie not exist.</p>";
          cardsLink.style.display = "none";
          cardsSection.append(cardsLink);
        }
      } catch (err) {
        document.querySelector("main").innerHTML =
          "<p style='color: red; text-align: center;'>Faild to load. Please try again later.1</p>";
        console.error(err);
      }
    });
  } catch (err) {
    document.querySelector("main").innerHTML =
      "<p style='color: red; text-align: center;'>Faild to load. Please try again later.2</p>";
  }
}

async function renderMovieEpisodes(id) {
  try {
    const episodeRes = await fetch(
      `https://api.tvmaze.com/shows/${id}/episodes`
    );
    const episodeData = await episodeRes.json();
    console.log(episodeData);
    mainSection.innerHTML = "";
    const parent = document.createElement("section");
    parent.className = "cards";
    mainSection.append(parent);
    episodeData.forEach((item) => {
      rendercardEpisodes(item, parent);
    });
  } catch (err) {
    mainSection.innerHTML =
      "<p style='color: red;'>It can't load episodes.</p>";
  }
}

function renderHomeContent(data) {
  const heroSection = document.createElement("section");
  heroSection.className = "hero-section";
  mainSection.insertAdjacentElement("afterbegin", heroSection);

  const divider = document.createElement("div");
  divider.className = "divider";
  heroSection.insertAdjacentElement("afterend", divider);
  const dividerText = document.createElement("p");
  dividerText.className = "divider__text";
  dividerText.textContent = "Movies";
  divider.append(dividerText);

  // ساختن کارت های فیلم ها در بخش هوم
  renderCards(data);
}

function createCard(data) {
  const card = document.createElement("div");
  card.className = "card";
  card.id = data.id;
  card.addEventListener("click", (e) => {
    const cardId = e.currentTarget.id;
    renderMovieEpisodes(cardId);
  });
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
  cardsLink.style.display = "none";
  cardsSection.append(cardsLink);
  data.forEach((item) => {
    if (!item.show.image) {
      return;
    }
    createCard(item.show);
  });
}

function rendercardEpisodes(data, parent) {
  const episode = document.createElement("div");
  episode.className = "episode";
  episode.addEventListener("mouseover", () => {
    summary.style.display = "block";
  });
  episode.addEventListener("mouseleave", () => {
    summary.style.display = "none";
  });
  episode.addEventListener("click", () => {
    location.href = data.url;
  });
  parent.append(episode);

  let summaryText = data.summary;
  if (summaryText.length > 254) {
    summaryText = summaryText.slice(0, 247) + "...</p>";
  }
  const summary = document.createElement("div");
  summary.className = "episode__summary";
  summary.innerHTML = summaryText;
  episode.append(summary);

  const episodeImg = document.createElement("img");
  episodeImg.className = "episode__img";
  episodeImg.src = data.image.medium;
  episodeImg.alt = data.name;
  episode.append(episodeImg);

  const episodeBody = document.createElement("div");
  episodeBody.className = "episode__body";
  episode.append(episodeBody);

  let number = null;
  if (data.season < 10) {
    if (data.number < 10) {
      number = `S0${data.season} - E0${data.number}`;
    } else {
      number = `S0${data.season} - E${data.nuber}`;
    }
  } else {
    if (data.number < 10) {
      number = `S${data.season} - E0${data.number}`;
    } else {
      number = `S${data.season} - E${data.nuber}`;
    }
  }

  const episodeTitle = document.createElement("p");
  episodeTitle.className = "episode__title";
  episodeTitle.textContent = `${number} ${data.name}`;
  episodeBody.append(episodeTitle);
  // console.log("check");

  const episodeBtn = document.createElement("div");
  episodeBtn.className = "episode__btn";
  episodeBody.append(episodeBtn);

  const episodeBtnIcon = document.createElement("img");
  episodeBtnIcon.className = "episode__icon";
  episodeBtnIcon.src = "./assets/img/play.png";
  episodeBtn.append(episodeBtnIcon);
}
// با صدا زدن این فانگشن، موقع لود سایت، هوم ساخته میشود.
getShows(url);

// getShows(url);
searchIcon.addEventListener("click", () => {
  if (searchInput.style.display === "block") {
    searchInput.focus();
    console.log("focus");
  }
});
const burgerMenu = document.querySelector(".burger-menu");
burgerMenu.addEventListener("click", (e) => {
  e.currentTarget.classList.toggle("open");
  if (e.currentTarget.classList.contains("open")) {
    e.currentTarget.children[0].src = "./assets/img/close.png";
    document.querySelector(".menu").style.left = "0";
  } else {
    e.currentTarget.children[0].src = "./assets/img/burger.png";
    document.querySelector(".menu").style.left = "-12rem";
  }
});
