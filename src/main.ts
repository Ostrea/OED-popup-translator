"use strict";


import { Entry, Sense } from "./entry_classes";
import { lookUpWord } from "./oxford_dictionary_provider";


declare function template(templateArgs: Object): string;


export function main(): void {
    lookUpWord("hello", "us", populateTemplate);

    // const definitions = [
    //     new Entry("Exclamation", [
    //         new Sense(
    //             "Used as a greeting or to begin a telephone conversation.",
    //             [new Sense("Used to express surprise", undefined, "British")]
    //         )
    //     ]), new Entry("Verb", [
    //         new Sense("Say or shout “hello”; greet someone.")
    //     ], "[NO OBJECT]")
    // ];
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
