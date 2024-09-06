import FetchWrapper from "./fetch-wrapper.js";
const searchBtn = document.querySelector(".search-btn");
const wordContainer = document.querySelector(".word-container");
const searchInput = document.querySelector(".search");
const form = document.querySelector(".input");
const list = document.querySelector(".list");
const API = new FetchWrapper(
  "https://api.dictionaryapi.dev/api/v2/entries/en/"
);

const cleanWord = function () {
  searchInput.value.trim().replaceAll(" ", "-").toLowerCase();
};

const searchForWord = async function (e) {
  e.preventDefault();
  wordContainer.innerHTML = "";
  list.innerHTML = "";
  if (!searchInput.value) {
    return alert("Please enter a word");
  } else {
    cleanWord();
  }
  try {
    const data = await API.get(`${searchInput.value}`);
    data.forEach((d) => {
      console.log(d);
    });
    const playAudio = function () {
      data.forEach((d) => {
        const audioSrc = d.phonetics[0].audio;
        const audioEl = document.createElement("audio");
        audioEl.setAttribute("src", `${audioSrc}`);
        audioEl.setAttribute("autoplay", "autoplay");
      });
    };
    data.forEach((d) => {
      wordContainer.insertAdjacentHTML(
        "beforeend",
        `<h1 class="word">${d.word} ${
          d?.phonetic ?? ""
        }</h1><button class="listen-btn""><i class="fa-solid fa-volume-high"></i></button>`
      );
      document
        .querySelector(".listen-btn")
        .addEventListener("click", playAudio);
    });
    data.forEach((d) => {
      d.meanings.forEach((l) => {
        l.definitions.forEach((b) => {
          list.insertAdjacentHTML(
            "beforeend",
            `<li class="defintions">${b.definition}</li>`
          );
        });
      });
    });
  } catch (error) {
    console.error(error);
  }
};
form.addEventListener("submit", searchForWord);
searchBtn.addEventListener("click", searchForWord);
