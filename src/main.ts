"use strict";


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


class Entry {
    partOfSpeech: string;
    transitivity?: string;
    senses: Sense[];
    region?: string;

    constructor(partOfSpeech: string, senses: Sense[], transitivity?: string,
        region?: string) {
        this.partOfSpeech = partOfSpeech;
        this.senses = senses;
        this.transitivity = transitivity;
        this.region = region;
    }
}


class Sense {
    definition: string;
    subSenses?: Sense[];
    region?: string;

    constructor(definition: string, subSenses?: Sense[], region?: string) {
        this.definition = definition;
        this.subSenses = subSenses;
        this.region = region;
    }
}
