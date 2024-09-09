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
  searchInput.value = searchInput.value
    .trim()
    .replaceAll(" ", "-")
    .toLowerCase();
};

const searchForWord = async function (e) {
  e.preventDefault();
  wordContainer.innerHTML = ""; // Clean the word container
  list.innerHTML = ""; // Clean the list of definitions

  if (!searchInput.value) {
    return alert("Please enter a word");
  }

  cleanWord();

  try {
    const data = await API.get(`${searchInput.value}`);

    // Get first word and phonetic (if exists)
    if (data.length > 0) {
      const firstEntry = data[0];

      // Add word and phonetic info to container
      wordContainer.insertAdjacentHTML(
        "beforeend",
        `<h1 class="word">${firstEntry.word} ${
          firstEntry?.phonetic ?? ""
        }</h1><button class="listen-btn"><i class="fa-solid fa-volume-high"></i></button>`
      );

      // Add event listener to the button for playing audio
      const playAudio = function () {
        const audioSrc = firstEntry.phonetics[0]?.audio;
        if (audioSrc) {
          const audioEl = new Audio(audioSrc);
          audioEl.play();
        } else {
          alert("No audio available for this word.");
        }
      };

      document
        .querySelector(".listen-btn")
        .addEventListener("click", playAudio);
    }

    // Add unique definitions to the list
    const definitionsSet = new Set();

    data.forEach((entry) => {
      entry.meanings.forEach((meaning) => {
        meaning.definitions.forEach((definition) => {
          if (!definitionsSet.has(definition.definition)) {
            definitionsSet.add(definition.definition);
            list.insertAdjacentHTML(
              "beforeend",
              `<li class="definitions">${definition.definition}</li>`
            );
          }
        });
      });
    });
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

// Event listeners
form.addEventListener("submit", searchForWord);
searchBtn.addEventListener("click", searchForWord);
