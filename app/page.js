"use client";

import styles from "./page.module.css";
import isWordClose from "./word-distance";
import React, { useState, useEffect } from "react";
const axios = require("axios").default;

// create a npm package with all "most commom english word" from my repo in GH

export default function Home() {
  const [hasFoundWord, setHasFoundWord] = useState(false);
  const [guesses, setGuesses] = useState([]);
  const [userMessage, setUserMessage] = useState("");
  const [randomWord, setRandomWord] = useState("");
  const [dictionaryEntry, setDictionaryEntry] = useState({});

  const [definition, setDefinition] = useState("");

  const clearFields = () => {
    setHasFoundWord(false);
    setGuesses([]);
    setUserMessage("");
    document.getElementById("userInput").value = "";
  };

  const updateWord = () => {
    clearFields();
    const randomWordsApiUrl = "https://random-word-api.herokuapp.com/word";
    const dictionaryApiUrl = "https://api.dictionaryapi.dev/api/v2/entries/en/";
    axios
      .get(randomWordsApiUrl)
      .then((res) => {
        const newWord = res.data[0];
        axios
          .get(dictionaryApiUrl + newWord)
          .then((resDict) => {
            const dictionaryDefinition = resDict.data[0];
            setRandomWord(newWord);
            setDictionaryEntry(dictionaryDefinition);
            extractDefinition(dictionaryDefinition);
          })
          .catch(function (error) {
            updateWord();
            console.error(error);
          });
      })
      .catch(function (error) {
        console.error(error);
      });
  };

  const extractDefinition = (dict) => {
    const partOfSpeech = dict.meanings[0].partOfSpeech;
    const definition = dict.meanings[0].definitions[0].definition;

    setDefinition(`${partOfSpeech}: ${definition}`);
  };

  useEffect(updateWord, []);

  function handleKeyPress(e) {
    if (e.keyCode === 13) {
      if (hasFoundWord) return;
      let word = e.target.value;
      if (word === randomWord) {
        setHasFoundWord(true);
        setUserMessage("");
      } else {
        if (!guesses.map(x => x.word).includes(word)) {
          const isClose = isWordClose(word, randomWord);
          setGuesses([{ "word": word, "isClose": isClose }, ...guesses]);
          setUserMessage("");
        } else {
          setUserMessage(`${word} was already guessed! Try again.`);
        }
        e.target.value = "";
      }
    }
  }

  return (
    <main className={styles.main}>
      {hasFoundWord && (
        <div className={styles.noOverflow}>
          <div className={styles.firework}></div>
          <div className={styles.firework}></div>
          <div className={styles.firework}></div>
        </div>
      )}
      <h1 className={styles.title}>Guess the word</h1>

      <div>
        <p className={styles.definitionTitle}>Definition</p>
        <p className={styles.definition}>{definition}</p>
      </div>

      <div className={styles.userInputDiv}>
        <input
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck="false"
          id="userInput"
          className={styles.userInput}
          type="text"
          onKeyDown={(e) => handleKeyPress(e)}
        />
        <p>{userMessage}</p>
      </div>

      {hasFoundWord && (
        <div className={styles.getNewWordDiv}>
          <p className={styles.victory}>Correct! The word is {randomWord}!</p>
          <p>
            <button className={styles.getNewWordButton} onClick={updateWord}>
              New word
            </button>
          </p>
        </div>
      )}

      <div className={styles.guess}>
        <ul>
          {guesses.length > 0 && guesses.map((g) => <li key={g.word}>{g.word} {g.isClose && <span> is close!</span>}</li>)}
        </ul>
      </div>

    </main>
  );
}
