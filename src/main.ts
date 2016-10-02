"use strict";


import { Region, Entry } from "./entry_classes";
import { lookUpWord } from "./oxford_dictionary_provider";


declare function template(templateArgs: Object): string;


export function main(): void {
    const inputField = <HTMLInputElement>document
        .getElementById("word-to-look-up");

    chrome.runtime.onMessage.addListener((request, sender) => {
        if (request.action === "selectedText") {
            inputField.value = request.source;
            lookUpButtonHandler();
        }
    });

    chrome.tabs.executeScript(null, { file: "content_bundle.js" }, () => {
        // If you try and inject into an extensions page
        // or the webstore/NTP you'll get an error.
        if (chrome.runtime.lastError) {
            alert("There was an error injecting script: \n"
                + chrome.runtime.lastError.message);
        }
    });

    document.getElementById("define-button").addEventListener("click",
        lookUpButtonHandler, false);

    inputField.addEventListener("keyup", (event: KeyboardEvent) => {
        const enterButtonCode = 13;
        if (event.keyCode === enterButtonCode) {
            lookUpButtonHandler();
        }
    }, false);

    inputField.focus();
    inputField.select();
}


function found(word: string, region: string, entries: Entry[]): void {

    function populateTemplate(word: string, region: string,
        entries: Entry[]): void {
        wordDefinitionDiv.innerHTML = template({
            word: word, region: region, entries: entries
        });
    }

    function setAudioHandlers() {
        const audios = wordDefinitionDiv.getElementsByClassName("audio");
        Array.prototype.forEach.call(audios, audio => {
            audio.onclick = function () {
                this.firstElementChild.play();
            };
        });
    }

    window.scroll(0, 0);

    const wordDefinitionDiv = document.getElementById("word-definition");

    populateTemplate(word, region, entries);

    setAudioHandlers();
}


function notFound(): void {
    const wordDefinitionDiv = document.getElementById("word-definition");
    wordDefinitionDiv.innerHTML = "Couldn't find word!";
}


function lookUpButtonHandler(): void {

    function convertRussianLettersToEnglishIfNecessary(): string {
        const russianLettersToEnglish = {
                "й": "q", "ц": "w", "у": "e", "к": "r", "е": "t",
                "н": "y", "г": "u", "ш": "i", "щ": "o", "з": "p",
                "ф": "a", "ы": "s", "в": "d", "а": "f", "п": "g",
                "р": "h", "о": "j", "л": "k", "д": "l", "я": "z",
                "ч": "x", "с": "c", "м": "v", "и": "b", "т": "n",
                "ь": "m"
            };
        const lowerCaseWord = word.toLowerCase();
        let result = "";
        for (let character of word) {
            if (russianLettersToEnglish[character]) {
                result += russianLettersToEnglish[character];
            } else {
                result += character;
            }
        }
        return result;
    }

    const input = <HTMLInputElement>document.getElementById("word-to-look-up");
    const word = input.value;
    if (word === "") {
        return;
    }
    const convertedWord = convertRussianLettersToEnglishIfNecessary();
    if (convertedWord !== word) {
        input.value = convertedWord;
    }

    const region = <Region>(<HTMLSelectElement>document
        .getElementById("language")).value;
    lookUpWord(convertedWord, region, found, notFound);
}
