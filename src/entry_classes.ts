"use strict";


export class Entry {
    partOfSpeech: string;
    transitivity?: string;
    senses: Sense[];
    otherSpellings?: VariantForm[];
    linkToAudio?: string;

    constructor(partOfSpeech: string, senses: Sense[], linkToAudio?: string,
        transitivity?: string, otherSpellings?: VariantForm[], ) {
        this.partOfSpeech = partOfSpeech;
        this.senses = senses;
        this.transitivity = transitivity;
        this.otherSpellings = otherSpellings;
        this.linkToAudio = linkToAudio;
    }
}


export class Sense {
    definition: string;
    subSenses?: Sense[];
    regions?: string[];
    registers?: string[];

    constructor(definition: string, subSenses?: Sense[], regions?: string[],
        registers?: string[]) {
        this.definition = definition;
        this.subSenses = subSenses;
        this.regions = regions;
        this.registers = registers;
    }
}


export class VariantForm {
    regions: string[];
    text: string;

    constructor(regions: string[], text: string) {
        this.regions = regions;
        this.text = text;
    }
}
