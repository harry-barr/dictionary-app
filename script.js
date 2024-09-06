import FetchWrapper from "./fetch-wrapper.js";
const searchBtn = document.querySelector(".search-btn");
const wordContainer = document.querySelector(".word-container");
const searchInput = document.querySelector(".search");
const API = new FetchWrapper(
  "https://api.dictionaryapi.dev/api/v2/entries/en/"
);

const cleanWord = function () {
  searchInput.value.trim().replaceAll(" ", "-").toLowerCase();
};

const searchForWord = async function () {
  wordContainer.innerHTML = "";
  if (!searchInput.value) {
    return alert("Please enter a word");
  } else {
    cleanWord();
  }
  try {
    const data = await API.get(`${searchInput.value}`);
    data.forEach((d) => {
      console.log(d.word);
      wordContainer.insertAdjacentHTML(
        "beforeend",
        `<h1 class="word">${d.word}    :     ${d.phonetic}</h1>`
      );
    });
    data.forEach((d) => {
      console.log(d.meanings);
      d.meanings.forEach((l) => {
        console.log(l.definitions);
        l.definitions.forEach((b) => {
          console.log(b.definition);
          wordContainer.insertAdjacentHTML(
            "beforeend",
            `<p class="defintions">${b.definition}</p>`
          );
        });
      });
    });
  } catch (error) {
    console.error(error);
  }
};
searchBtn.addEventListener("click", searchForWord);
