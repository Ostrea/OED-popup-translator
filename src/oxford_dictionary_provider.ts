"use strict";


import { APP_ID, APP_KEY } from "./secrets";
import { Entry } from "./entry_classes";


const BASE_URL = "https://od-api.oxforddictionaries.com:443/api/v1/";


export function lookUpWord(word: string, region: string,
    populateTemplate: (entries: Entry[]) => void) {
    const lookUpUrl = BASE_URL + "entries/en/" + word.toLowerCase()
        + "/regions=" + region;

    const request = new XMLHttpRequest();
    request.open("GET", lookUpUrl);
    request.setRequestHeader("app_id", APP_ID);
    request.setRequestHeader("app_key", APP_KEY);

    request.onload = () => {
        if (request.status !== 200) {
            alert("Bad response from server. Status: " + request.status);
            return;
        }
        const entries = processJson(request.responseText);
        populateTemplate(entries);
    };
    request.onerror = () => {
        alert("Error when trying to send request!");
    };

    request.send();
}


function processJson(json: string): Entry[] {
    alert(json);
    return [];
}
