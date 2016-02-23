/// <reference path="typings/main.d.ts" />
"use strict";

document.addEventListener('DOMContentLoaded',
                          () => {
                              document.getElementById("define_button").addEventListener("click", test, false);
                              sendRequest(Language.American, "punt");
                          });

enum Language {
    British,
    American
}

function test(): void {
    alert("Button clicked")
}

function sendRequest(language: Language, word: string): void {
    var languageStringValue = (language == Language.American) ? "american_english" : "english";

    var request = new XMLHttpRequest();
    request.open("GET",
        "https://www.oxforddictionaries.com/" +
        "definition/" + languageStringValue + "/" + word);
    request.onload = () => {
        if (request.status !== 200) {
            renderStatus("Bad response from server." +
                "Status: " + request.status);
            return;
        }
        renderStatus(parseHtml(request));
        addEventListenersForAudioElements();
        document.getElementById("define_button").addEventListener("click", test, false);
    };
    request.onerror = () => {
        renderStatus("Error when trying to send request!");
    };

    request.send();
}

function renderStatus(htmlFromDictionary: string): void {
    document.body.innerHTML += htmlFromDictionary;
}

function parseHtml(request: XMLHttpRequest): string {
    var body = document.createElement("body");
    body.innerHTML = request.responseText;
    var wordDefinition = body.querySelectorAll("div.responsive_cell_center");
    var css = <HTMLLinkElement> body.querySelector("link[type='text/css']");
    return css.outerHTML + (<HTMLElement> wordDefinition.item(0)).innerHTML;
}

function addEventListenersForAudioElements(): void {
    var elementsWithPlayClass = document.getElementsByClassName("audio_play_button");
    for (var i = 0; i < elementsWithPlayClass.length; i++) {
        elementsWithPlayClass.item(i).addEventListener("click", function() {
            var srcMp3 = this.getAttribute("data-src-mp3");
            var srcOgg = this.getAttribute("data-src-ogg");

            if (supportAudioHtml5()) {
                playHtml5(srcMp3, srcOgg);
            } else {
                alert("Something wrong with audio!");
            }
        }, false);
    }
}

function supportAudioHtml5() {
    var audioTag  = document.createElement("audio");
    try {
        return (!!(audioTag.canPlayType)
        && ((audioTag.canPlayType("audio/mpeg") != "no" && audioTag.canPlayType("audio/mpeg") != "")
        || (audioTag.canPlayType("audio/ogg") != "no" && audioTag.canPlayType("audio/ogg") != "" )));
    } catch(e) {
        return false;
    }
}

var audio = null;
function playHtml5(srcMp3, srcOgg) {
    if (audio != null){
        // PLODOMAINT-345: avoid overlapping
        if (!audio.ended){
            audio.pause();
            if(audio.currentTime > 0) {
                audio.currentTime = 0
            }
        }
    }

    // Use appropriate source.
    audio = new Audio("");
    if (audio.canPlayType("audio/mpeg") != "no" && audio.canPlayType("audio/mpeg") != "") {
        audio = new Audio(srcMp3);
    } else if (audio.canPlayType("audio/ogg") != "no" && audio.canPlayType("audio/ogg") != "") {
        audio = new Audio(srcOgg);
    }

    // Play
    audio.addEventListener("error", function() {
        alert("Apologies, the sound is not available.");
    });
    audio.play();
}