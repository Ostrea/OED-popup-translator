"use strict";


import { Entry, Sense } from "./entry_classes";
import { lookUpWord } from "./oxford_dictionary_provider";


declare function template(templateArgs: Object): string;


export function main(): void {
    lookUpWord("hello", "us", populateTemplate);
}


function populateTemplate(entries: Entry[]): void {
    const wordDefinitionDiv = document.getElementById("word-definition");
    alert("Populate template!");
    // wordDefinitionDiv.innerHTML = template({
    //     word: "hello",
    //     region: "American", inWhichLanguageOtherUses: "Language or `also`",
    //     otherSpellings: ["hallo", "hullo"], definitions
    // });
}
