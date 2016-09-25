"use strict";


import { Entry, Sense } from "./entry_classes";


declare function template(templateArgs: Object): string;


export function main(): void {
    const definitions = [
        new Entry("Exclamation", [
            new Sense(
                "Used as a greeting or to begin a telephone conversation.",
                [new Sense("Used to express surprise", undefined, "British")]
            )
        ]), new Entry("Verb", [
            new Sense("Say or shout “hello”; greet someone.")
        ], "[NO OBJECT]")
    ];

    const wordDefinitionDiv = document.getElementById("word-definition");
    wordDefinitionDiv.innerHTML = template({
        word: "hello",
        region: "American", inWhichLanguageOtherUses: "Language or `also`",
        otherSpellings: ["hallo", "hullo"], definitions
    });
}
