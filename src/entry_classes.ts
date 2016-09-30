"use strict";


export class Entry {
    partOfSpeech: string;
    transitivity?: string;
    senses: Sense[];

    constructor(partOfSpeech: string, senses: Sense[], transitivity?: string) {
        this.partOfSpeech = partOfSpeech;
        this.senses = senses;
        this.transitivity = transitivity;
    }
}


export class Sense {
    definition: string;
    subSenses?: Sense[];
    regions?: string[];

    constructor(definition: string, subSenses?: Sense[], regions?: string[]) {
        this.definition = definition;
        this.subSenses = subSenses;
        this.regions = regions;
    }
}
