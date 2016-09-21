/// <reference path="typings/main.d.ts" />
"use strict";

declare function template(message: Object): string;

document.addEventListener("DOMContentLoaded",
    () => {
        const wordDefinitionDiv = document.getElementById("word-definition");
        wordDefinitionDiv.innerHTML = template({
            word: "hello",
            region: "American", inWhichLanguageOtherUses: "Language or `also`",
            otherSpellings: ["hallo", "hullo"]
        });

        const inputField = <HTMLInputElement>
            document.getElementById("word_to_look_up");
        chrome.runtime.onMessage.addListener((request, sender) => {
            if (request.action === "selectedText") {
                inputField.value = request.source;
                lookUpButtonHandler();
            }
        });

        chrome.tabs.executeScript(null, { file: "content.js" }, () => {
            // If you try and inject into an extensions page
            // or the webstore/NTP you'll get an error.
            if (chrome.runtime.lastError) {
                alert("There was an error injecting script: \n"
                    + chrome.runtime.lastError.message);
            }
        });

        document.getElementById("define_button").addEventListener("click",
            lookUpButtonHandler, false);

        inputField.addEventListener("keyup", (event: KeyboardEvent) => {
            const enterButtonCode = 13;
            if (event.keyCode === enterButtonCode) {
                lookUpButtonHandler();
            }
        }, false);

        inputField.focus();
        inputField.select();
    });


enum Language {
    British,
    American
}


function lookUpButtonHandler(): void {
    const word =
        (<HTMLInputElement>document.getElementById("word_to_look_up")).value;

    const languageAsString =
        (<HTMLSelectElement>document.getElementById("language")).value;
    let language: Language;
    if (languageAsString === "american") {
        language = Language.American;
    } else if (languageAsString === "british") {
        language = Language.British;
    } else {
        alert("Wrong language!");
    }

    sendRequest(language, word);
}


function sendRequest(language: Language, word: string): void {
    const languageStringValue = (language === Language.American) ?
        "american_english" : "english";

    const request = new XMLHttpRequest();
    request.open("GET",
        "https://www.oxforddictionaries.com/" +
        "search/?direct=1&multi=1&dictCode=" + languageStringValue
        + "&q=" + word);
    request.onload = () => {
        if (request.status !== 200) {
            alert("Bad response from server. Status: " + request.status);
            return;
        }

        renderStatus(parseHtml(request));

        addEventListenersForAudioElements();
        document.getElementById("define_button").addEventListener("click",
            lookUpButtonHandler, false);

        (<HTMLInputElement>document.getElementById("word_to_look_up"))
            .value = word;
    };
    request.onerror = () => {
        alert("Error when trying to send request!");
    };

    request.send();
}


function renderStatus(htmlFromDictionary: string): void {
    const wordDefinitionDiv = document.getElementById("word_definition");
    wordDefinitionDiv.innerHTML = htmlFromDictionary;
}


function parseHtml(request: XMLHttpRequest): string {
    const body = document.createElement("body");
    body.innerHTML = request.responseText;
    const wordDefinition = body.querySelectorAll("div.responsive_cell_center");
    const css = <HTMLLinkElement>body.querySelector("link[type='text/css']");
    return css.outerHTML + (<HTMLElement>wordDefinition.item(0)).innerHTML;
}


function addEventListenersForAudioElements(): void {
    const elementsWithPlayClass = document
        .getElementsByClassName("audio_play_button");
    for (let i = 0; i < elementsWithPlayClass.length; i++) {
        elementsWithPlayClass.item(i).addEventListener("click", function () {
            const srcMp3 = this.getAttribute("data-src-mp3");
            const srcOgg = this.getAttribute("data-src-ogg");

            if (supportAudioHtml5()) {
                playHtml5(srcMp3, srcOgg);
            } else {
                alert("Something wrong with audio!");
            }
        }, false);
    }
}


function supportAudioHtml5() {
    const audioTag = document.createElement("audio");
    try {
        if (!audioTag.canPlayType) {
            return false;
        }

        const canPlayMpeg = audioTag.canPlayType("audio/mpeg") !== "no"
            && audioTag.canPlayType("audio/mpeg") !== "";
        const canPlayOgg = audioTag.canPlayType("audio/ogg") !== "no"
            && audioTag.canPlayType("audio/ogg") !== "";
        return canPlayMpeg || canPlayOgg;
    } catch (e) {
        return false;
    }
}


let audio = null;
function playHtml5(srcMp3, srcOgg) {
    if (audio != null) {
        if (!audio.ended) {
            audio.pause();
            if (audio.currentTime > 0) {
                audio.currentTime = 0;
            }
        }
    }

    // Use appropriate source.
    audio = new Audio("");
    if (audio.canPlayType("audio/mpeg") !== "no"
        && audio.canPlayType("audio/mpeg") !== "") {
        audio = new Audio(srcMp3);
    } else if (audio.canPlayType("audio/ogg") !== "no"
        && audio.canPlayType("audio/ogg") !== "") {
        audio = new Audio(srcOgg);
    }

    // Play
    audio.addEventListener("error", function () {
        alert("Apologies, the sound is not available.");
    });
    audio.play();
}