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

// فانکشنی برای ساخت کارت ها
function createCard(data) {
  const card = document.createElement("div");
  card.className = "card";
  card.id = data.id;
  card.addEventListener("click", (e) => {
    const cardId = e.currentTarget.id;

    history.pushState({ page: "movies", id: cardId }, "", `#movie-${cardId}`);

    mainSection.innerHTML = "slam";
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

// فانکشنی برای ساخت کارت های دیفالت هوم
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

// فانکشنی برای ساخت کارت های فیلم سرچ شده
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

function randomHeroImg(data) {
  const randomIndex = Math.floor(Math.random * data.length);
  // if (data[randomIndex].)
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
