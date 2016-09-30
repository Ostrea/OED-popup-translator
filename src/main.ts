"use strict";


import { Entry, Sense } from "./entry_classes";
import { lookUpWord } from "./oxford_dictionary_provider";


declare function template(templateArgs: Object): string;


export function main(): void {
    lookUpWord("hello", "us", populateTemplate);
}


function populateTemplate(word: string, region: string,
    entries: Entry[]): void {
    const wordDefinitionDiv = document.getElementById("word-definition");
    wordDefinitionDiv.innerHTML = template({
        word: word, region: region, entries: entries
        // region: "American", inWhichLanguageOtherUses: "Language or `also`",
        // otherSpellings: ["hallo", "hullo"], definitions
    });

    const audios = wordDefinitionDiv.getElementsByClassName("audio");
    Array.prototype.forEach.call(audios, audio => {
        audio.onclick = function () {
            this.firstElementChild.play();
        };

    });
}
