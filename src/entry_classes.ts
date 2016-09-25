"use strict";


export class Entry {
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


export class Sense {
    definition: string;
    subSenses?: Sense[];
    region?: string;

    constructor(definition: string, subSenses?: Sense[], region?: string) {
        this.definition = definition;
        this.subSenses = subSenses;
        this.region = region;
    }
}
