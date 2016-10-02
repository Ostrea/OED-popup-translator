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


function populateTemplate(word: string, region: string,
    entries: Entry[]): void {
    const wordDefinitionDiv = document.getElementById("word-definition");
    wordDefinitionDiv.innerHTML = template({
        word: word, region: region, entries: entries
    });

    const audios = wordDefinitionDiv.getElementsByClassName("audio");
    Array.prototype.forEach.call(audios, audio => {
        audio.onclick = function () {
            this.firstElementChild.play();
        };
    });
}


function lookUpButtonHandler(): void {
    const word = (<HTMLInputElement>document
        .getElementById("word-to-look-up")).value;
    if (word === "") {
        return;
    }

    const region = <Region>(<HTMLSelectElement>document
        .getElementById("language")).value;
    lookUpWord(word, region, populateTemplate);
}
